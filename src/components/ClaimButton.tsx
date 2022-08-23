import { Button } from "@chakra-ui/react";
import { ethers } from "ethers";
import React, { useState } from "react";
import { useAccount, usePrepareContractWrite, useContractWrite } from "wagmi";
import { useAppConfig } from "../context/AppConfigContext";
import contractAbi from "../utils/contract-abi";

type Props = {
  mintCount: number;
  contractAddress: string;
  onFail: (hash?: string) => void;
  onSuccess: (hash?: string) => void;
};

const ClaimButton = ({
  mintCount,
  contractAddress,
  onFail,
  onSuccess,
}: Props) => {
  const { claimFn } = useAppConfig();

  const { address, isConnected } = useAccount();
  const { config } = usePrepareContractWrite({
    addressOrName: contractAddress,
    functionName: claimFn,
    contractInterface: contractAbi,
    args: [mintCount],
  });
  const { data, write } = useContractWrite(config);

  const handleClick = async () => {
    if (isConnected && address && write) {
      write();
    }
  };
  return (
    <Button disabled={!isConnected} onClick={handleClick}>
      Claim
    </Button>
  );
};

export default ClaimButton;
