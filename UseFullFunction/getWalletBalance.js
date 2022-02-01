import ethers from "ethers";

import Web3 from "web3";

const data = {
  mnemonic: process.env.MNEMONIC,
};

const https =
  "https://speedy-nodes-nyc.moralis.io/4e1189a754ae4f5201f35f92/avalanche/mainnet";

const provider = new ethers.providers.JsonRpcProvider(https);

const wallet = ethers.Wallet.fromMnemonic(data.mnemonic);
const account = wallet.connect(provider);

async function getWalletBalanceOfToken(walletAddress, tokenAdress) {
  const contract = new ethers.Contract(
    tokenAdress,
    ["function balanceOf(address account) external view returns (uint256)"],
    account
  );
  const balanceOfTx = await contract.balanceOf(walletAddress);
  const balanceOfDecimal = ethers.utils.formatEther(balanceOfTx);
  //console.log([balanceOfDecimal, balanceOfTx]);
  return [balanceOfDecimal, balanceOfTx];
}

export default getWalletBalanceOfToken;
