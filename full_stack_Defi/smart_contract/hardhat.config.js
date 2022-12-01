require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-waffle")
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.9",
  networks: {
    goerli: {
      url: 'https://eth-goerli.g.alchemy.com/v2/5TaFZaZhG9ep6BUrQGD8R3DDelrw3UQn',
      accounts: ['7198771ca03b410e8e67c475224f0f4dad766af6855c3f9e434b98bf8cb34c28']
    }
  }
};
