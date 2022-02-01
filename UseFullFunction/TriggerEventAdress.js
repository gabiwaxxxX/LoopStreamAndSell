import Web3 from "web3";
import axios from "axios";
import abidecoder from "abi-decoder";
import ethers from "ethers";
class TransactionChecker {
  web3;
  web3ws;
  account;
  subscription;
  type;

  constructor(account, type) {
    this.web3ws = new Web3(
      new Web3.providers.WebsocketProvider(
        "wss://speedy-nodes-nyc.moralis.io/4e1189a754ae4f5201f35f92/avalanche/mainnet/ws"
      )
    );
    this.web3 = new Web3(
      new Web3.providers.HttpProvider(
        "https://speedy-nodes-nyc.moralis.io/4e1189a754ae4f5201f35f92/avalanche/mainnet"
      )
    );
    this.account = account.toLowerCase();
    this.type = type;
  }

  subscribe(topic) {
    this.subscription = this.web3ws.eth.subscribe(topic, (err, res) => {
      if (err) console.error(err);
    });
  }

  unsubscribe() {
    this.subscription.unsubscribe(function (error, success) {
      if (success) console.log("Successfully unsubscribed!");
    });
  }

  watchTransactions() {
    console.log("Watching all pending transactions...", this.account);
    return new Promise((resolve, reject) => {
      this.subscription.on("data", (txHash) => {
        setTimeout(async () => {
          try {
            let tx = await this.web3.eth.getTransaction(txHash);
            if (tx == null) return;

            if (this.account == tx.from.toLowerCase()) {
              console.log({
                address: tx.to,
                value: this.web3.utils.fromWei(tx.value, "ether"),
                timestamp: new Date(),
              });
              const [ABI, contractName] = await this.checkContract(tx.to);

              if (ABI != "Contract source code not verified") {
                abidecoder.addABI(JSON.parse(ABI));
                const decodedData = abidecoder.decodeMethod(tx.input);
                console.log(decodedData.name);
                console.log("==============");
                if (this.type == 0) {
                  if (
                    decodedData.name == "swapExactTokensForTokens" ||
                    decodedData.name == "swapTokensForExactTokens"
                  ) {
                    let tokenIn =
                      decodedData.params[2]["value"][
                        decodedData.params[2]["value"].length - 2
                      ];
                    let tokenOut =
                      decodedData.params[2]["value"][
                        decodedData.params[2]["value"].length - 1
                      ];
                    this.approve(tokenOut, tx.to);
                    resolve([tokenIn, tokenOut]);
                  } else if (decodedData.name == "swapExactAVAXForTokens") {
                    let tokenIn =
                      decodedData.params[1]["value"][
                        decodedData.params[1]["value"].length - 2
                      ];
                    let tokenOut =
                      decodedData.params[1]["value"][
                        decodedData.params[1]["value"].length - 1
                      ];
                    this.approve(tokenOut, tx.to);
                    resolve([tokenIn, tokenOut]);
                  }
                } else {
                  if (decodedData.name == "approve") {
                    //console.log(decodedData);
                    const [ABI1, contractName1] = await this.checkContract(
                      decodedData.params[0]["value"]
                    );

                    console.log([
                      decodedData.params[0]["address"],
                      contractName1,
                    ]);
                    if (contractName1 != undefined) {
                      resolve([
                        decodedData.params[0]["address"],
                        contractName1,
                      ]);
                    }

                    //contractApproved;
                  }
                }
              }
            }
          } catch (err) {
            console.error(err);
          }
        }, 500);
      });
    });
  }
  async checkContract(address) {
    const response = await axios.get(
      `https://api.snowtrace.io/api?module=contract&action=getsourcecode&address=${address}&apikey=J2QRNCXY75M8XWT2X9UK1Z9SVCNIRGKT5E`
    );

    return [response.data.result[0].ABI, response.data.result[0].ContractName];
  }

  async approve(adress, router) {
    const data = {
      mnemonic: process.env.MNEMONIC,
      myAddress: process.env.YOUR_ADDRESS,
    };
    const https =
      "https://speedy-nodes-nyc.moralis.io/4e1189a754ae4f5201f35f92/avalanche/mainnet";

    const provider = new ethers.providers.JsonRpcProvider(https);
    const wallet = ethers.Wallet.fromMnemonic(data.mnemonic);
    const account = wallet.connect(provider);

    const tokenOut = new ethers.Contract(
      adress,
      ["function approve(address spender, uint amount) public returns(bool)"],
      account
    );

    const amount = ethers.utils.parseUnits("1000000", "ether");
    try {
      let tx = await tokenOut.approve(router, amount, {
        gasLimit: 126556,
        gasPrice: ethers.utils.parseUnits("330", "gwei"),
        nonce: null, //set you want buy at where position in blocks
      });
      const receipt = await tx.wait();
      console.log(
        `Transaction approve: https://snowtrace.io//tx/${receipt.transactionHash}`
      );
    } catch (e) {
      console.log("une erreoeee", e);
    }
  }
}

export default TransactionChecker;
