import React, { Component } from "react";
import { Button, Typography, Grid, TextField } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';

import LolBetter from "./contracts/LolBetter.json";
import getWeb3 from "./utils/getWeb3";

import { theme } from './utils/theme';
import Header from './components/Header';
import "./App.css";

const GAS = 500000;
const GAS_PRICE = "20000000000";

class App extends Component {
  state = { web3: null, accounts: null, contract: null, betAmount: 0 };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = LolBetter.networks[networkId];
      const contract = new web3.eth.Contract(
        LolBetter.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract });

      // Refresh on-chain data every 10 seconds
      const component = this;
      async function loopRefresh() {
        await component.refreshState();
        setTimeout(loopRefresh, 10000);
      }
      loopRefresh();

    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  refreshState = async () => {
    const totalBetA = await this.state.web3.utils.fromWei(await this.state.contract.methods.totalBetA().call());
    const totalBetB = await this.state.web3.utils.fromWei(await this.state.contract.methods.totalBetB().call());

    const myBetA = await this.state.web3.utils.fromWei(await this.state.contract.methods.getBetAmount(false).call({from: this.state.accounts[0]}));
    const myBetB = await this.state.web3.utils.fromWei(await this.state.contract.methods.getBetAmount(true).call({from: this.state.accounts[0]}));

    const matchId = await this.state.contract.methods.matchId().call();
    const teamA = await this.state.contract.methods.teamA().call();
    const teamB = await this.state.contract.methods.teamB().call();

    const fulfilled = await this.state.contract.methods.fulfilled().call();
    const result = await this.state.contract.methods.result().call();

    var fulfillMessage;
    if (fulfilled)
    {
        if (!result)
        {
            fulfillMessage = `${teamA} has won!`;
        }
        else
        {
            fulfillMessage = `${teamB} has won!`;
        }
    }
    else
    {
        fulfillMessage = "Match result has not been received yet";
    }
    
    this.setState({ totalBetA, totalBetB, myBetA, myBetB, matchId, teamA, teamB, fulfilled, result, fulfillMessage });
  }

  handleUpdateForm = (name, value) => {
    this.setState({ [name]: value });
  }

  handleRequestResults = async () => {
    const lastBlock = await this.state.web3.eth.getBlock("latest");
    this.setState({ message: "Requesting the result to be delivered..." });
    try {
      await this.state.contract.methods.checkResult().send({ from: this.state.accounts[0], gas: GAS, gasPrice: GAS_PRICE });
      while (true) {
        const responseEvents = await this.state.contract.getPastEvents('ChainlinkFulfilled', { fromBlock: lastBlock.number, toBlock: 'latest' });
        if (responseEvents.length !== 0) {
          break;
        }
      }
      this.refreshState();
      this.setState({ message: "The result is delivered" });
    } catch (error) {
      console.error(error);
      this.setState({ message: "Failed getting the result" });
    }
  }

  handleWithdraw = async () => {
    try {
        const balanceBefore = await this.state.web3.utils.fromWei(await this.state.web3.eth.getBalance(this.state.accounts[0]));
        await this.state.contract.methods.withdraw().send({ from: this.state.accounts[0], gas: GAS, gasPrice: GAS_PRICE });
        const balanceAfter = await this.state.web3.utils.fromWei(await this.state.web3.eth.getBalance(this.state.accounts[0]))
        this.refreshState();
        this.setState({ message: `You received ${balanceAfter - balanceBefore} ETH` });
      }
      catch (error) {
        console.error(error);
        this.setState({ message: "Failed withdrawing" });
      }
  }

  handleBet = async (team) => {
    this.setState({ message: 'Placing bet...' });

    var betOutcome;
    if (team === "teamA")
    {
        betOutcome = false;
    }
    else if (team === "teamB")
    {
        betOutcome = true;
    }

    try {
        await this.state.contract.methods.bet(betOutcome).send({ from: this.state.accounts[0], value: this.state.web3.utils.toWei(this.state.betAmount), gas: GAS, gasPrice: GAS_PRICE });
        this.refreshState();
        this.setState({ message: 'Bet placed' });
      } catch (error) {
        console.error(error);
        this.setState({ message: 'Failed placing the bet' });
      }
  }

  render() {
    if (!this.state.web3) {
      return (
        <ThemeProvider theme={theme}>
        <div className="App">
          <Header />
          <Typography>
            Loading Web3, accounts, and contract...
          </Typography>
        </div>
      </ThemeProvider>
      );
    }
    return (
        <ThemeProvider theme={theme}>
        <div className="App">
          <Header />
          <Typography variant="h5" style={{ marginTop: 32 }}>
            {`Match ID: ${this.state.matchId}`}
          </Typography>
          <Typography variant="h5">
            {`${this.state.teamA} vs. ${this.state.teamB}`}
          </Typography>
          <Typography variant="h5" style={{ marginTop: 32 }}>
            {this.state.fulfillMessage}
          </Typography>

          <Grid container style={{ marginTop: 32 }}>
            <Grid item xs={3}>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="h5">
                {`${this.state.teamA}`}
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="h5">
                {`${this.state.teamB}`}
              </Typography>
            </Grid>
          </Grid>

          <Grid container>
            <Grid item xs={3}>
            <Typography variant="h5">
                {"Total bets"}
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="h5">
                {`${this.state.totalBetA}`}
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="h5">
                {`${this.state.totalBetB}`}
              </Typography>
            </Grid>
          </Grid>

          <Grid container>
            <Grid item xs={3}>
            <Typography variant="h5">
                {"Your bets"}
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="h5">
                {`${this.state.myBetA}`}
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="h5">
                {`${this.state.myBetB}`}
              </Typography>
            </Grid>
          </Grid>

          <Grid container style={{ marginTop: 32 }}>
            <Grid item xs={3}>
              <Typography variant="h5">
                {"Bet amount"}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <TextField
                  id="bet-amount"
                  className="input"
                  value={this.state.betAmount}
                  onChange={e => this.handleUpdateForm('betAmount', e.target.value)}
              />
            </Grid>
          </Grid>

          <Grid container style={{ marginTop: 32 }}>
            <Grid item xs={3}>
            </Grid>
            <Grid item xs={3}>
                <Button variant="contained" color="primary" onClick={() => this.handleBet('teamA')}>
                {`Bet on ${this.state.teamA}`}
                </Button>
            </Grid>
            <Grid item xs={3}>
              <Button variant="contained" color="primary" onClick={() => this.handleBet('teamB')}>
                {`Bet on ${this.state.teamB}`}
              </Button>
            </Grid>
          </Grid>

          <Grid container style={{ marginTop: 32 }}>
            <Grid item xs={3}>
            </Grid>
            <Grid item xs={3}>
                <Button variant="contained" color="primary" onClick={() => this.handleRequestResults()}>
                  Request result
                </Button>
            </Grid>
            <Grid item xs={3}>
              <Button variant="contained" color="primary" onClick={() => this.handleWithdraw()}>
                  Withdraw winnings
              </Button>
            </Grid>
          </Grid>

          <Typography variant="h5" style={{ marginTop: 32 }}>
            {this.state.message}
          </Typography>

        </div>
      </ThemeProvider>
    );
  }
}

export default App;
