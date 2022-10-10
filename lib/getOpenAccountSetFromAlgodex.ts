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

const axios = require("axios");

const getOpenAccountSetFromAlgodex = async (
  environment: Environment,
  walletAddr: string,
  assetId: number
): Promise<Set<string>> => {
  const url =
    environment == "testnet"
      ? "https://testnet.algodex.com/algodex-backend/orders.php?ownerAddr=" +
        walletAddr
      : "https://app.algodex.com/algodex-backend/orders.php?ownerAddr=" +
        walletAddr;
  const orders = await axios({
    method: "get",
    url: url,
    responseType: "json",
    timeout: 10000,
  });
  const allOrders = [
    ...orders.data.buyASAOrdersInEscrow,
    ...orders.data.sellASAOrdersInEscrow,
  ];
  const arr = allOrders
    .filter((order) => order.assetId === assetId)
    .map((order) => order.escrowAddress);
  const set = new Set(arr);
  return set;
};

export default getOpenAccountSetFromAlgodex;
