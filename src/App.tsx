import React from "react";

import Mint from "./components/Mint";
import { useAppConfig } from "./context/AppConfigContext";

function App() {
  const { contractAddress } = useAppConfig();
  return (
    <>
      <Mint contractAddress={contractAddress || ""} />
    </>
  );
}

export default App;
