import("@nomiclabs/hardhat-waffle")
import("hardhat-gas-reporter")
import("./tasks/block-number")
import("@nomiclabs/hardhat-etherscan")
import { task, HardhatUserConfig } from "hardhat/config"
import "./tasks/block-number"
import "dotenv/config"
import "solidity-coverage"
import "@typechain/hardhat"
import "@nomiclabs/hardhat-ethers"

const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY || ""
const SEPOLIA_RPC_URL =
  process.env.SEPOLIA_RPC_URL ||
  "https://eth-sepolia.g.alchemy.com/v2/your-api-key"
const PRIVATE_KEY = process.env.PRIVATE_KEY || ""
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || ""

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {},
    sepolia: {
      url: SEPOLIA_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 11155111,
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      accounts: [
        "0xdf57089febbacf7ba0bc227dafbffa9fc08a93fdc68e1e42411a14efcf23656e",
      ],
    },
  },
  solidity: "0.8.7",
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
  gasReporter: {
    enabled: true,
    currency: "USD",
    outputFile: "gas-report.txt",
    noColors: true,
    coinmarketcap: COINMARKETCAP_API_KEY,
  },
}

export default config
