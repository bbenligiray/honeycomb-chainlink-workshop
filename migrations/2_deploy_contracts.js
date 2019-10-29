const SoccerBettingPool = artifacts.require("SoccerBettingPool");

const linkTokenAddress = "0x20fE562d797A42Dcb3399062AE9546cd06f63280";
const oracle = "0x4a3fbbb385b5efeb4bc84a25aaadcd644bd09721";
const jobId = web3.utils.toHex("68b0c38c7d614245a8911c224803ffb8");
const paymentAmount = web3.utils.toWei("0.1");
const matchId = "1744661";
const teamA = "US Sassuolo Calcio";
const teamB = "FC Internazionale Milano";

module.exports = async function (deployer) {
    await deployer.deploy(SoccerBettingPool, linkTokenAddress, oracle, jobId, paymentAmount, matchId, teamA, teamB);
    const soccerBettingPool = await SoccerBettingPool.deployed();
    console.log("Soccer Betting Pool contract address: " + soccerBettingPool.address);
};
