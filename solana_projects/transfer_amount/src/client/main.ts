import {
    Connection,
    Keypair,
    LAMPORTS_PER_SOL,
    PublicKey,
    sendAndConfirmTransaction,
    SystemProgram,
    Transaction,
    TransactionInstruction,
} from '@solana/web3.js';
import {readFileSync} from "fs";
import path from 'path';
import * as BufferLayout from '@solana/buffer-layout';

// const lo = require("buffer-layout");


const SOLANA_NETWORK = "devnet";

let connection: Connection;
let programKeypair: Keypair;
let programId: PublicKey;

let ringoKeypair: Keypair;
let georgeKeypair: Keypair;
let paulKeypair: Keypair;
let johnKeypair: Keypair;

function createKeypairFromFile(path: string): Keypair {
    return Keypair.fromSecretKey(Buffer.from(JSON.parse(readFileSync(path, "utf-8"))))
}

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

async function transferLamports(from: Keypair, to: PublicKey, amount: number) {
    let buffer_8byte = Buffer.alloc(8);
    BufferLayout.ns64("value").encode(amount, buffer_8byte);

    let instruction = new TransactionInstruction({
        keys: [
            {pubkey: from.publicKey, isSigner: true, isWritable: false},
            {pubkey: to, isSigner: false, isWritable: true},
            {pubkey: SystemProgram.programId, isSigner: false, isWritable: false},
        ],
        programId,
        data: buffer_8byte
    });

    await sendAndConfirmTransaction(connection, new Transaction().add(instruction), [from]);
}


async function main() {
    connection = new Connection(`https://api.${SOLANA_NETWORK}.solana.com`, 'confirmed');

    programKeypair = createKeypairFromFile(
        path.join(
            path.resolve(__dirname, '../../dist/program'), 
            'transfer_sol-keypair.json'
        )
    );
    programId = programKeypair.publicKey;

    georgeKeypair = createKeypairFromFile(__dirname + "/../../accounts/george.json");
    ringoKeypair = createKeypairFromFile(__dirname + "/../../accounts/ringo.json");
    paulKeypair = createKeypairFromFile(__dirname + "/../../accounts/paul.json");
    johnKeypair = createKeypairFromFile(__dirname + "/../../accounts/john.json");
    
    await addAmmountToPublicKey(paulKeypair.publicKey, 1);
    await addAmmountToPublicKey(ringoKeypair.publicKey, 1);

    // John sends some SOL to Ringo.
    console.log("John sends some SOL to Ringo...");
    console.log(`   John's public key: ${johnKeypair.publicKey}`);
    console.log(`   Ringo's public key: ${ringoKeypair.publicKey}`);
    await transferLamports(johnKeypair, ringoKeypair.publicKey, 5000000);

    // Paul sends some SOL to George.
    console.log("Paul sends some SOL to George...");
    console.log(`   Paul's public key: ${paulKeypair.publicKey}`);
    console.log(`   George's public key: ${georgeKeypair.publicKey}`);
    await transferLamports(paulKeypair, georgeKeypair.publicKey, 2000000000);

    // George sends some SOL over to John.
    console.log("George sends some SOL over to John...");
    console.log(`   George's public key: ${georgeKeypair.publicKey}`);
    console.log(`   John's public key: ${johnKeypair.publicKey}`);
    await transferLamports(georgeKeypair, johnKeypair.publicKey, 500000000);

}

main().then(
    () => process.exit(),
    (err) => {
        console.log(err);
        process.exit(-1)
    }
);