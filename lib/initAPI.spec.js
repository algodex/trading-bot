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

const initAPI = require("./initAPI").default;

// const algodexApiMock = {
//   setWallet: jest.fn(input =>  new Promise(resolve => resolve(input)))
// }
// remove: jest.fn(doc => new Promise(resolve => resolve('done'))),

test("can initialize api", () => {
  process.env.NEXT_PUBLIC_ALGOD_SERVER =
    "https://node.testnet.algoexplorerapi.io";
  process.env.NEXT_PUBLIC_ALGOD_PORT = 8080;
  process.env.NEXT_PUBLIC_ALGOD_TOKEN = "asdasdasda";

  process.env.NEXT_PUBLIC_INDEXER_SERVER =
    "https://algoindexer.testnet.algoexplorerapi.io";
  process.env.NEXT_PUBLIC_INDEXER_PORT = 8080;
  process.env.NEXT_PUBLIC_INDEXER_TOKEN = "bbbadasda";

  const api = initAPI("testnet");
  expect(api.config).toEqual({
    algod: {
      uri: "https://node.testnet.algoexplorerapi.io",
      token: "asdasdasda",
      port: 8080,
    },
    indexer: {
      uri: "https://algoindexer.testnet.algoexplorerapi.io",
      token: "bbbadasda",
      port: 8080,
    },
    explorer: {
      uri: "https://indexer.testnet.algoexplorerapi.io",
    },
    dexd: {
      apiVersion: 2,
      uri: "https://testnet.algodex.com/api/v2",
      token: "",
    },
  });
});

test("can initialize with null ports and tokens", () => {
  process.env.NEXT_PUBLIC_ALGOD_SERVER =
    "https://node.testnet.algoexplorerapi.io";
  delete process.env.NEXT_PUBLIC_ALGOD_PORT;
  delete process.env.NEXT_PUBLIC_ALGOD_TOKEN;

  process.env.NEXT_PUBLIC_INDEXER_SERVER =
    "https://algoindexer.testnet.algoexplorerapi.io";
  delete process.env.NEXT_PUBLIC_INDEXER_PORT;
  delete process.env.NEXT_PUBLIC_INDEXER_TOKEN;

  const api = initAPI("testnet");
  expect(api.config).toEqual({
    algod: {
      uri: "https://node.testnet.algoexplorerapi.io",
      token: "",
    },
    indexer: {
      uri: "https://algoindexer.testnet.algoexplorerapi.io",
      token: "",
    },
    explorer: {
      uri: "https://indexer.testnet.algoexplorerapi.io",
    },
    dexd: {
      apiVersion: 2,
      uri: "https://testnet.algodex.com/api/v2",
      token: "",
    },
  });
});

test("can initialize with empty ports and tokens", () => {
  process.env.NEXT_PUBLIC_ALGOD_SERVER =
    "https://node.testnet.algoexplorerapi.io";
  process.env.NEXT_PUBLIC_ALGOD_PORT = "";
  process.env.NEXT_PUBLIC_ALGOD_TOKEN = "";

  process.env.NEXT_PUBLIC_INDEXER_SERVER =
    "https://algoindexer.testnet.algoexplorerapi.io";
  process.env.NEXT_PUBLIC_INDEXER_PORT = "";
  process.env.NEXT_PUBLIC_INDEXER_TOKEN = "";

  const api = initAPI("testnet");
  expect(api.config).toEqual({
    algod: {
      uri: "https://node.testnet.algoexplorerapi.io",
      token: "",
    },
    indexer: {
      uri: "https://algoindexer.testnet.algoexplorerapi.io",
      token: "",
    },
    explorer: {
      uri: "https://indexer.testnet.algoexplorerapi.io",
    },
    dexd: {
      apiVersion: 2,
      uri: "https://testnet.algodex.com/api/v2",
      token: "",
    },
  });
});
