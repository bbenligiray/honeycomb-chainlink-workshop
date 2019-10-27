const LoLBettingPool = artifacts.require("LoLBettingPool");

const linkTokenAddress = "0x20fE562d797A42Dcb3399062AE9546cd06f63280";
const oracle = "0x4a3fbbb385b5efeb4bc84a25aaadcd644bd09721";
const jobId = web3.utils.toHex("8301a1b813ce4acb9f5a69a4da1cc9a6");
const paymentAmount = web3.utils.toWei("0.1");
const matchId = "1784748"; // Try 1784751 for the alternative outcome
const teamA = "Clutch Gaming";
const teamB = "Fnatic";

module.exports = async function (deployer) {
    await deployer.deploy(LoLBettingPool, linkTokenAddress, oracle, jobId, paymentAmount, matchId, teamA, teamB);
    const lolBettingPool = await LoLBettingPool.deployed();
    console.log("LoL Betting Pool contract address: " + lolBettingPool.address);
};
