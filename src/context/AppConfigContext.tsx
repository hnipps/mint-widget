import { theme, ThemeExtension } from "@chakra-ui/react";
import {
  WalletModule,
  WalletInitOptions,
} from "bnc-onboard/dist/src/interfaces";
import { createContext, FC, useContext, useEffect, useState } from "react";
import configWallets from "../utils/wallets";

export type Dict<T = any> = Record<string, T>;

export interface AppConfig {
  blocknativeKey: string;
  rpcURL: string;
  chainID: string;
  contractAddress: string;
  wallets: Array<WalletModule | WalletInitOptions>;
  showCounter: boolean;
  showWalletAddress: boolean;
  showQuantitySelector: boolean;
  theme?: Dict;
}

const defaultConfig: AppConfig = {
  blocknativeKey: "",
  rpcURL: "",
  chainID: "",
  contractAddress: "",
  wallets: [],
  showCounter: false,
  showWalletAddress: false,
  showQuantitySelector: false,
};

export const AppConfigContext = createContext(defaultConfig);

export const useAppConfig = () => useContext(AppConfigContext);

const AppConfigProvider: FC<AppConfig> = ({ children, ...props }) => {
  const [wallets, setWallets] = useState<
    Array<WalletModule | WalletInitOptions>
  >([]);

  useEffect(() => {
    const wallets = configWallets({
      rpcURL: props.rpcURL,
      chainID: props.chainID,
    });

    setWallets(wallets);
  }, [props.chainID, props.rpcURL]);

  return (
    <AppConfigContext.Provider value={{ ...props, wallets }}>
      {children}
    </AppConfigContext.Provider>
  );
};

export default AppConfigProvider;
