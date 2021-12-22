import React from "react";
import ReactDOM from "react-dom";
import { ChakraProvider } from "@chakra-ui/react";

import App from "./App";
import theme from "./theme";
import AppConfigProvider, { AppConfig } from "./context/AppConfigContext";

type Init = (params: AppConfig) => void;

declare global {
  interface Window {
    mintWidgetInit: Init;
  }
}

const init: Init = (params) => {
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
  window.mintWidgetInit({
    blocknativeKey: process.env.REACT_APP_BNC_KEY || "",
    rpcURL: process.env.REACT_APP_RPC_URL || "",
    chainID: process.env.REACT_APP_CHAIN_ID || "",
    contractAddress: process.env.REACT_APP_CONTRACT_ADDRESS || "",
    wallets: [],
    showCounter: false,
    showWalletAddress: false,
    showQuantitySelector: false,
  });
}
