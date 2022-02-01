import Web3 from "web3";

const web3 = new Web3(
  new Web3.providers.HttpProvider(
    "https://speedy-nodes-nyc.moralis.io/4e1189a754ae4f5201f35f92/avalanche/mainnet"
  )
);

async function getContractCreatorAddress2(contractAddress, otherAddress) {
  console.log("get contract creator 2 ");
  let currentBlockNum = await web3.eth.getBlockNumber();
  let txFound = false;

  while (currentBlockNum >= 0 && !txFound) {
    const block = await web3.eth.getBlock(currentBlockNum, true);
    const transactions = block.transactions;
    for (let j = 0; j < transactions.length; j++) {
      console.log(transactions[j].input.slice(0, 10));
      if (transactions[j].input.includes("0xf91b3f72")) {
        console.log("================================");
        console.log(transactions[j].input);
        console.log("================================");
        if (transactions[j].input.includes(contractAddress.slice(2))) {
          console.log(transactions[j]);
          console.log("=============");
          const receipt = await web3.eth.getTransactionReceipt(
            transactions[j].hash
          );
          txFound = true;
          console.log(`Contract Creator Address 2: ${transactions[j].from}`);
          return transactions[j].from;
          break;
        }
      }
    }

    currentBlockNum--;
  }
}
export default getContractCreatorAddress2;
