import { ChangeEvent, useEffect, useState } from "react";
import { ethers } from "ethers";
import Onboard from "bnc-onboard";
import { Web3Provider } from "@ethersproject/providers";
import type { API } from "bnc-onboard/dist/src/interfaces";
import { FaExternalLinkAlt } from "react-icons/fa";
import {
  Link,
  Icon,
  Text,
  Button,
  Input,
  useToast,
  Stack,
  Heading,
} from "@chakra-ui/react";

import contractAbi from "../utils/contract-abi";
import MintCounter from "./MintCounter";
import { useAppConfig } from "../context/AppConfigContext";
import { checkClaim, getSignature } from "../utils/api";

const multFactor = 100000;

interface Props {
  contractAddress: string;
}

const Mint = ({ contractAddress }: Props) => {
  const [web3, setWeb3] = useState<Web3Provider | null>(null);
  const [onboard, setOnboard] = useState<API | null>(null);
  const [connected, setConnected] = useState(false);
  const [isPublicSaleOpen, setIsPublicSaleOpen] = useState(false);
  const [mintCount, setMintCount] = useState(0);
  const [address, setAddress] = useState<null | string>(null);
  const {
    blocknativeKey,
    wallets,
    chainID,
    showCounter,
    showWalletAddress,
    showQuantitySelector,
    mintLimit,
    projectId,
    mintFn,
    price,
    showClaim,
    claimFn,
    presale,
    widgetDisabled,
  } = useAppConfig();

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

  const handleAddressChange = (newAddress: string) => {
    setAddress(newAddress);
  };

  const setMintingError = (error: any) => {
    const description =
      error?.error?.code === -32000
        ? "You don't have enough funds in your wallet to complete this transaction"
        : error?.error?.message ||
          error?.reason ||
          error?.message ||
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

  const setMintingStart = (txHash: string) => {
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

  const setMintingSuccess = (txHash: string) => {
    toast({
      position: "top-right",
      title: "Minting Successful!",
      description: (
        <Link
          href={`https://etherscan.io/tx/${txHash}`}
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

  const setMintingFailed = (txHash: string) => {
    toast({
      position: "top-right",
      title: "Minting Failed!",
      description: (
        <Link href={`://etherscan.io/tx/${txHash}`} isExternal>
          View your transaction here <Icon as={FaExternalLinkAlt} />
        </Link>
      ),
      status: "error",
      duration: 9000,
      isClosable: true,
    });
  };

  useEffect(() => {
    setOnboard(
      Onboard({
        dappId: blocknativeKey, // [String] The API key created by step one above
        networkId: parseInt(chainID || "4"), // [Integer] The Ethereum network ID your Dapp uses.
        subscriptions: {
          wallet: (wallet) => {
            setWeb3(new Web3Provider(wallet.provider));
          },
          address: handleAddressChange,
        },
        darkMode: true,
        walletSelect: { wallets },
      })
    );
  }, [blocknativeKey, chainID, wallets]);

  const handleConnectClick = async () => {
    if (onboard) {
      const newConnected = await onboard.walletSelect();
      if (newConnected) {
        const check = await onboard.walletCheck();
        setConnected(check);
        if (check) {
          toast({
            position: "top-right",
            title: "Wallet connected!",
            description: `You successfully connected your wallet: ${truncateAddress(
              onboard.getState().address
            )}`,
            status: "success",
            duration: 9000,
            isClosable: true,
          });
          return;
        }

        toast({
          position: "top-right",
          title: "Wallet connection failed!",
          description:
            "Something went wrong while trying to connect your wallet. Please try again.",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      }
    }
  };

  const handleMintClick = async () => {
    if (web3 && onboard && address) {
      if (presale) {
        const { signature, error } = await getSignature(
          address,
          mintCount,
          projectId
        );
        console.log({ signature, error, mintCount, projectId, address });

        if (error) {
          setMintingError(error);
          return;
        }

        mint([mintCount, signature]);
        return;
      }

      mint([mintCount, "0xab6c"]);
    }
  };

  const mint = async (params: any[]) => {
    if (web3 && onboard && address) {
      const registry = ethers.ContractFactory.fromSolidity(contractAbi)
        .attach(contractAddress)
        .connect(web3);

      const data = await registry.interface.encodeFunctionData(mintFn, params);

      const transaction = {
        to: contractAddress,
        from: address,
        value: ethers.constants.WeiPerEther.mul(
          price * multFactor * mintCount
        ).div(multFactor),
        data,
      };

      const tx = await web3
        .getSigner()
        .sendTransaction(transaction)
        .catch((err) => setMintingError(err));

      if (!tx) return;

      const txHash = tx.hash;

      tx.wait()
        .then(async () => {
          setMintingSuccess(txHash);
        })
        .catch(() => {
          setMintingFailed(txHash);
        });

      setMintingStart(txHash);
    }
  };

  const handleClaimClick = async () => {
    if (web3 && onboard && address) {
      const { signature, error } = await getSignature(
        address,
        mintCount,
        projectId
      );
      if (error) {
        setMintingError(error);
        return;
      }

      const registry = ethers.ContractFactory.fromSolidity(contractAbi)
        .attach(contractAddress)
        .connect(web3);

      const data = await registry.interface.encodeFunctionData(claimFn, [
        mintCount,
        signature,
      ]);

      const transaction = {
        to: contractAddress,
        from: address,
        value: 0,
        data,
      };

      const tx = await web3
        .getSigner()
        .sendTransaction(transaction)
        .catch((err) => setMintingError(err));

      if (!tx) return;

      const txHash = tx.hash;

      tx.wait()
        .then(async () => {
          setMintingSuccess(txHash);
        })
        .catch(() => {
          setMintingFailed(txHash);
        });

      setMintingStart(txHash);
    }
  };

  const truncateAddress = (addressToChange: string) =>
    `${addressToChange?.slice(0, 6)}...${addressToChange?.slice(-6)}`;

  return (
    <div>
      <Stack alignItems="center" spacing={5}>
        {widgetDisabled ? (
          <Button disabled={true}>Coming Soon!</Button>
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
              {connected ? (
                <Button
                  disabled={(showCounter && !isPublicSaleOpen) || mintCount < 1}
                  onClick={showClaim ? handleClaimClick : handleMintClick}
                >
                  {showClaim ? "Claim" : "Mint"}
                </Button>
              ) : (
                <Button variant="solid" onClick={handleConnectClick}>
                  Connect Wallet
                </Button>
              )}
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
                  max={100}
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
            {showWalletAddress && (
              <Text textAlign="center">
                <strong>Account:</strong>{" "}
                {connected
                  ? truncateAddress(address || "")
                  : "Connect your wallet"}
              </Text>
            )}
          </>
        )}
      </Stack>
    </div>
  );
};

export default Mint;
