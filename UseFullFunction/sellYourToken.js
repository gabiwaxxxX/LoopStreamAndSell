import ethers from "ethers";
import chalk from "chalk";

import getWalletBalanceOfToken from "./getWalletBalance.js";

const data = {
  mnemonic: process.env.MNEMONIC,
};
const https =
  "https://speedy-nodes-nyc.moralis.io/4e1189a754ae4f5201f35f92/avalanche/mainnet";

const provider = new ethers.providers.JsonRpcProvider(https);
const wallet = ethers.Wallet.fromMnemonic(data.mnemonic);
const account = wallet.connect(provider);

async function sellYourToken(
  routerAddr,
  tokenIn,
  amountIn,
  tokenOut,
  myAddress
) {
  let amountOutMin = 0;

  const router = new ethers.Contract(
    routerAddr,
    [
      "function getAmountsOut(uint amountIn, address[] memory path) public view returns (uint[] memory amounts)",
      "function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)",
      "function swapExactTokensForTokensSupportingFeeOnTransferTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)",
    ],
    account
  );

  console.log(
    chalk.green.inverse(`Start to sell \n`) +
      `Selling Token
         =================
         tokenIn: ${(amountIn * 1e-18).toString()} ${tokenIn} 

         tokenOut:${tokenOut} 
       `
  );

  try {
    const amountTosell = await getWalletBalanceOfToken(myAddress, tokenIn);

    console.log(amountTosell);
    let tx = await router.swapExactTokensForTokens(
      //uncomment here if you want to buy token
      amountTosell[1],
      amountOutMin,
      [tokenIn, tokenOut],
      myAddress,
      Date.now() + 1000 * 60 * 2, //5 minutes
      {
        gasLimit: 126556,
        gasPrice: ethers.utils.parseUnits("330", "gwei"),
        nonce: null, //set you want buy at where position in blocks
      }
    );

    const selling = await tx.wait();
    console.log(
      `Transaction selling: https://snowtrace.io//tx/${selling.logs[1].transactionHash}`
    );
  } catch (error) {
    console.log(error);
  }
}

export default sellYourToken;
