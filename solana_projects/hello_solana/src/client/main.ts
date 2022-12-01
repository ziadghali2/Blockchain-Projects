import {
    Keypair,
    Connection,
    PublicKey,
    LAMPORTS_PER_SOL,
    Transaction,
    TransactionInstruction,
    sendAndConfirmTransaction,
} from '@solana/web3.js';
import fs from 'mz/fs';
import path from 'path';


const PROGRAM_KEYPAIR_PATH = path.join(
    path.resolve(__dirname, "../../dist/program"),
    "hello_solana-keypair.json"
);

async function main() {

    console.log("Launching client...");

    // connect to solana dev net
    let connection = new Connection("https://api.devnet.solana.com", "confirmed");

    // get program publick key
    const secretKeyString = await fs.readFile(PROGRAM_KEYPAIR_PATH, { encoding: "utf8" });
    const secretKey = Uint8Array.from(JSON.parse(secretKeyString));
    const programKeypair = Keypair.fromSecretKey(secretKey);
    let programId = programKeypair.publicKey;

    // create account to transact with program
    const triggerKeypair = Keypair.generate();
    const airdropSignature = await connection.requestAirdrop(triggerKeypair.publicKey, LAMPORTS_PER_SOL);

    const latestBlockHash = await connection.getLatestBlockhash();
    await connection.confirmTransaction({
        signature: airdropSignature,
        blockhash: latestBlockHash.blockhash,
        lastValidBlockHeight: latestBlockHash.lastValidBlockHeight
    });

    // conduct a transaction with program
    console.log('--Pining Program', programId.toBase58());

    const instruction = new TransactionInstruction({
        keys: [{ pubkey: triggerKeypair.publicKey, isSigner: false, isWritable: true }],
        programId: programId,
        data: Buffer.alloc(0)
    });

    await sendAndConfirmTransaction(connection, new Transaction().add(instruction), [triggerKeypair]);

}

main().then(() => {
    process.exit();
}, (err) => {
    console.error(err);
    process.exit(-1);
});