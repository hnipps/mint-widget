import { Contract, ethers } from "ethers";

const fetchTotalSupply = (registry: Contract) => async () => {
  try {
    const totalSupply = await ethers.utils.poll(registry.totalSupply);

    if (ethers.BigNumber.isBigNumber(totalSupply)) {
      return Number(ethers.utils.formatUnits(totalSupply, 0));
    }
    throw "Something went wrong while fetching total supply: Invalid Big Number.";
  } catch (error) {
    throw error;
  }
};

export default fetchTotalSupply;
