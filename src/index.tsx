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
