pragma solidity 0.4.24;

import "../node_modules/chainlink/contracts/ChainlinkClient.sol";
import "../node_modules/openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract BettingPool is ChainlinkClient, Ownable
{
    mapping(address => uint256) private betsA;
    mapping(address => uint256) private betsB;

    uint256 internal oraclePaymentAmount;
    bytes32 internal jobId;

    uint256 public totalBetA;
    uint256 public totalBetB;

    bool public fulfilled;
    bool public teamADidWin;

    constructor(
        address _link,
        address _oracle,
        bytes32 _jobId,
        uint256 _oraclePaymentAmount
        )
    Ownable()
    public
    {
        setChainlinkToken(_link);
        setChainlinkOracle(_oracle);
        jobId = _jobId;
        oraclePaymentAmount = _oraclePaymentAmount;
    }

    function bet(bool isBetA) external payable
    {
        require(!fulfilled, "You can't bet after the match result has been delivered.");
        if (isBetA)
        {
            betsA[msg.sender] += msg.value;
            totalBetA += msg.value;
        }
        else
        {
            betsB[msg.sender] += msg.value;
            totalBetB += msg.value;
        }
    }

    function withdraw() external
    {
        require(fulfilled, "You can't withdraw before the match result has been delivered.");
        if (teamADidWin)
        {
            msg.sender.transfer(((totalBetA + totalBetB) * betsA[msg.sender]) / totalBetA);
            betsA[msg.sender] = 0;
        }
        else
        {
            msg.sender.transfer(((totalBetA + totalBetB) * betsB[msg.sender]) / totalBetB);
            betsB[msg.sender] = 0;
        }
    }

    function getBetAmount(bool isBetA) external view returns (uint256 betAmount)
    {
        if (isBetA)
        {
            betAmount = betsA[msg.sender];
        }
        else
        {
            betAmount = betsB[msg.sender];
        }
    }
}
