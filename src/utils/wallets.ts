import type {
  WalletInitOptions,
  WalletModule,
} from "bnc-onboard/dist/src/interfaces";

const configWallets = ({
  rpcURL,
  chainID,
  appName,
  appUrl,
  contactEmail,
}: {
  rpcURL: string;
  chainID: string;
  appName: string;
  appUrl: string;
  contactEmail: string;
}): Array<WalletModule | WalletInitOptions> => {
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
      appName: appName,
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
      appUrl: appUrl,
      email: contactEmail,
      rpcUrl: rpcURL,
    },
    {
      walletName: "lattice",
      rpcUrl: rpcURL,
      appName: appName,
    },
    {
      walletName: "keepkey",
      rpcUrl: rpcURL,
    },
    {
      walletName: "cobovault",
      rpcUrl: rpcURL,
      appName: appName,
    },
    {
      walletName: "keystone",
      rpcUrl: rpcURL,
      appName: appName,
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
    {
      walletName: "fortmatic",
      apiKey: process.env.REACT_APP_FORTMATIC_API_KEY,
      preferred: true,
    },
  ];

  return wallets;
};
export default configWallets;
