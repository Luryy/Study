export interface networkConfigItem {
    name?: string
    wethToken?: string
    poolAddressesProvider?: string
    daiEthPriceFeed?: string
    daiToken?: string
    blockConfirmations?: number
}

export interface networkConfigInfo {
    [key: string]: networkConfigItem
}

export const networkConfig: networkConfigInfo = {
    31337: {
        name: "localhost",
        wethToken: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
        poolAddressesProvider: "0x2f39d218133AFaB8F2B819B1066c7E434Ad94E9e",
        daiEthPriceFeed: "0x773616E4d11A78F511299002da57A0a94577F1f4",
        daiToken: "0x6b175474e89094c44da98b954eedeac495271d0f",
    },
    11155111: {
        name: "sepolia",
        wethToken: "0xC558DBdd856501FCd9aaF1E62eae57A9F0629a3c",
        poolAddressesProvider: "0x012bAC54348C0E635dCAc9D5FB99f06F24136C9A",
        // DAI / ETH doesn't exist on sepolia, so we're using LINK / ETH
        daiEthPriceFeed: "0xb4c4a493AB6356497713A78FFA6c60FB53517c63",
        // For this... we are just going to use LINK
        daiToken: "0x779877A7B0D9E8603169DdbD7836e478b4624789",
        // daiToken: "0xaA8E23Fb1079EA71e0a56F48a2aA51851D8433D0",
    },
}

export const developmentChains = ["hardhat", "localhost"]
