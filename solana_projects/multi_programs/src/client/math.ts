import {
  Keypair,
  Connection,
  PublicKey,
  LAMPORTS_PER_SOL,
  SystemProgram,
  TransactionInstruction,
  Transaction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";

import { 
  createKeypairFromFile,
  createCalculatorInstructions,
  getStringForInstruction,
} from "./util";

import path from "path";
import os from "os";
import fs from "mz/fs";
import yaml from "yaml";

const CONFIG_FILE_PATH = path.resolve(
  os.homedir(),
  '.config',
  'solana',
  'cli',
  'config.yml',
);

const PROGRAM_PATH = path.resolve(__dirname, "../../dist/program");

let connection: Connection;
let localKeypair: Keypair;
let programKeypair: Keypair;
let programId: PublicKey;
let clientPubKey: PublicKey;

// Connect to dev net.
export async function connect() {
  connection = new Connection("https://api.devnet.solana.com", "confirmed");
  console.log(`Successfully connected to Solana dev net.`);
}

// Use local keypair for client.

async function addAmmountToPublicKey(key: PublicKey, sol_amount: number) {
  const airdropSignature = await connection.requestAirdrop(
    key,
    LAMPORTS_PER_SOL * sol_amount
  );

  const latestBlockHash = await connection.getLatestBlockhash();

  await connection.confirmTransaction({
    signature: airdropSignature,
    blockhash: latestBlockHash.blockhash,
    lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
  });
}

export async function getLocalAccount() {
  const configYaml = await fs.readFile(CONFIG_FILE_PATH, {encoding: 'utf8'});
  const keypairPath = await yaml.parse(configYaml).keypair_path;
  localKeypair = await createKeypairFromFile(keypairPath);

  await addAmmountToPublicKey(localKeypair.publicKey, 2);

  console.log(`Local account loaded successfully.`);
  console.log(`Local account's address is:`);
  console.log(`   ${localKeypair.publicKey}`);
}

// Get the targeted program.
export async function getProgram(programName: String) {
  const program_path = path.join(PROGRAM_PATH, programName + "-keypair.json");
  programKeypair = await createKeypairFromFile(program_path);
  programId = programKeypair.publicKey;

  console.log(`We're going to ping the ${programName} program.`);
  console.log(`It's Program ID is:`);
  console.log(`   ${programId.toBase58()}`);
}

// Configure client account.

async function configureClientAccount(accountSpaceSize: number) {
    const SEED = 'test1';
    clientPubKey = await PublicKey.createWithSeed(localKeypair.publicKey, SEED, programId);

    console.log(`For simplicity's sake, we've created an address using a seed.`);
    console.log(`That seed is just the string "test(num)".`);
    console.log(`The generated address is:`);
    console.log(`   ${clientPubKey.toBase58()}`);

    // Make sure it doesn't exist already.
    const clientAccount = await connection.getAccountInfo(clientPubKey);
    if (clientAccount == null) {
        console.log(`Looks like that account does not exist. Let's create it.`);
        
        const transaction = new Transaction().add(
            SystemProgram.createAccountWithSeed({
                basePubkey: localKeypair.publicKey,
                fromPubkey: localKeypair.publicKey,
                programId: programId,
                seed: SEED,
                newAccountPubkey: clientPubKey,
                lamports: LAMPORTS_PER_SOL,
                space: accountSpaceSize
            })
        );

        await sendAndConfirmTransaction(connection, transaction, [localKeypair]);

        console.log(`Client account created successfully.`);
    } else {
        console.log(`Looks like that account exists already. We can just use it.`);
    }
}

// Ping the program.
export async function pingProgram(programName: string) {
    console.log(`All right, let's run it.`);
    console.log(`Pinging ${programName} program...`);

    const instruction = new TransactionInstruction({
        keys: [{pubkey: clientPubKey, isSigner: false, isWritable: true}],
        programId,
        data: Buffer.alloc(0), // Empty instruction data
    });

    await sendAndConfirmTransaction(
        connection,
        new Transaction().add(instruction),
        [localKeypair],
    );
    console.log(`Ping successful.`);
}

// Ping the calculator program.
export async function pingCalculator(operation: number, operating_value: number) {

  console.log(`All right, let's run it.`);
  console.log(`Pinging calculator program...`);

  const instructions_Buffer =  await createCalculatorInstructions(operation, operating_value);

  console.log(`We're going to ${await getStringForInstruction(operation, operating_value)}`)

  const instruction = new  TransactionInstruction({
    keys:[{pubkey: clientPubKey, isSigner: false, isWritable: true}],
    programId,
    data: instructions_Buffer
  });
  
  let transaction = new Transaction().add(instruction);
  await sendAndConfirmTransaction(connection, transaction, [localKeypair]);
  
  console.log(`Ping successful.`);
}

export async function example(programName: string, accountSpaceSize: number)  {
  await connect();
  await getLocalAccount();
  await getProgram(programName);
  await configureClientAccount(accountSpaceSize);
  if (programName == 'calculator') {
    await pingCalculator(1, 4); // add 4
    await pingCalculator(2, 3); // subtract 3
    await pingCalculator(3, 2); // multiply 2
  } else {
    await pingProgram(programName);
  }
}
