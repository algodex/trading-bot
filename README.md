# Algodex Trading Bot

## Requirements

- Node.js version 16 or above
- Git

## Getting Started

First `git clone` the repository. Then from a terminal in the directory:

```
yarn
```

```
cp .env.testnet.example .env
```

First, run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Run cli

Edit the .env file to your Algorand node and indexer endpoints, and add in your wallet mnemonic (without commas).

```
yarn run compile-and-start-cli --assetId=insert_assetId --ladderTiers=insert_ladderTiers --spreadPercentage=insert_spreadPercentage --orderAlgoDepth=insert_orderAlgoDepth --nearestNeighborKeep=insert_nearestNeighborKeep
```

- _assetId_ is the Id of the asset you want to trade on the bot
- _ladderTiers_ is the number of orders to place on either side of the spread
- _spreadPercentage_ is the distance between each order. Lower gets more rewards. i.e 0.01 == 1%
- _nearestNeighborKeep_ is the tolerance for the bot to cancel and replace orders as the price is changing. If your current orders are within the percentage set here, the bot will not cancel and replace until they go above this tolerance. This setting defaults to half of the set spread percentage. i.e 0.005 == 0.5%
- _orderAlgoDepth_ is the order depth in algos. I.e. each order will be worth X algos

## Testing

```
yarn run test-jest
```
