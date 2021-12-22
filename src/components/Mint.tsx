import { ChangeEvent, useEffect, useState } from "react";
import { ethers } from "ethers";
import Onboard from "bnc-onboard";
import { Web3Provider } from "@ethersproject/providers";
import { API } from "bnc-onboard/dist/src/interfaces";
import { FaExternalLinkAlt } from "react-icons/fa";

import contractAbi from "../utils/contract-abi";
import styles from "./mint.module.css";
import { Link, Icon, Button, Input, useToast } from "@chakra-ui/react";
import MintCounter from "./MintCounter";
import { useAppConfig } from "../context/AppConfigContext";

const multFactor = 100000;

interface Props {
  contractAddress: string;
}

const Mint = ({ contractAddress }: Props) => {
  const [web3, setWeb3] = useState<Web3Provider | null>(null);
  const [onboard, setOnboard] = useState<API | null>(null);
  const [connected, setConnected] = useState(false);
  const [isPublicSaleOpen, setIsPublicSaleOpen] = useState(false);
  const [mintCount, setMintCount] = useState(1);
  const price = 0.03;
  const [address, setAddress] = useState<null | string>(null);
  const {
    blocknativeKey,
    wallets,
    chainID,
    showCounter,
    showWalletAddress,
    showQuantitySelector,
  } = useAppConfig();

  const toast = useToast();

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
      title: "Uh Oh!",
      description,
      status: "error",
      duration: 9000,
      isClosable: true,
    });
  };

  const setMintingStart = (txHash: string) => {
    toast({
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
      const registry = ethers.ContractFactory.fromSolidity(contractAbi)
        .attach(contractAddress)
        .connect(web3);

      const data = await registry.interface.encodeFunctionData("mint", [
        mintCount,
      ]);

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

  const truncateAddress = (addressToChange: string) =>
    `${addressToChange?.slice(0, 6)}...${addressToChange?.slice(-6)}`;

  return (
    <div>
      {showCounter && <MintCounter onPublicSaleOpen={setIsPublicSaleOpen} />}
      <div className={styles["wrapper"]}>
        <div className={styles["flex-container"]}>
          <Button
            disabled={connected}
            variant="outline"
            onClick={handleConnectClick}
          >
            {connected ? "Connected" : "Connect Wallet"}
          </Button>
          <Button
            disabled={!connected || (showCounter && !isPublicSaleOpen)}
            onClick={handleMintClick}
          >
            Mint
          </Button>
        </div>
        {showQuantitySelector && (
          <>
            <p className={styles["account-indicator"]}>
              Mint {mintCount} token{mintCount > 1 ? "s" : ""} for{" "}
              {price * mintCount} Ξ
            </p>
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
                setMintCount(Math.min(parseInt(ev.target.value), 100))
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
          <p className={styles["account-indicator"]}>
            <strong>Account:</strong>{" "}
            {connected ? truncateAddress(address || "") : "Connect your wallet"}
          </p>
        )}
      </div>
    </div>
  );
};

export default Mint;
