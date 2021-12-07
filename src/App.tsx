import React from "react";

import Mint from "./components/Mint";

function App() {
  return (
    <>
      <Mint contractAddress={process.env.REACT_APP_CONTRACT_ADDRESS || ""} />
    </>
  );
}

export default App;
