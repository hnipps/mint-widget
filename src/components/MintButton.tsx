import React from "react";
import { Button } from "@chakra-ui/react";
import { ethers } from "ethers";
import {
  useAccount,
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
} from "wagmi";

import { useAppConfig } from "../context/AppConfigContext";
import contractAbi from "../utils/contract-abi";
import { WAGMIError } from "../types";

type Props = {
  mintCount: number;
  contractAddress: string;
  onFail: (hash?: string) => void;
  onSuccess: (hash?: string) => void;
  onSend: (hash?: string) => void;
  onError: (error: WAGMIError) => void;
};

const multFactor = 100000;

const MintButton = ({
  mintCount,
  contractAddress,
  onFail,
  onError,
  onSuccess,
  onSend,
}: Props) => {
  const { price, mintFn } = useAppConfig();

  const { address, isConnected } = useAccount();

  const { config } = usePrepareContractWrite({
    addressOrName: contractAddress,
    functionName: mintFn,
    contractInterface: contractAbi,
    args: [mintCount],
    overrides: {
      value: ethers.constants.WeiPerEther.mul(
        price * multFactor * mintCount
      ).div(multFactor),
    },
  });

  const { data, write } = useContractWrite({
    ...config,
    onError: (tx) => {
      onError((tx as any as WAGMIError) || new Error("uh oh"));
    },
    onSuccess: (tx) => {
      onSend(tx.hash);
    },
  });

  useWaitForTransaction({
    hash: data?.hash,
    onSuccess: (tx) => {
      onSuccess(tx.transactionHash);
    },
    onError: (tx) => {
      onFail(data?.hash);
    },
  });

  const handleClick = async () => {
    if (isConnected && address && write) {
      write();
    }
  };
  return (
    <Button disabled={!isConnected} onClick={handleClick}>
      Mint
    </Button>
  );
};

export default MintButton;
