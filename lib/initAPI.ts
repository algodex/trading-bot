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

import { Environment } from "./types/config";

const AlgodexAPI = require("@algodex/algodex-sdk");

const initAPI = (environment: Environment): any => {
  return new AlgodexAPI({
    config: {
      algod: {
        uri:
          environment === "mainnet"
            ? "https://node.algoexplorerapi.io"
            : "https://node.testnet.algoexplorerapi.io",
        token: process.env.NEXT_PUBLIC_ALGOD_TOKEN || "",
        port: process.env.NEXT_PUBLIC_ALGOD_PORT
          ? parseInt(process.env.NEXT_PUBLIC_ALGOD_PORT)
          : undefined,
      },
      indexer: {
        uri:
          environment === "mainnet"
            ? "https://algoindexer.algoexplorerapi.io"
            : "https://algoindexer.testnet.algoexplorerapi.io",
        token: process.env.NEXT_PUBLIC_INDEXER_TOKEN || "",
        port: process.env.NEXT_PUBLIC_INDEXER_PORT
          ? parseInt(process.env.NEXT_PUBLIC_INDEXER_PORT)
          : undefined,
      },
      explorer: {
        uri:
          environment === "mainnet"
            ? "https://indexer.algoexplorerapi.io"
            : "https://indexer.testnet.algoexplorerapi.io",
      },
      dexd: {
        uri:
          environment === "mainnet"
            ? "https://app.algodex.com/api/v2"
            : "https://testnet.algodex.com/algodex-backend",
        token: "",
      },
    },
  });
};

export default initAPI;
