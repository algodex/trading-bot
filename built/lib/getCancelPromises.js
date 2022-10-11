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
const algosdk_1 = require("algosdk");
const getCancelPromises = async ({ escrows, cancelSet, api, latestPrice, }) => {
    return escrows.rows
        .map((order) => order.doc.order)
        .filter((order) => cancelSet.has(order.escrowAddr))
        .filter((order) => order.contract.data !== undefined)
        .map((dbOrder) => {
        const cancelOrderObj = { ...dbOrder };
        cancelOrderObj.contract.lsig = new algosdk_1.LogicSigAccount(new Uint8Array(dbOrder.contract.data.data)); //FIXME
        cancelOrderObj.client = api.algod;
        cancelOrderObj.wallet = api.wallet;
        const tempOrder = { ...cancelOrderObj };
        delete tempOrder.wallet;
        delete tempOrder.contract;
        delete tempOrder.client;
        console.log("CANCELLING ORDER: ", JSON.stringify(tempOrder), ` Latest Price: ${latestPrice}`);
        return api.closeOrder(cancelOrderObj);
    });
};
exports.default = getCancelPromises;
