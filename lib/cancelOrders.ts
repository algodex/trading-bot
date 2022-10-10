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

import { AllDocsResult } from "./types/order";

interface CancelResult {
  escrowAddr: string;
}

export const convertCancelResultsToDBPromises = (
  escrowDB: any,
  results: CancelResult[][],
  orders: AllDocsResult
) => {
  const addrs = results.map((result) => result[0].escrowAddr);
  const resultAddrs = new Set(addrs);
  const removeFromDBPromises = orders.rows
    .filter((order) => resultAddrs.has(order.doc.order.escrowAddr))
    .map((order) => escrowDB.remove(order.doc));
  if (results.length > 0) {
    console.log({ results });
  }
  return removeFromDBPromises;
};

export const cancelOrders = async (
  escrowDB: any,
  orders: AllDocsResult,
  cancelPromises: any
) => {
  return await Promise.all(cancelPromises)
    .then(async function (results) {
      const removeFromDBPromises = convertCancelResultsToDBPromises(
        escrowDB,
        results,
        orders
      );
      const result = await Promise.all(removeFromDBPromises).catch(function (
        e
      ) {
        console.error(e);
      });
      return result;
    })
    .catch(function (e) {
      console.error(e);
    });
};
