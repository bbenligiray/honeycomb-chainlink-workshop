# Honeycomb-Chainlink Workshop Sample Project

This is a sample project to build a dApp that calls a [Honeycomb marketplace](https://honeycomb.market) API endpoint through a [Chainlink](https://chain.link) node over the Ropsten testnet.

Based on the Chainlink truffle box, react-box and the Honeycomb use-case demos done at [Web3 Summit](https://www.youtube.com/watch?v=uXYx9xYnU40).

## Before installation

- Sign up to the [Honeycomb marketplace](https://honeycomb.marketplace) to access the job listings.

- Install [npm](https://www.npmjs.com/get-npm)

- Install truffle globally using:

`$ npm install -g truffle`

- Install the Metamask add-on to your browser and create a wallet.
Note down the mnemonics.
Fund it with [Ropsten ETH](https://faucet.metamask.io/) and [Ropsten LINK](https://ropsten.chain.link/).

- Create an [Infura](https://infura.io/) account, get an endpoint URL for the Ropsten testnet and note it down.

- (Optional) Install [Visual Studio Code](https://code.visualstudio.com/)

## Installation

- Clone this repo using:

`$ git clone https://github.com/bbenligiray/honeycomb-chainlink-workshop.git`

- Go in the project directory:

`$ cd honeycomb-chainlink-workshop`

- Install the dependencies for the smart contract:

`$ npm install`

- Create the file that you are going to enter your Infura credentials:

`$ cp wallet.json.example wallet.json`

- Open the newly created `wallet.json` file and enter the mnemonics and the endpoint URL you have noted down earlier.

- Go to the front-end project directory

`$ cd client`

- Install the dependencies for the front-end project:

`$ npm install`

## Contract deployment

- Go to [Honeycomb marketplace](https://honeycomb.market) and log in.
Go to the API listings and click the API named `Data Sports Group - Premium Sports Content`.
Find the endpoint with the path `/soccer/get_matches` and click the `Connect` button.
Select `Ropsten` as the network and `bytes32` as the data format.
Note down the oracle address, JobID and LINK price.

- Using the `Test` button and the API endpoints, find the ID of the match that will be bet on.
For example, you can call `/soccer/get_matches_day` with the parameters `{"day":"2019-11-02"}` to get a list of matches that will be played on that day.
You can work your way through the API documentation to find alternative ways of getting a list of matches to be played.
Note down the match ID.

- Enter the values you have noted down in `honeycomb-chainlink-workshop/migrations/2_deploy_contracts.js`

- Go to the main project directory (`honeycomb-chainlink-workshop`).
Deploy the contract on Ropsten:

`$ npm run deploy-ropsten`

- The contract address is going to get printed on the terminal.
Fund it with Ropsten LINK.
Each Honeycomb Ropsten call costs 0.1 LINK, so you don't need much.

- Go to the front-end project directory (`honeycomb-chainlink-workshop/client`) and run the front-end project locally, which is going to fire up your browser and connect to your smart contract using your Metamask add-on:

`$ npm run start`

## Further pointers

- Rerun the `npm run deploy-ropsten` command for the changes you have made to the smart contract to take effect.

- If you are getting the `events.js:183 throw er;` error, see [this](https://stackoverflow.com/questions/49975596/events-js183-throw-er-unhandled-error-event).

- You may want to test your smart contract locally.
To do that, install `ganache-cli` and run it on a separate terminal.
Note that smart contracts running on a local network would not be able to make calls to an oracle on the Ropsten network, so you would have to simulate the oracle.

## Take-home

- Close off betting when the match starts (or ends?), not when the oracle result is received

- Implement an ETH deposit requirement to call `checkResult()`.
Otherwise people can keep calling it to drain your contract of LINK.

- Protect your contract against bugs and vulnerabilities.

- Improve the UX.
For example, the `Withdraw` button should not be clickable before the match result been delivered.

- Allow the contract creator to withdraw funds after some point.

- Make oracle requests at deployment that get the team names (so the users doesn't need to trust the developer to enter the names correctly).

- You shouldn't have to deploy a contract for each match, make this contract reusable for different matches (make sure to listen for the `ChainlinkFulfilled` event with the correct `requestId`).

- Write an aggregator to use multiple oracles.

- Deploy the contract on the mainnet and host your front-end somewhere other people can reach!