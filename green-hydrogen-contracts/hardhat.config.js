require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.28",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    sepolia: {
      url: process.env.ALCHEMY_SEPOLIA_URL,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 11155111,
    },
    hardhat: {
      chainId: 31337,
    },
  },
  // Etherscan verification (optional - FREE for Sepolia testnet)
  // etherscan: {
  //   apiKey: process.env.ETHERSCAN_API_KEY || "",
  //   // Alternative: Use Blockscout for networks that support it
  //   customChains: [
  //     {
  //       network: "sepolia",
  //       chainId: 11155111,
  //       urls: {
  //         apiURL: "https://api-sepolia.etherscan.io/api",
  //         browserURL: "https://sepolia.etherscan.io"
  //       }
  //     }
  //   ]
  // },
  // Alternative verification plugins
  sourcify: {
    enabled: true
  },
  // Blockscout verification for Sepolia
  etherscan: {
    apiKey: {
      sepolia: "abc123" // Blockscout doesn't require real API key
    },
    customChains: [
      {
        network: "sepolia",
        chainId: 11155111,
        urls: {
          apiURL: "https://eth-sepolia.blockscout.com/api",
          browserURL: "https://eth-sepolia.blockscout.com"
        }
      }
    ]
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
};
