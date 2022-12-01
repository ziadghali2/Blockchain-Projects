// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const { ethers, upgrades } = require("hardhat");

async function main() {

  const PROXY_CONTRACT = "0x6cB73CFBeac31ba1337D4a78A7dEA00a7dBbd8fb";
  const Box2 = await ethers.getContractFactory("Box2");
  await upgrades.upgradeProxy(PROXY_CONTRACT, Box2);

  console.log("Box upgraded");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
