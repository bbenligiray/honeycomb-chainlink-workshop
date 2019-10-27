pragma solidity 0.4.24;

import "./BettingPool.sol";

contract LoLBettingPool is BettingPool
{
    string public matchId;
    string public teamA;
    string public teamB;
    
    constructor(
        address _link,
        address _oracle,
        bytes32 _jobId,
        uint256 _oraclePaymentAmount,
        string _matchId,
        string _teamA,
        string _teamB
        )
    BettingPool(
        _link,
        _oracle,
        _jobId,
        _oraclePaymentAmount
        )
    public
    {
        matchId = _matchId;
        teamA = _teamA;
        teamB = _teamB;
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

    function fulfill(bytes32 _requestId, bytes32 _data)
    public
    recordChainlinkFulfillment(_requestId)
    {
        if (_data == "team_A")
        {
            fulfilled = true;
            teamADidWin = true;
        }
        else if (_data == "team_B")
        {
            fulfilled = true;
            teamADidWin = false;
        }
    }
}