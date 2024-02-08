// @ts-ignore
import { ethers, getNamedAccounts, network } from "hardhat"
import { networkConfig } from "../helper-hardhat-config"

export const AMOUNT = ethers.parseEther("0.1").toString()

export async function getWeth() {
    const { deployer } = await getNamedAccounts()
    const signer = await ethers.getSigner(deployer)
    const iWeth = await ethers.getContractAt(
        "IWeth",
        networkConfig[network.config!.chainId!].wethToken!,
        signer,
    )
    const txResponse = await iWeth.deposit({
        value: AMOUNT,
    })
    await txResponse.wait(1)
    const wethBalance = await iWeth.balanceOf(deployer)
    console.log(`Got ${wethBalance.toString()} WETH`)
}
