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
const getIdealPrices = (ladderTiers, latestPrice, minSpreadPerc) => {
    const prices = [];
    for (let i = 1; i <= ladderTiers; i++) {
        const randomOffset = 1 + Math.random() * 0.001 - 0.0005;
        const sellPrice = Math.max(0.000001, latestPrice * (1 + minSpreadPerc) ** i * randomOffset);
        const bidPrice = Math.max(0.000001, latestPrice * (1 - minSpreadPerc) ** i * randomOffset);
        prices.push(sellPrice);
        prices.push(bidPrice);
    }
    prices.sort();
    return prices;
};
exports.default = getIdealPrices;
