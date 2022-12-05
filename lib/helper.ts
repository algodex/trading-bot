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
import { getTinymanPoolInfo } from "./getTinyman";
import getTinymanPrice from "./getTinymanPrice";
import { storageKeys } from "./storage";
import { Environment } from "./types/config";
const axios = require("axios");

const algodToken = "";
const algodServer = "https://node.algoexplorerapi.io/";
const algodPort = "";
export const algodClient = new algosdk.Algodv2(
  algodToken,
  algodServer,
  algodPort
);

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
  if (!env) return;
  const baseUrl = `${
    query
      ? `/algodex-${env}/assets/search/${query}`
      : `algodex-${env}/assets/searchall`
  }`;
  try {
    const response = await axios.get(baseUrl);
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

export const getAlgoUSD = async () => {
  const baseUrl = "https://price.algoexplorerapi.io/price/algo-usd";
  const res = await axios({
    method: "get",
    url: `${baseUrl}`,
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

export const calculateLogValue = (value: number, min: number, max: number) => {
  if (value === min) return min;
  const minv = Math.log(min);
  const maxv = Math.log(max);
  const scale = (maxv - minv) / (max - min);
  return parseFloat(Math.exp(minv + scale * (value - min)).toFixed(2));
};

export const calculateReverseLogValue = (
  value: any,
  min: number,
  max: number
) => {
  if (value) {
    const minv = Math.log(min);
    const maxv = Math.log(max);
    const scale = (maxv - minv) / (max - min);
    return (Math.log(value) - minv) / scale + min;
  }
  return min;
};

export const checkTinymanLiquidity = async ({
  assetId,
  decimals,
  environment,
}: {
  assetId: number;
  decimals: number;
  environment: Environment;
}) => {
  try {
    const poolInfo = await getTinymanPoolInfo(environment, assetId, decimals);
    if (poolInfo) {
      return await getTinymanPrice(
        assetId,
        environment,
        decimals,
        poolInfo.addr
      );
    }
  } catch (error) {
    setTimeout(() => {
      return checkTinymanLiquidity({
        assetId,
        decimals,
        environment,
      });
    }, 5000);
  }
};

const getCurrent = () => {
  const prev = localStorage.getItem(storageKeys.assets);
  return prev ? JSON.parse(prev) : [];
};

export const currentlyTrading = (assetId: number | string, dispatch: any) => {
  //Check if the assetId is present in the current trades; opened via multiple tabs
  if (getCurrent().includes(assetId)) {
    dispatch({
      type: "asaError",
      payload: "This asset is currently trading on another tab!",
    });
    return true;
  }
  return false;
};

export const addToTradeList = (assetId: number) => {
  const current = getCurrent();
  if (!current.includes(assetId)) {
    localStorage.setItem(
      storageKeys.assets,
      JSON.stringify([...current, assetId])
    );
  }
};

export const removeFromTradeList = (assetId?: number) => {
  if (assetId) {
    const copy = [...getCurrent()];
    const currIndex = copy.findIndex((id: number) => assetId === id);
    copy.splice(currIndex, 1);
    localStorage.setItem(storageKeys.assets, JSON.stringify(copy));
  } else {
    localStorage.removeItem(storageKeys.assets);
  }
};
