import {
  WalletModule,
  WalletInitOptions,
} from "bnc-onboard/dist/src/interfaces";
import { createContext, FC, useContext, useEffect, useState } from "react";
import configWallets from "../utils/wallets";

export interface AppConfig {
  blocknativeKey: string;
  rpcURL: string;
  chainID: string;
  contractAddress: string;
  wallets: Array<WalletModule | WalletInitOptions>;
}

const defaultConfig: AppConfig = {
  blocknativeKey: "",
  rpcURL: "",
  chainID: "",
  contractAddress: "",
  wallets: [],
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
