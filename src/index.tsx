import React from "react";
import ReactDOM from "react-dom";
import { ChakraProvider } from "@chakra-ui/react";

import App from "./App";
import AppConfigProvider, { AppConfig } from "./context/AppConfigContext";
import extendTheme from "./theme";

type Init = (params: AppConfig) => void;

declare global {
  interface Window {
    mintWidgetInit: Init;
  }
}

const init: Init = ({ theme, ...params }) => {
  ReactDOM.render(
    <React.StrictMode>
      <ChakraProvider theme={theme}>
        <AppConfigProvider {...params}>
          <App />
        </AppConfigProvider>
      </ChakraProvider>
    </React.StrictMode>,
    document.getElementById("mint-controls")
  );
};

window.mintWidgetInit = init;

if (process.env.NODE_ENV === "development") {
  const theme = {
    components: {
      Button: {
        baseStyle: {
          fontFamily: "sans-serif"
        },
        variants: {
          outline: {
            borderColor: "white",
            color: "white",
            _hover: {
              color: "black",
            },
          },
          // 4. We can override existing variants
          solid: {
            _disabled: {
              color: "black",
            },
          },
        },
      },
    },
  };

  window.mintWidgetInit({
    blocknativeKey: process.env.REACT_APP_BNC_KEY || "",
    rpcURL: process.env.REACT_APP_RPC_URL || "",
    chainID: process.env.REACT_APP_CHAIN_ID || "",
    contractAddress: process.env.REACT_APP_CONTRACT_ADDRESS || "",
    wallets: [],
    showCounter: false,
    showWalletAddress: false,
    showQuantitySelector: false,
    theme: extendTheme(theme),
  });
}
