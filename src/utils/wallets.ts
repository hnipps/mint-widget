const RPC_URL = process.env.REACT_APP_RPC_URL;
const CHAIN_ID = process.env.REACT_APP_CHAIN_ID || 4;
const APP_NAME = "Cyber Hornets Colony";
const APP_URL = "https://www.cyberhornetscolony.com/";
const CONTACT_EMAIL = "ParabolicGuy@gmail.com";

const wallets = [
  { walletName: "metamask", preferred: true },
  { walletName: "coinbase", preferred: true },
  { walletName: "trust", preferred: true, rpcUrl: RPC_URL },
  {
    walletName: "walletConnect",
    rpc: {
      [CHAIN_ID]: RPC_URL,
    },
  },
  { walletName: "torus", preferred: true },
  {
    walletName: "walletLink",
    preferred: true,
    rpcUrl: RPC_URL,
    appName: APP_NAME,
  },
  { walletName: "frame" },
  { walletName: "authereum" },
  {
    walletName: "ledger",
    preferred: true,
    rpcUrl: RPC_URL,
  },
  {
    walletName: "trezor",
    preferred: true,
    appUrl: APP_URL,
    email: CONTACT_EMAIL,
    rpcUrl: RPC_URL,
  },
  {
    walletName: "lattice",
    rpcUrl: RPC_URL,
    appName: APP_NAME,
  },
  {
    walletName: "keepkey",
    rpcUrl: RPC_URL,
  },
  {
    walletName: "cobovault",
    rpcUrl: RPC_URL,
    appName: APP_NAME,
  },
  {
    walletName: "keystone",
    rpcUrl: RPC_URL,
    appName: APP_NAME,
  },
  { walletName: "opera" },
  { walletName: "operaTouch" },
  { walletName: "status" },
  { walletName: "imToken", rpcUrl: RPC_URL },
  { walletName: "meetone" },
  { walletName: "mykey", rpcUrl: RPC_URL },
  { walletName: "huobiwallet", rpcUrl: RPC_URL },
  { walletName: "hyperpay" },
  { walletName: "wallet.io", rpcUrl: RPC_URL },
  { walletName: "atoken" },
  { walletName: "ownbit" },
  { walletName: "alphawallet" },
  { walletName: "gnosis" },
  { walletName: "xdefi" },
  { walletName: "bitpie" },
  { walletName: "binance" },
  { walletName: "liquality" },
];

export default wallets;
