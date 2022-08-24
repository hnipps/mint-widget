import React from "react";
import { ConnectButton as RainbowConnectButton } from "@rainbow-me/rainbowkit";
import { Box, Button, Flex, Grid } from "@chakra-ui/react";
import MintButton from "./MintButton";
import ClaimButton from "./ClaimButton";
import { WAGMIError } from "../types";

type Props = {
  setMintingError: (error: WAGMIError) => void;
  setMintingFailed: (hash?: string) => void;
  setMintingSuccess: (hash?: string) => void;
  setMintingStart: (hash?: string) => void;
  mintCount: number;
  contractAddress: string;
};

const ConnectButton = ({
  setMintingFailed,
  setMintingError,
  setMintingSuccess,
  setMintingStart,
  mintCount,
  contractAddress,
}: Props) => {
  return (
    <RainbowConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        mounted,
      }) => {
        return (
          <Box
            {...(!mounted && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
            mt={-20}
            mb={10}
            h={32}
          >
            {(() => {
              if (!mounted || !account || !chain) {
                return (
                  <Button onClick={openConnectModal} type="button">
                    Connect
                  </Button>
                );
              }

              if (chain.unsupported) {
                return (
                  <Button onClick={openChainModal} type="button">
                    Wrong network
                  </Button>
                );
              }

              return (
                <Flex flexDir="column" alignItems="center" gridGap={3}>
                  <Grid templateColumns="1fr 1fr" gridGap={3}>
                    <MintButton
                      onFail={setMintingFailed}
                      onError={setMintingError}
                      onSuccess={setMintingSuccess}
                      onSend={setMintingStart}
                      mintCount={mintCount}
                      contractAddress={contractAddress}
                    />
                    <ClaimButton
                      onFail={setMintingFailed}
                      onError={setMintingError}
                      onSuccess={setMintingSuccess}
                      onSend={setMintingStart}
                      mintCount={mintCount}
                      contractAddress={contractAddress}
                    />
                  </Grid>
                  <Button
                    variant="ghost"
                    onClick={openAccountModal}
                    type="button"
                  >
                    {account.displayName}
                    {account.displayBalance
                      ? ` (${account.displayBalance})`
                      : ""}
                  </Button>
                </Flex>
              );
            })()}
          </Box>
        );
      }}
    </RainbowConnectButton.Custom>
  );
};

export default ConnectButton;
