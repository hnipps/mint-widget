import {
  WalletInitOptions,
  WalletModule,
} from "bnc-onboard/dist/src/interfaces";

const configWallets = ({
  rpcURL,
  chainID,
}: {
  rpcURL: string;
  chainID: string;
}): Array<WalletModule | WalletInitOptions> => {
  const APP_NAME = "Cyber Hornets Colony";
  const APP_URL = "https://www.cyberhornetscolony.com/";
  const CONTACT_EMAIL = "ParabolicGuy@gmail.com";

  const wallets = [
    { walletName: "metamask", preferred: true },
    { walletName: "coinbase", preferred: true },
    { walletName: "trust", preferred: true, rpcUrl: rpcURL },
    {
      walletName: "walletConnect",
      rpc: {
        [chainID]: rpcURL,
      },
    },
    { walletName: "torus", preferred: true },
    {
      walletName: "walletLink",
      preferred: true,
      rpcUrl: rpcURL,
      appName: APP_NAME,
    },
    { walletName: "frame" },
    { walletName: "authereum" },
    {
      walletName: "ledger",
      preferred: true,
      rpcUrl: rpcURL,
    },
    {
      walletName: "trezor",
      preferred: true,
      appUrl: APP_URL,
      email: CONTACT_EMAIL,
      rpcUrl: rpcURL,
    },
    {
      walletName: "lattice",
      rpcUrl: rpcURL,
      appName: APP_NAME,
    },
    {
      walletName: "keepkey",
      rpcUrl: rpcURL,
    },
    {
      walletName: "cobovault",
      rpcUrl: rpcURL,
      appName: APP_NAME,
    },
    {
      walletName: "keystone",
      rpcUrl: rpcURL,
      appName: APP_NAME,
    },
    { walletName: "opera" },
    { walletName: "operaTouch" },
    { walletName: "status" },
    { walletName: "imToken", rpcUrl: rpcURL },
    { walletName: "meetone" },
    { walletName: "mykey", rpcUrl: rpcURL },
    { walletName: "huobiwallet", rpcUrl: rpcURL },
    { walletName: "hyperpay" },
    { walletName: "wallet.io", rpcUrl: rpcURL },
    { walletName: "atoken" },
    { walletName: "ownbit" },
    { walletName: "alphawallet" },
    { walletName: "gnosis" },
    { walletName: "xdefi" },
    { walletName: "bitpie" },
    { walletName: "binance" },
    { walletName: "liquality" },
  ];

  return wallets;
};
export default configWallets;
