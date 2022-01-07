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
  const newTheme = theme && extendTheme(theme);
  ReactDOM.render(
    <React.StrictMode>
      <ChakraProvider theme={newTheme}>
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
  // background: #00e5ff;
  // box-shadow: 1px 1px 8px 0 #00e5ff;
  // border: none;
  // font-family: 'Varela Round', sans-serif;
  // border-radius: 9999px;
  // font-size: 24px;
  // padding: 16px 36px;
  // text-shadow: 1px 1px 10px rgb(0 23 118 / 20%);
  // width: auto;
  // display: inline-block;
  // height: auto;
  // color: #000725;
  // font-weight: 400;
  // transition: background-color 200ms ease;
  // line-height: 36px;

  const theme = {
    components: {
      Button: {
        baseStyle: {
          boxShadow: "1px 1px 8px 0 #00e5ff",
          fontFamily: "'Varela Round', sans-serif",
          border: "none",
          borderRadius: "9999px",
          width: "auto",
          display: "inline-block",
          h: "auto",
          color: "#000725",
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
          // 4. We can override existing variants
          solid: {
            padding: "16px 36px",
            fontSize: "24px",
            bg: "#00e5ff",
            h: "auto",
            textShadow: "1px 1px 10px rgb(0 23 118 / 20%)",
            minW: "300px",
            _hover: {
              bg: "#60efff",
            },
            _active: {
              bg: "#60efff",
            },
            _disabled: {
              color: "black",
            },
          },
        },
      },
    },
  };

  // const theme = {
  //   components: {
  //     Button: {
  //       baseStyle: {
  //         fontFamily: "sans-serif",
  //       },
  //       variants: {
  //         outline: {
  //           borderColor: "white",
  //           color: "white",
  //           _hover: {
  //             color: "black",
  //           },
  //         },
  //         // 4. We can override existing variants
  //         solid: {
  //           _disabled: {
  //             color: "black",
  //           },
  //         },
  //       },
  //     },
  //   },
  // };

  window.mintWidgetInit({
    blocknativeKey: process.env.REACT_APP_BNC_KEY || "",
    rpcURL: process.env.REACT_APP_RPC_URL || "",
    chainID: process.env.REACT_APP_CHAIN_ID || "",
    contractAddress: process.env.REACT_APP_CONTRACT_ADDRESS || "",
    wallets: [],
    showCounter: false,
    showWalletAddress: false,
    showQuantitySelector: false,
    theme,
  });
}
