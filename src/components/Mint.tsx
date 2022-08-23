import { ChangeEvent, useEffect, useState } from "react";
import { ethers } from "ethers";
import { FaExternalLinkAlt } from "react-icons/fa";
import {
  Link,
  Icon,
  Text,
  Button,
  Input,
  useToast,
  Stack,
} from "@chakra-ui/react";

import contractAbi from "../utils/contract-abi";
import MintCounter from "./MintCounter";
import { useAppConfig } from "../context/AppConfigContext";
import { checkClaim } from "../utils/api";
import ConnectButton from "./ConnectButton";
import { useAccount, useContractWrite, usePrepareContractWrite } from "wagmi";
import MintButton from "./MintButton";
import ClaimButton from "./ClaimButton";
import { WAGMIError } from "../types";

const multFactor = 100000;

interface Props {
  contractAddress: string;
}

const Mint = ({ contractAddress }: Props) => {
  const {
    showCounter,
    showQuantitySelector,
    mintLimit,
    projectId,
    price,
    showClaim,
    widgetDisabled,
    defaultMintAmount,
    isSoldOut,
    openSeaUrl,
  } = useAppConfig();

  const [mintCount, setMintCount] = useState(defaultMintAmount);
  const { address } = useAccount();

  const [isPublicSaleOpen, setIsPublicSaleOpen] = useState(false);

  const toast = useToast();

  useEffect(() => {
    if (!showClaim) {
      return;
    }

    const check = async () => {
      if (address) {
        const result = await checkClaim(address, projectId);
        setMintCount(result);
      }
    };
    check();
  }, [address, projectId, showClaim]);

  const setMintingError = (error: WAGMIError) => {
    console.log(error);
    console.log(error.code);
    console.log(error.data);
    console.log(error.internal);
    console.log(error.name);

    const description =
      error.code === -32000
        ? "You don't have enough funds in your wallet to complete this transaction"
        : error.internal.message ||
          "Something went wrong... Please refresh your page and try again.";

    toast({
      position: "top-right",
      title: "Uh Oh!",
      description,
      status: "error",
      duration: 9000,
      isClosable: true,
    });
  };

  const setMintingStart = (txHash?: string) => {
    toast({
      position: "top-right",
      title: "Minting in progress",
      description: (
        <>
          Your transaction was successfully sent!{" "}
          <Link
            href={`https://etherscan.io/tx/${txHash}`}
            sx={{ color: "white" }}
            isExternal
          >
            View it here <Icon as={FaExternalLinkAlt} />
          </Link>
        </>
      ),
      status: "info",
      duration: 9000,
      isClosable: true,
    });
  };

  const setMintingSuccess = (hash?: string) => {
    toast({
      position: "top-right",
      title: "Minting Successful!",
      description: hash && (
        <Link
          href={`https://etherscan.io/tx/${hash}`}
          isExternal
          sx={{ color: "white" }}
        >
          View your transaction here <Icon as={FaExternalLinkAlt} />
        </Link>
      ),
      status: "success",
      duration: 9000,
      isClosable: true,
    });
  };

  const setMintingFailed = (hash?: string) => {
    toast({
      position: "top-right",
      title: "Minting Failed!",
      description: hash && (
        <Link href={`https://etherscan.io/tx/${hash}`} isExternal>
          View your transaction here <Icon as={FaExternalLinkAlt} />
        </Link>
      ),
      status: "error",
      duration: 9000,
      isClosable: true,
    });
  };

  return (
    <div>
      <Stack alignItems="center" spacing={5}>
        {widgetDisabled || isSoldOut ? (
          <Button
            as={Link}
            href={isSoldOut ? openSeaUrl : undefined}
            disabled={!isSoldOut}
            textAlign="center"
            sx={{
              _hover: {
                textDecoration: "none",
              },
            }}
          >
            {isSoldOut ? "Buy on OpenSea" : "Coming Soon!"}
          </Button>
        ) : (
          <>
            {showCounter && (
              <MintCounter onPublicSaleOpen={setIsPublicSaleOpen} />
            )}
            {showClaim && (
              <Text textAlign="center">
                {address
                  ? `You can claim ${mintCount} free tokens.`
                  : "Connect your wallet to check if you can claim tokens."}
              </Text>
            )}
            <div>
              <ConnectButton
                setMintingError={setMintingError}
                setMintingFailed={setMintingFailed}
                setMintingSuccess={setMintingSuccess}
                setMintingStart={setMintingStart}
                mintCount={mintCount}
                contractAddress={contractAddress}
              />
            </div>
            {!showClaim && showQuantitySelector && (
              <>
                <Text textAlign="center">
                  Mint {mintCount} token{mintCount > 1 ? "s" : ""} for{" "}
                  {(price * mintCount).toFixed(2)} Ξ
                </Text>
                <Input
                  type="number"
                  size="md"
                  variant="filled"
                  maxWidth="200px"
                  max={mintLimit}
                  min={1}
                  mx="auto"
                  value={mintCount}
                  onChange={(ev: ChangeEvent<HTMLInputElement>) =>
                    setMintCount(Math.min(parseInt(ev.target.value), mintLimit))
                  }
                  onBlur={() => {
                    if (!mintCount) {
                      setMintCount(1);
                    }
                  }}
                  sx={{ _focus: { background: "white" } }}
                />
              </>
            )}
          </>
        )}
      </Stack>
    </div>
  );
};

export default Mint;
