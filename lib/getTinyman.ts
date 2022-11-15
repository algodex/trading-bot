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
import { getPoolInfo, getValidatorAppID } from "@tinymanorg/tinyman-js-sdk";

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

export const getTinymanPoolInfo = async (
  env: Environment,
  assetId: number,
  assetDecimals: number
) => {
  const algodToken = "";
  const algodServer =
    env === "testnet"
      ? "https://node.testnet.algoexplorerapi.io"
      : "https://node.algoexplorerapi.io";
  const algodPort = "";
  const algodClient = new algosdk.Algodv2(algodToken, algodServer, algodPort);

  if (env && assetId && assetDecimals) {
    const validatorAppID = getValidatorAppID(env);
    return await getPoolInfo(algodClient, {
      validatorAppID,
      asset1ID: 0,
      asset2ID: assetId,
    });
  }
};

export const getTinymanPools = async (env: Environment) => {
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
