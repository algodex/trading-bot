/*
 * Algodex Trading Bot
 * Copyright (C) 2022 Algodex VASP (BVI) Corp.
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

/* Usage:
 *
 * cp .env.testnet.example .env
 * node lib/bot.ts --assetId=<assetId>
 *
 */

import { BotConfig } from "../lib/types/config";

const args = require("minimist")(process.argv.slice(2));
require("dotenv").config();
const PouchDB = require("pouchdb");
const algosdk = require("algosdk");
const { cancelOrders } = require("../lib/cancelOrders");

import sleep from "../lib/sleep";
import getCancelPromises from "../lib/getCancelPromises";
import getCurrentOrders from "../lib/getCurrentOrders";
import getOpenAccountSetFromAlgodex from "../lib/getOpenAccountSetFromAlgodex";

import initAPI from "../lib/initAPI";
import runLoop from "../lib/runLoop";

// app.set('host', '127.0.0.1');
if (args.assetId == undefined || args.assetId.length === 0) {
  throw new Error("assetId is not set in the args!");
}

if (
  process.env.NEXT_PUBLIC_ENVIRONMENT == undefined ||
  process.env.NEXT_PUBLIC_ENVIRONMENT.length === 0
) {
  throw new Error("ENVIRONMENT is not set in .env!");
}
if (!process.env.NEXT_PUBLIC_ALGOD_SERVER) {
  throw new Error("NEXT_PUBLIC_ALGOD_SERVER not set in .env!");
}
// if (!process.env.ALGOD_TOKEN) {
//   throw new Error('ALGOD_TOKEN not set!');
// }
// if (!process.env.ALGOD_PORT) {
//   throw new Error('ALGOD_PORT not set!');
// }
if (!process.env.NEXT_PUBLIC_INDEXER_SERVER) {
  throw new Error("NEXT_PUBLIC_INDEXER_SERVER not set in .env!");
}
if (!process.env.ALGODEX_ALGO_ESCROW_APP) {
  throw new Error("ALGODEX_ALGO_ESCROW_APP not set in .env!");
}
if (!process.env.ALGODEX_ASA_ESCROW_APP) {
  throw new Error("ALGODEX_ASA_ESCROW_APP not set in .env!");
}
// if (!process.env.NEXT_PUBLIC_INDEXER_TOKEN) {
//   throw new Error('NEXT_PUBLIC_INDEXER_TOKEN not set!');
// }
// if (!process.env.NEXT_PUBLIC_INDEXER_PORT) {
//   throw new Error('NEXT_PUBLIC_INDEXER_PORT not set!');
// }
if (!process.env.ORDER_ALGO_DEPTH) {
  throw new Error("ORDER_ALGO_DEPTH not set in .env!");
}
const minSpreadPerc = parseFloat(process.env.SPREAD_PERCENTAGE!) || 0.0065; // FIXME
const nearestNeighborKeep =
  parseFloat(process.env.NEAREST_NEIGHBOR_KEEP!) || 0.0035; // FIXME
// const escrowDB = new PouchDB('escrows');
// const escrowDB = new PouchDB('http://admin:dex@127.0.0.1:5984/market_maker');
const assetId = parseInt(args.assetId);
const walletAddr = algosdk.mnemonicToSecretKey(
  process.env.WALLET_MNEMONIC
).addr;
const pouchUrl = process.env.POUCHDB_URL ? process.env.POUCHDB_URL + "/" : "";
const fullPouchUrl =
  pouchUrl +
  "market_maker_" +
  assetId +
  "_" +
  walletAddr.slice(0, 8).toLowerCase();
const escrowDB = new PouchDB(fullPouchUrl);
const ladderTiers = parseInt(process.env.LADDER_TIERS!) || 3;
const useTinyMan =
  (process.env.USE_TINYMAN &&
    process.env.USE_TINYMAN.toLowerCase() !== "false") ||
  false;
const environment =
  process.env.NEXT_PUBLIC_ENVIRONMENT === "mainnet" ? "mainnet" : "testnet";
const orderAlgoDepth = parseInt(process.env.ORDER_ALGO_DEPTH!);

const api = initAPI(environment);

const config: BotConfig = {
  assetId,
  walletAddr,
  minSpreadPerc,
  nearestNeighborKeep,
  escrowDB,
  ladderTiers,
  useTinyMan,
  environment,
  orderAlgoDepth,
  api,
};
// Object.freeze(config);

if (!process.env.WALLET_MNEMONIC) {
  throw new Error("Mnemonic not set!");
}

const runState = {
  isExiting: false,
  inRunLoop: false,
};

process.on("SIGINT", async () => {
  console.log("Caught interrupt signal");
  runState.isExiting = true;
  while (runState.inRunLoop) {
    console.log("waiting to exit");
    await sleep(500);
  }
  // await sleep(3000);
  console.log("Canceling all orders");
  const openAccountSet = await getOpenAccountSetFromAlgodex(
    environment,
    walletAddr,
    assetId
  );
  const escrows = await getCurrentOrders(
    escrowDB,
    api.indexer,
    openAccountSet,
    environment
  );
  const cancelArr = escrows.rows.map((escrow) => escrow.doc.order.escrowAddr);
  const cancelSet = new Set(cancelArr);
  const cancelPromises = await getCancelPromises({
    escrows,
    cancelSet,
    api,
    latestPrice: 0,
  });
  await cancelOrders(escrowDB, escrows, cancelPromises);
  process.exit();
});

runLoop({ config, assetInfo: null, lastBlock: 0, runState });
