import ethers from "ethers";

import Web3 from "web3";

async function findAllLiqPools(factoryAddress, tokenAdress) {
  const factory = new ethers.Contract(factoryAddress, [
    "function allPairsLength() external view returns (uint256)",
    "function allPairs(uint256) external view returns (address pair)",
  ]);
  const allPairsLength = await factory.allPairsLength();
  for (let i = 0; i < allPairsLength; i++) {
    const allPairs = await factory.allPairs(i);
  }

  return;
}

async function getContract(tokenAddress) {
  if (tokenAddress in this.contract) {
    return this.contract[tokenAddress];
  }

  const tokenContract = getContractAsERC20(tokenAddress);
  this.contract[tokenAddress] = tokenContract;
  return tokenContract;
}

export default findAllLiqPools;
