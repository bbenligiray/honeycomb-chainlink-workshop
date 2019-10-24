# Honeycomb-Chainlink Workshop Sample Project

This is a sample project to build a dApp that calls a [Honeycomb marketplace](https://honeycomb.market) API endpoint through a [Chainlink](https://chain.link) node over the Ropsten testnet.

## Before installation

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

- Deploy the contract on Ropsten:

`$ npm run deploy-ropsten`

- Go to the front-end project directory

`$ cd client`

- Install the dependencies for the front-end project:

`$ npm install`

- Fire up the front-end project locally, which is going to fire up your browser and connect to your smart contract using your Metamask add-on:

`$ npm run start`

## Further pointers

- Run the `npm run deploy-ropsten` command for the changes you have made to the smart contract to take effect.

- Run the `npm run start` command for the changes you have made to the front-end to take effect.

- You may want to test your smart contract locally first.
To do that, install `ganache-cli` and run it on a separate terminal.
Note that smart contracts running on a local network would not be able to make calls to oracles on the Ropsten network, so you would have to simulate the oracles.