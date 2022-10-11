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
const getCurrentOrders = async (escrowDB, indexer, openAccountSet) => {
    const currentEscrows = await escrowDB.allDocs({
        include_docs: true,
    });
    currentEscrows.rows.forEach((escrow) => {
        escrow.doc.order.escrowAddr = escrow.doc._id;
    });
    const escrowsWithBalances = [];
    const currentUnixTime = Math.round(Date.now() / 1000);
    for (let i = 0; i < currentEscrows.rows.length; i++) {
        const escrow = currentEscrows.rows[i];
        const escrowAddr = escrow.doc.order.escrowAddr;
        const orderCreationTime = escrow.doc.order.unixTime || 0;
        // Assume new orders are still open
        const timeDiff = currentUnixTime - orderCreationTime;
        if (openAccountSet.has(escrowAddr) || timeDiff < 60) {
            escrowsWithBalances.push(escrow);
        }
    }
    const hasBalanceSet = new Set(escrowsWithBalances.map((escrow) => escrow.doc.order.escrowAddr));
    const removeFromDBPromises = [];
    currentEscrows.rows.forEach(async (escrow) => {
        const addr = escrow.doc.order.escrowAddr;
        if (!hasBalanceSet.has(addr)) {
            removeFromDBPromises.push(escrowDB.remove(escrow.doc));
        }
    });
    await Promise.all(removeFromDBPromises).catch(function (e) {
        console.error(e);
    });
    return { rows: escrowsWithBalances };
};
exports.default = getCurrentOrders;
