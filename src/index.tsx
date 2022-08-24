import React from "react";
import ReactDOM from "react-dom";
import { ChakraProvider } from "@chakra-ui/react";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { chain, configureChains, createClient, WagmiConfig } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";

import allowlist from "./data/cult_of_dog_allowlist.json";
import App from "./App";
import AppConfigProvider, {
  AppConfig,
  mergeConfig,
} from "./context/AppConfigContext";
import extendTheme from "./theme";

import "@rainbow-me/rainbowkit/dist/index.css";

type Init = (params: Partial<AppConfig>) => void;

declare global {
  interface Window {
    mintWidgetInit: Init;
  }
}

const init: Init = ({ theme, ...params }) => {
  const appConfig = mergeConfig(params);
  const { chains, provider } = configureChains(
    [chain[appConfig.chain]],
    [alchemyProvider({ apiKey: process.env.ALCHEMY_ID }), publicProvider()]
  );

  const { connectors } = getDefaultWallets({
    appName: "My RainbowKit App",
    chains,
  });

  const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider,
  });

  const newTheme = theme && extendTheme(theme);

  ReactDOM.render(
    <React.StrictMode>
      <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider chains={chains}>
          <ChakraProvider theme={newTheme}>
            <AppConfigProvider {...appConfig}>
              <App />
            </AppConfigProvider>
          </ChakraProvider>
        </RainbowKitProvider>
      </WagmiConfig>
    </React.StrictMode>,
    document.getElementById("mint-controls")
  );
};

window.mintWidgetInit = init;

if (process.env.NODE_ENV === "development") {
  const theme = {
    components: {
      Text: {
        baseStyle: {
          color: "white",
        },
      },
      Button: {
        baseStyle: {
          boxShadow: "1px 1px 8px 0 #00e5ff",
          fontFamily: "'Playfair Display', sans-serif",
          border: "none",
          borderRadius: "9999px",
          width: "auto",
          display: "inline-block",
          h: "auto",
          color: "#fff",
          fontWeight: "400",
          transition: "background-color 200ms ease",
          lineHeight: "36px",
        },
        variants: {
          outline: {
            height: "auto",
            border: "none",
            color: "white",
            _hover: {
              color: "black",
            },
          },
          ghost: {
            height: "auto",
            border: "none",
            color: "#000B25",
            outline: "none",
            boxShadow: "none",
            _hover: {
              textDecoration: "underline",
            },
          },
          solid: {
            padding: "16px 36px",
            fontSize: "24px",
            bg: "#1200B8",
            h: "auto",
            textShadow: "1px 1px 10px rgb(0 23 118 / 20%)",
            minW: "300px",
            _active: {
              bg: "#230AFF",
            },
            _disabled: {
              _hover: {
                bg: "#85A9FF",
              },
              bg: "#85A9FF",
              color: "#000B25",
            },
            _hover: {
              bg: "#230AFF",
              _disabled: {
                bg: "#85A9FF",
              },
            },
          },
        },
      },
    },
  };

  window.mintWidgetInit({
    blocknativeKey: process.env.REACT_APP_BNC_KEY || "",
    rpcID: process.env.REACT_APP_RPC_ID || "",
    chain: process.env.REACT_APP_CHAIN as keyof typeof chain,
    contractAddress: process.env.REACT_APP_CONTRACT_ADDRESS || "",
    wallets: [],
    showCounter: false,
    showWalletAddress: true,
    showQuantitySelector: false,
    theme,
    presale: true,
    projectId: "d94c7662-6ba0-4aae-adf0-77b926981c51",
    mintFn: "claim",
    appName: "Current Thing",
    appUrl: "",
    contactEmail: "",
    price: 0.042,
    showClaim: false,
    claimFn: "claimClaimlist",
    widgetDisabled: false,
    isSoldOut: false,
    defaultMintAmount: 1,
    openSeaUrl: "https://opensea.io/collection/current-thing",
    allowlist,
  });
}
