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
import { Order } from "./types/order";

const convertToDBObject = (dbOrder: Order, environment:Environment): Order => {
  const obj = {
    unixTime: Math.round(Date.now() / 1000),
    address: dbOrder.address,
    escrowAddr: dbOrder.address,
    version: dbOrder.version,
    price: dbOrder.price,
    amount: dbOrder.amount,
    total: dbOrder.price * dbOrder.amount,
    asset: { id: dbOrder.asset.id, decimals: 6 },
    assetId: dbOrder.asset.id,
    type: dbOrder.type,
    appId: getAppId({
      isTestnet: environment === "testnet",
      isBuyOrder: dbOrder.type === "buy",
    }),
    contract: {
      creator: dbOrder.contract.creator,
      data: dbOrder.contract.lsig!.lsig.logic.toJSON(),
      escrow: dbOrder.contract.escrow,
    },
  };
  return obj;
};

export default convertToDBObject;

const constants = {
  TEST_ALGO_ORDERBOOK_APPID: 22045503,
  TEST_ASA_ORDERBOOK_APPID: 22045522,
  ALGO_ORDERBOOK_APPID: 354073718,
  ASA_ORDERBOOK_APPID: 354073834,
};
export const getAppId = ({
  isTestnet,
  isBuyOrder,
}: {
  isTestnet: boolean;
  isBuyOrder: boolean;
}): number => {
  let appId = 22045503;
  if (isTestnet && isBuyOrder) {
    appId = constants.TEST_ALGO_ORDERBOOK_APPID;
  } else if (isTestnet) {
    appId = constants.TEST_ASA_ORDERBOOK_APPID;
  }

  if (!isTestnet && isBuyOrder) {
    appId = constants.ALGO_ORDERBOOK_APPID;
  } else if (!isTestnet) {
    appId = constants.ASA_ORDERBOOK_APPID;
  }
  return appId;
};
