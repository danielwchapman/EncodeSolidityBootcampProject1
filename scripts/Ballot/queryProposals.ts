import { Contract, ethers } from "ethers";
import "dotenv/config";
import * as ballotJson from "../../artifacts/contracts/Ballot.sol/Ballot.json";
// eslint-disable-next-line node/no-missing-import
import { Ballot } from "../../typechain";

// This key is already public on Herong's Tutorial Examples - v1.03, by Dr. Herong Yang
// Do never expose your keys like this
const EXPOSED_KEY =
  "8da4ef21b864d2cc526dbdb2a120bd2874c36c9d0a1fb7f8c63d7f7a8b41de8f";

async function main() {
  const wallet =
    process.env.MNEMONIC && process.env.MNEMONIC.length > 0
      ? ethers.Wallet.fromMnemonic(process.env.MNEMONIC)
      : new ethers.Wallet(process.env.PRIVATE_KEY ?? EXPOSED_KEY);
  console.log(`Using address ${wallet.address}`);
  const provider = ethers.providers.getDefaultProvider("ropsten");
  const signer = wallet.connect(provider);
  const balanceBN = await signer.getBalance();
  const balance = Number(ethers.utils.formatEther(balanceBN));
  console.log(`Wallet balance ${balance}`);
  if (balance < 0.01) {
    throw new Error("Not enough ether");
  }
  if (process.argv.length < 3) throw new Error("Ballot address missing");
  const ballotAddress = process.argv[2];


  console.log(
    `Attaching ballot contract interface to address ${ballotAddress}`
  );


  const ballotContract: Ballot = new Contract(
    ballotAddress,
    ballotJson.abi,
    signer
  ) as Ballot;


  const chairpersonAddress = await ballotContract.chairperson();
  if (chairpersonAddress !== signer.address)
    throw new Error("Caller is not the chairperson for this contract");

  console.log(`Getting proposal 0..`);
  const proposal0 = await ballotContract.proposals(0);
  console.log(`Transaction completed. Vote count: ${proposal0.voteCount}`);

  console.log(`Getting proposal 1..`);
  const proposal1 = await ballotContract.proposals(1);
  console.log(`Transaction completed. Vote count: ${proposal1.voteCount}`);

  console.log(`Getting proposal 2..`);
  const proposal2 = await ballotContract.proposals(2);
  console.log(`Transaction completed. Vote count: ${proposal2.voteCount}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
