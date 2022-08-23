import React, { useEffect, useState, FC } from "react";
import { ethers } from "ethers";

import contractAbi from "../utils/contract-abi";
import createFetchTotalSupply from "../contract/fetch-total-supply";
import Countdown from "./Countdown";

import styles from "./mint-counter.module.css";
import { useAppConfig } from "../context/AppConfigContext";

interface Props {
  onPresaleOpen?: (val: boolean) => void;
  onPublicSaleOpen: (val: boolean) => void;
}

const MintCounter: FC<Props> = ({ onPresaleOpen, onPublicSaleOpen }) => {
  const [totalSupply, setTotalSupply] = useState<number>(10000);
  const [isPublicSaleOpen, setIsPublicSaleOpen] = useState(false);
  const [saleStartTime, setSaleStartTime] = useState<number | null>(null);
  const { rpcID, contractAddress } = useAppConfig();

  const provider = new ethers.providers.AlchemyProvider(rpcID);

  const registry = ethers.ContractFactory.fromSolidity(contractAbi)
    .attach(contractAddress || "")
    .connect(provider);

  const fetchTotalSupply = createFetchTotalSupply(registry);

  const maxSupply = 10000;
  const remainingSupply = maxSupply - totalSupply;

  useEffect(() => {
    const load = async () => {
      const supplyCount = await fetchTotalSupply();
      setTotalSupply(supplyCount);

      const publicSaleStartTime = parseInt(
        ethers.utils.formatUnits(await registry._startTime(), 0)
      );
      const publicSaleState = Date.now() >= publicSaleStartTime * 1000;

      setIsPublicSaleOpen(publicSaleState);
      onPublicSaleOpen(publicSaleState);
      setSaleStartTime(publicSaleStartTime);
    };
    load();
  }, []);

  return (
    <>
      {isPublicSaleOpen ? (
        <h3 className={styles["mint-header"]}>Public Mint Open Now</h3>
      ) : (
        <h3 className={styles["mint-header"]}>Sale Opens Soon</h3>
      )}
      <p className={styles["mint-counter__text"]}>
        {remainingSupply.toLocaleString()} available
      </p>
      {saleStartTime && <Countdown startTime={saleStartTime} />}
    </>
  );
};

export default MintCounter;
