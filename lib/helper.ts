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

import axios from "axios";

export const shortenAddress = (address: string, numb?: number) => {
  const len = numb || 6;
  if (address) {
    const list = address.split("");
    const first = list.slice(0, len);
    const last = list.slice(list.length - len, list.length);
    return `${first.join("")}...${last.join("")}`;
  }
};

export const searchAlgoAssets = async (keywords: string) => {
  const url =
    process.env.NEXT_PUBLIC_ENVIRONMENT === "mainnet"
      ? "https://indexer.algoexplorerapi.io/rl/v1/search"
      : "https://indexer.testnet.algoexplorerapi.io/rl/v1/search";
  try {
    const response = await axios.get(url, {
      params: { keywords },
    });
    return response;
  } catch (error) {
    return error;
  }
};

export const getAccountInfo = async (address: string, env: string) => {
  const baseUrl =
    env === "testnet"
      ? "https://node.testnet.algoexplorerapi.io"
      : "https://node.algoexplorerapi.io";
  const res = await axios({
    method: "get",
    url: `${baseUrl}/v2/accounts/${address}`,
    timeout: 3000,
  });
  return res;
};
