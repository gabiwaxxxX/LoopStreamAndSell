import TransactionChecker from "./TriggerEventAdress.js";
import ScrappingCreatorAddress from "./ScrappingCreatorAddress.js";
import getWalletBalanceOfToken from "./getWalletBalance.js";
import sellYourToken from "./sellYourToken.js";
const data = {
  mnemonic: process.env.MNEMONIC,
  myAddress: process.env.YOUR_ADDRESS,
};

const routerAddr = "0x60aE616a2155Ee3d9A68541Ba4544862310933d4";

async function streamSwapAndSellInCase() {
  let myAddressChecker = new TransactionChecker(data.myAddress, 0);
  myAddressChecker.subscribe("pendingTransactions");
  const tokens = await myAddressChecker.watchTransactions();
  myAddressChecker.unsubscribe();

  console.log(tokens);

  const amountTosell = await getWalletBalanceOfToken(data.myAddress, tokens[1]);

  console.log(amountTosell);

  const walletCreator = await ScrappingCreatorAddress(tokens[1]);

  console.log(walletCreator);

  let walletCreatorChecker = new TransactionChecker(walletCreator, 1);
  walletCreatorChecker.subscribe("pendingTransactions");
  const Action = await walletCreatorChecker.watchTransactions();
  walletCreatorChecker.unsubscribe();

  if (Action[1] == "JoeRouter02") {
    await sellYourToken(
      routerAddr,
      tokens[1],
      amountTosell[1],
      tokens[0],
      myAddress
    );
  }
}

export default streamSwapAndSellInCase;
