pragma solidity 0.4.24;

import "../node_modules/chainlink/contracts/ChainlinkClient.sol";
import "../node_modules/openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract LolBetter is ChainlinkClient, Ownable{
    mapping(address => uint256) private betsA;
    mapping(address => uint256) private betsB;

    uint256 private oraclePaymentAmount;
    bytes32 private jobId;

    string public matchId;
    string public teamA;
    string public teamB;

    uint256 public totalBetA;
    uint256 public totalBetB;

    bool public fulfilled;
    bool public result;

    constructor(
        address _link,
        address _oracle,
        bytes32 _jobId,
        uint256 _oraclePaymentAmount,
        string _matchId,
        string _teamA,
        string _teamB
        )
    Ownable()
    public
    {
        setChainlinkToken(_link);
        setChainlinkOracle(_oracle);
        jobId = _jobId;
        oraclePaymentAmount = _oraclePaymentAmount;
        matchId = _matchId;
        teamA = _teamA;
        teamB = _teamB;
    }

    function bet(bool betResult) external payable
    {
        require(!fulfilled, "You can't bet after the match result has been delivered.");
        if (!betResult)
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
        if (!result)
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

    function checkResult() external onlyOwner returns (bytes32 requestId)
    {
        require(!fulfilled, "The match result has already been delivered.");
        Chainlink.Request memory req = buildChainlinkRequest(jobId, this, this.fulfill.selector);
        req.add("id", matchId);
        req.add("type", "match");
        req.add("copyPath", "datasportsgroup.competition.season.rounds.group.match.winner");
        requestId = sendChainlinkRequestTo(chainlinkOracleAddress(), req, oraclePaymentAmount);
    }

    function getBetAmount(bool outcome) external view returns (uint256 betAmount)
    {
        if (!outcome)
        {
            betAmount = betsA[msg.sender];
        }
        else
        {
            betAmount = betsB[msg.sender];
        }
    }

    function fulfill(bytes32 _requestId, bytes32 _data)
    public
    recordChainlinkFulfillment(_requestId)
    {
        if (_data == "team_A")
        {
            fulfilled = true;
            result = false;
        }
        else if (_data == "team_B")
        {
            fulfilled = true;
            result = true;
        }
    }
}
