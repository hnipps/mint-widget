// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";
import abi from "./abi";

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  const [signer] = await ethers.getSigners();

  // We get the contract to deploy
  const test = new ethers.Contract(
    "0x724AECdA68D9eCbac7341D79E0576686b6132419",
    abi.abi,
    signer
  );
  console.log("Active:");
  console.log(await test.isFreesaleActive());
  console.log(await test.isPresaleActive());
  console.log(await test.isMainsaleActive());
  console.log(await test.isVerified());

  const tx = await test.setActive(true, true, false, true);
  await tx.wait();

  console.log("Active:");
  console.log(await test.isFreesaleActive());
  console.log(await test.isPresaleActive());
  console.log(await test.isMainsaleActive());
  console.log(await test.isVerified());
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
