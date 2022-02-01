import Web3 from "web3";

const web3 = new Web3(
  new Web3.providers.HttpProvider(
    "https://speedy-nodes-nyc.moralis.io/4e1189a754ae4f5201f35f92/avalanche/mainnet"
  )
);

async function getContractCreatorAddress(contractAddress) {
  console.log("get contract creator 1 ");
  let currentBlockNum = await web3.eth.getBlockNumber();
  let txFound = false;

  while (currentBlockNum >= 0 && !txFound) {
    const block = await web3.eth.getBlock(currentBlockNum, true);
    const transactions = block.transactions;

    for (let j = 0; j < transactions.length; j++) {
      // We know this is a Contract deployment
      //console.log(j);
      if (!transactions[j].to) {
        const receipt = await web3.eth.getTransactionReceipt(
          transactions[j].hash
        );
        if (
          receipt.contractAddress &&
          receipt.contractAddress.toLowerCase() ===
            contractAddress.toLowerCase()
        ) {
          txFound = true;
          console.log(`Contract Creator Address 1: ${transactions[j].from}`);
          return transactions[j].from;
          break;
        }
      }
    }

    currentBlockNum--;
  }
}
export default getContractCreatorAddress;
