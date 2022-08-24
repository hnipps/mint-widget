import {
  WalletModule,
  WalletInitOptions,
} from "bnc-onboard/dist/src/interfaces";
import { createContext, FC, useContext } from "react";
import { chain } from "wagmi";
import { ClaimlistAddress } from "../utils/merkle-tree";

export type Dict<T = any> = Record<string, T>;

export interface AppConfig {
  blocknativeKey: string;
  rpcID: string;
  chain: keyof typeof chain;
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
  isSoldOut: boolean;
  defaultMintAmount: number;
  openSeaUrl: string;
  allowlist: ClaimlistAddress[];
}

const defaultConfig: AppConfig = {
  blocknativeKey: "",
  rpcID: "",
  chain: "rinkeby",
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
  isSoldOut: false,
  defaultMintAmount: 1,
  openSeaUrl: "",
  allowlist: [],
};

export const AppConfigContext = createContext(defaultConfig);

export const useAppConfig = () => useContext(AppConfigContext);

export const mergeConfig = (config: Partial<AppConfig>): AppConfig => ({
  ...defaultConfig,
  ...config,
});

const AppConfigProvider: FC<AppConfig> = ({ children, ...props }) => {
  return (
    <AppConfigContext.Provider value={{ ...props }}>
      {children}
    </AppConfigContext.Provider>
  );
};

export default AppConfigProvider;
