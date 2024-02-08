import { getWeth, AMOUNT } from "./getWeth"
import { ethers, getNamedAccounts, network } from "hardhat"
import { Signer } from "ethers"
import { networkConfig } from "../helper-hardhat-config"
import { IPool } from "../typechain-types"

async function main() {
    await getWeth()
    const { deployer } = await getNamedAccounts()
    const signer = await ethers.getSigner(deployer)
    const pool = await getLendingPool(signer)

    const wethTokenAddress = networkConfig[network.config!.chainId!].wethToken!
    await approveErc20(wethTokenAddress, await pool.getAddress(), AMOUNT, signer)

    console.log(
        `Depositing WETH using ${wethTokenAddress} as WETH token and ${deployer} as address`,
    )
    // await pool.deposit(wethTokenAddress, AMOUNT, deployer, 0)
    await pool.supply(wethTokenAddress, AMOUNT, deployer, 0)
    console.log("Desposited!")

    let [availableBorrowsETH] = await getBorrowUserData(pool, signer)

    /* const daiPrice = */ await getDaiPrice() //* not necessary anymore since getBorrowUserData returns values in USD/base aave currency
    // const amountDaiToBorrow = availableBorrowsETH / daiPrice

    const amountDaiToBorrowGwei = availableBorrowsETH * BigInt(9) // availableBorrowsETH / BigInt(200) // TODO to be more precisely -> should get this info from https://docs.aave.com/developers/periphery-contracts/uipooldataproviderv3#basecurrencyinfo | depends of coin! dai->18 usdc->6
    const amountDaiToBorrowWei = ethers.parseUnits(amountDaiToBorrowGwei.toString(), "gwei")
    console.log(`You can borrow ${amountDaiToBorrowWei.toString()} DAI`)

    await borrowDai(
        networkConfig[network.config!.chainId!].daiToken!,
        pool,
        amountDaiToBorrowWei,
        deployer,
    )

    await getBorrowUserData(pool, signer)
    await repay(
        amountDaiToBorrowWei,
        networkConfig[network.config!.chainId!].daiToken!,
        pool,
        signer,
    )
    await getBorrowUserData(pool, signer)
}

async function getLendingPool(account: Signer): Promise<IPool> {
    const poolAddressesProvider = await ethers.getContractAt(
        "IPoolAddressesProvider",
        networkConfig[network.config!.chainId!].poolAddressesProvider!,
        account,
    )
    const poolAddress = await poolAddressesProvider.getPool()
    const pool = await ethers.getContractAt("IPool", poolAddress, account)
    return pool
}

async function approveErc20(
    erc20Address: string,
    spenderAddress: string,
    amount: string,
    signer: Signer,
) {
    const erc20Token = await ethers.getContractAt("IERC20", erc20Address, signer)
    const txResponse = await erc20Token.approve(spenderAddress, amount)
    await txResponse.wait(1)
    console.log("Approved!")
}

async function getBorrowUserData(pool: IPool, account: Signer): Promise<[bigint, bigint]> {
    const { totalCollateralBase, totalDebtBase, availableBorrowsBase } =
        await pool.getUserAccountData(account)
    console.log(`You have ${totalCollateralBase} worth of USD deposited.`)
    console.log(`You have ${totalDebtBase} worth of usd borrowed.`)
    console.log(`You can borrow ${availableBorrowsBase} worth of USD.`)
    return [availableBorrowsBase, totalDebtBase]
}

async function getDaiPrice() {
    const daiEthPriceFeed = await ethers.getContractAt(
        "AggregatorV3Interface",
        networkConfig[network.config!.chainId!].daiEthPriceFeed!,
    )
    const price = (await daiEthPriceFeed.latestRoundData())[1]
    console.log(`The DAI/ETH price is ${price.toString()}`)
    return price
}

async function borrowDai(
    daiAddress: string,
    pool: IPool,
    amountDaiToBorrow: bigint,
    account: string,
) {
    const borrowTx = await pool.borrow(daiAddress, amountDaiToBorrow, 2, 0, account)
    await borrowTx.wait(1)
    console.log("You've borrowed!")
}

async function repay(amount: bigint, daiAddress: string, pool: IPool, account: Signer) {
    await approveErc20(daiAddress, await pool.getAddress(), amount.toString(), account)
    const repayTx = await pool.repay(daiAddress, amount, 2, account)
    await repayTx.wait(1)
    console.log("Repaid!")
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
