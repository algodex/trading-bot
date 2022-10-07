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

import convertToDBObject from "../convertToDBObject";
import { Order } from "../types/order";

interface ValidResult {
  contract: Order;
}

const addOrdersToDB = async (escrowDB: any, validResults: ValidResult[]) => {
  const ordersAddToDB = validResults
    .filter((order) => order.contract.amount > 0)
    .map((order) => {
      return escrowDB.put({
        _id: order.contract.escrowAddr,
        order: convertToDBObject(order.contract),
      });
    });
  //     .filter((order) => order[0].contract.amount > 0)
  //     .map((order) => {
  //       return escrowDB.put({
  //         _id: order[0].contract.escrow,
  //         order: convertToDBObject(order[0]),
  //       });
  //     });
  return await Promise.all(ordersAddToDB).catch((e) => {
    console.error(e);
  });
};

export default addOrdersToDB;
