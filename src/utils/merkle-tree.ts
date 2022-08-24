import { ethers } from "ethers";
import keccak256 from "keccak256";
import MerkleTree from "merkletreejs";

export type ClaimlistAddress = {
  address: string;
  maximumClaimAmount: string;
};

// hash together address & amount of tokens address is eligible to claim
const hash = (address: string, amount: ethers.BigNumber) => {
  return Buffer.from(
    ethers.utils
      .solidityKeccak256(["address", "uint256"], [address, amount])
      .slice(2),
    "hex"
  );
};

// remember to keep your list of addresses because you'll need them to re-generate the proof when passing to the contract
export const getClaimlistMerkleRoot = (addresses: ClaimlistAddress[]) => {
  // Create merkle tree
  const merkleTree = new MerkleTree(
    addresses.map((item) =>
      hash(item.address, ethers.BigNumber.from(item.maximumClaimAmount))
    ),
    keccak256,
    {
      hashLeaves: false, // we are passing in hashed leafs already, this would double hash
      sort: true,
    }
  );
  return merkleTree.getHexRoot();
};

export const getClaimlistMerkleProof = (
  addresses: ClaimlistAddress[],
  address: string,
  amount: string
) => {
  // Create merkle tree
  const merkleTree = new MerkleTree(
    addresses.map((item) =>
      hash(item.address, ethers.BigNumber.from(item.maximumClaimAmount))
    ),
    keccak256,
    {
      hashLeaves: false, // we are passing in hashed leafs already, this would double hash
      sort: true,
    }
  );
  return merkleTree.getHexProof(hash(address, ethers.BigNumber.from(amount)));
};
