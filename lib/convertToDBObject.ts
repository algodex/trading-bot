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

import { Order } from "./types/order";

const convertToDBObject = (dbOrder: Order): Order => {
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
    appId:
      dbOrder.type === "buy"
        ? parseInt(process.env.ALGODEX_ALGO_ESCROW_APP!)
        : parseInt(process.env.ALGODEX_ASA_ESCROW_APP!),
    contract: {
      creator: dbOrder.contract.creator,
      data: dbOrder.contract.lsig!.lsig.logic.toJSON(),
      escrow: dbOrder.contract.escrow,
    },
  };
  return obj;
};

export default convertToDBObject;
