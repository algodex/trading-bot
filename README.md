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
yarn run compile-and-start-cli --assetId=insert_assetId --ladderTiers=insert_ladderTiers --spreadPercentage=insert_spreadPercentage --orderAlgoDepth=insert_orderAlgoDepth
```
### assetId is the Id of the asset you want to trade on the bot
### ladderTiers is the number of orders to place on either side of the spread
### spreadPercentage is the distance between each order. Lower gets more rewards
### orderAlgoDepth is the order depth in algos. I.e. each order will be worth X algos
## Testing

```
yarn run test-jest
```
