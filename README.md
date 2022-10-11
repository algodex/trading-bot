# Algodex Trading Bot

## Requirements

- Node.js version 16 or above
- Git

## Getting Started

First `git clone` the repository. Then from a terminal in the directory:

```
npm install
```

```
cp .env.testnet.example .env
```

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Run cli

Edit the .env file to your Algorand node and indexer endpoints, and add in your wallet mnemonic (without commas).

```
npm run compile-and-start-cli -- --assetId=<assetId>
```

## Testing

```
npm run test
```
