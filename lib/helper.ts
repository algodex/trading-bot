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

import algosdk from "algosdk";
import axios from "axios";
import { Environment } from "./types/config";

export const shortenAddress = (address: string, numb?: number) => {
  const len = numb || 6;
  if (address) {
    const list = address.split("");
    const first = list.slice(0, len);
    const last = list.slice(list.length - len, list.length);
    return `${first.join("")}...${last.join("")}`;
  }
};

export const searchAlgoAssets = async (query: string, env: Environment) => {
  const mainnetURL = `${query ? `/algodex-mainnet/assets/search/${query}`:"algodex-mainnet/assets/searchall"}`
  const baseUrl =
    env === "mainnet" ? mainnetURL : "/algodex-testnet/asset_search.php";
  try {
    const response = await axios.get(
      baseUrl,
      env === "testnet" ? { params: { query } } : {}
    );
    return response;
  } catch (error) {
    return error;
  }
};
export const getAccountInfo = async (address: string, env: Environment) => {
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

export const isMnemonicValid = (mnemonic: string) => {
  try {
    return algosdk.mnemonicToSecretKey(mnemonic).sk;
  } catch (error) {
    return false;
  }
};

export const getTinymanAssets = async (env: Environment) => {
  const tinymanAssetsURL =
    env === "mainnet"
      ? "https://mainnet.analytics.tinyman.org/api/v1/current-asset-prices/"
      : "https://testnet.analytics.tinyman.org/api/v1/current-asset-prices/";

  const assetList = await axios({
    method: "get",
    url: tinymanAssetsURL,
    responseType: "json",
    timeout: 3000,
  });
  return assetList.data;
};

export const getTinymanLiquidity = async (env: Environment) => {
  const tinymanPoolURL =
    env === "mainnet"
      ? "https://mainnet.analytics.tinyman.org/api/v1/pools/?limit=all"
      : "https://testnet.analytics.tinyman.org/api/v1/pools/?limit=all";

  const response = await axios({
    method: "get",
    url: tinymanPoolURL,
    responseType: "json",
    timeout: 3000,
  });
  return response.data;
};
