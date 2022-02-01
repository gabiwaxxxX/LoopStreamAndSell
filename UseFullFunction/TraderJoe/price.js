const ERC20ContractABI = require("../../abis/ERC20ContractABI.json");
const JoeBarContractABI = require("../../abis/JoeBarContractABI.json");
const JoeFactoryContractABI = require("../../abis/JoeFactoryContractABI.json");

import ERC20ContractABI from "./abis/ERC20ContractABI.json";
import JoeBarContractABI from "./abis/JoeBarContractABI.json";
import 

function getContract(tokenAddress) {
    if (tokenAddress in this.contract) {
      return this.contract[tokenAddress];
    }

    const tokenContract = getContractAsERC20(tokenAddress);
    this.contract[tokenAddress] = tokenContract;
    return tokenContract;
  }