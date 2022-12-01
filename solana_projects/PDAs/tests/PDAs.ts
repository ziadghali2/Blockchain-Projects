import * as anchor from "@project-serum/anchor";
import { PdAs } from "../target/types/pd_as";

function shortKey(key: anchor.web3.PublicKey) {
  return key.toString().substring(0,8);
}

describe("PDAs", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.PdAs as anchor.Program<PdAs>;

  async function generateKeypair() {
    let keypair = anchor.web3.Keypair.generate();
    await provider.connection.requestAirdrop(keypair.publicKey, anchor.web3.LAMPORTS_PER_SOL * 2);
    // sleep for 3 sec
    await new Promise(resolve => setTimeout(resolve, 3 * 1000)); 
    return keypair
  }

  async function derivePDA(color: String, pubKey: anchor.web3.PublicKey) {
    return await anchor.web3.PublicKey.findProgramAddress(
      [
        pubKey.toBuffer(),
        Buffer.from("_"),
        Buffer.from(color),
      ],
      program.programId
    ).then((value) => value[0]);

  }

  async function createLedgerAccount(color: String, pda: anchor.web3.PublicKey, wallet: anchor.web3.Keypair) {
    await program.methods.createLedger(color)
    .accounts({
      ledgerAccount: pda,
      wallet: wallet.publicKey,
    })
    .signers([wallet])
    .rpc();
  }

  async function modifyLedgerAccount(color: String, newBalance: number, wallet: anchor.web3.Keypair) {
    let pda = await derivePDA(color, wallet.publicKey);
    let data;

    console.log(`----------------------------------------------`);
    console.log(`Checking if account ${shortKey(pda)} exist for color: ${color}...`);

    try {
      data = await program.account.ledger.fetch(pda);
      console.log("fetching data ---- its done");
    } catch (err) {
      console.log("It does NOT. Creating...");
      await createLedgerAccount(color, pda, wallet);
      data = await program.account.ledger.fetch(pda); 
    }
    
    console.log("Success.");
    console.log("Data:")
    console.log(`    Color: ${data.color}   Balance: ${data.balance}`);
    console.log(`Modifying balance of ${data.color} from ${data.balance} to ${newBalance}`);

    await program.methods.modifyLedger(newBalance)
      .accounts({
        ledgerAccount: pda,
        wallet: wallet.publicKey
      })
      .signers([wallet])
      .rpc();

      data = await program.account.ledger.fetch(pda);
      console.log("New Data:")
      console.log(`    Color: ${data.color}   Balance: ${data.balance}`);
      console.log("Success.");
  }

  it("An example of PDAs in action", async () => {
    const test_keypair1 = await generateKeypair();
    await modifyLedgerAccount("red", 2, test_keypair1);
    await modifyLedgerAccount("red", 4, test_keypair1);
    await modifyLedgerAccount("blue", 3, test_keypair1);

    const test_keypair2 = await generateKeypair();
    await modifyLedgerAccount("red", 3, test_keypair2);
    await modifyLedgerAccount("green", 5, test_keypair2);
  });
});
