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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const getEscrowsToCancelAndMake_1 = require("./getEscrowsToCancelAndMake");
const getIdealPrices_1 = __importDefault(require("./getIdealPrices"));
const getPlannedOrderChanges = ({ config, currentEscrows, latestPrice, }) => {
    const { minSpreadPerc, nearestNeighborKeep, ladderTiers } = config;
    const idealPrices = (0, getIdealPrices_1.default)(ladderTiers, latestPrice, minSpreadPerc);
    const { createEscrowPrices, cancelEscrowAddrs } = (0, getEscrowsToCancelAndMake_1.getEscrowsToCancelAndMake)({
        escrows: currentEscrows.rows,
        latestPrice,
        minSpreadPerc,
        nearestNeighborKeep,
        idealPrices,
    });
    const cancelSet = new Set(cancelEscrowAddrs);
    return { createEscrowPrices, cancelSet };
};
exports.default = getPlannedOrderChanges;
