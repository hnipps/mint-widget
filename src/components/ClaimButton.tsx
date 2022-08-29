import React, { useMemo, useState } from "react";
import { Button, Text } from "@chakra-ui/react";
import {
  useAccount,
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
} from "wagmi";

import { getClaimlistMerkleProof } from "../utils/merkle-tree";
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

const ClaimButton = ({
  mintCount,
  contractAddress,
  onFail,
  onSuccess,
  onSend,
  onError,
}: Props) => {
  const { claimFn, allowlist, appName } = useAppConfig();

  const { address, isConnected } = useAccount();

  const [disabled, setDisabled] = useState(true);

  const allowlistEntry = useMemo(() => {
    return allowlist.find(
      ({ address: allowedAddress }) => allowedAddress === address
    );
  }, [address, allowlist]);

  const proof = useMemo(() => {
    if (isConnected && address) {
      return getClaimlistMerkleProof(
        allowlist,
        address,
        allowlistEntry?.maximumClaimAmount || "0"
      );
    }
  }, [address, allowlist, allowlistEntry?.maximumClaimAmount, isConnected]);

  const { config } = usePrepareContractWrite({
    addressOrName: contractAddress,
    functionName: claimFn,
    contractInterface: contractAbi,
    args: [
      proof,
      allowlistEntry?.maximumClaimAmount,
      allowlistEntry?.maximumClaimAmount,
    ],
    onSuccess: () => {
      setDisabled(false);
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
    <>
      <Button disabled={disabled || !isConnected} onClick={handleClick}>
        Claim
      </Button>
      <Text gridRowStart="2" gridColumnStart="2" textAlign="center">
        {disabled && `This wallet is not eligible to claim ${appName}`}
      </Text>
    </>
  );
};

export default ClaimButton;
