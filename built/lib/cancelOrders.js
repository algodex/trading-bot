"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelOrders = exports.convertCancelResultsToDBPromises = void 0;
const convertCancelResultsToDBPromises = (escrowDB, results, orders) => {
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
exports.convertCancelResultsToDBPromises = convertCancelResultsToDBPromises;
const cancelOrders = async (escrowDB, orders, cancelPromises) => {
    return await Promise.all(cancelPromises)
        .then(async function (results) {
        const removeFromDBPromises = (0, exports.convertCancelResultsToDBPromises)(escrowDB, results, orders);
        const result = await Promise.all(removeFromDBPromises).catch(function (e) {
            console.error(e);
        });
        return result;
    })
        .catch(function (e) {
        console.error(e);
    });
};
exports.cancelOrders = cancelOrders;
