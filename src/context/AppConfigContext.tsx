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
  mintLimit: number;
  presale: boolean;
  projectId: string;
  mintFn: string;
  price: number;
  appName: string;
  appUrl: string;
  contactEmail: string;
  showClaim: boolean;
  claimFn: string;
  widgetDisabled: boolean;
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
  mintLimit: 10,
  presale: false,
  projectId: "",
  mintFn: "mint",
  price: 1,
  appName: "",
  appUrl: "",
  contactEmail: "",
  showClaim: false,
  claimFn: "claim",
  widgetDisabled: false,
};

export const AppConfigContext = createContext(defaultConfig);

export const useAppConfig = () => useContext(AppConfigContext);

const AppConfigProvider: FC<Partial<AppConfig>> = ({ children, ...props }) => {
  const [wallets, setWallets] = useState<
    Array<WalletModule | WalletInitOptions>
  >([]);

  const mergedProps: AppConfig = {
    ...defaultConfig,
    ...props,
  };

  useEffect(() => {
    const wallets = configWallets({
      rpcURL: mergedProps.rpcURL,
      chainID: mergedProps.chainID,
      appName: mergedProps.appName,
      appUrl: mergedProps.appUrl,
      contactEmail: mergedProps.contactEmail,
    });

    setWallets(wallets);
  }, [
    mergedProps.appName,
    mergedProps.appUrl,
    mergedProps.chainID,
    mergedProps.contactEmail,
    mergedProps.rpcURL,
  ]);

  return (
    <AppConfigContext.Provider value={{ ...mergedProps, wallets }}>
      {children}
    </AppConfigContext.Provider>
  );
};

export default AppConfigProvider;
