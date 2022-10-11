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
const sleep_1 = __importDefault(require("./sleep"));
const placeOrdersAndUpdateDB_1 = __importDefault(require("./placeOrdersAndUpdateDB"));
const getCurrentState_1 = __importDefault(require("./getCurrentState"));
const getPlannedOrderChanges_1 = __importDefault(require("./getPlannedOrderChanges"));
const cancelOrdersAndUpdateDB_1 = __importDefault(require("./cancelOrdersAndUpdateDB"));
const runLoop = async ({ assetInfo, config, lastBlock, runState }) => {
    // const {assetId, walletAddr, minSpreadPerc, nearestNeighborKeep,
    //   escrowDB, ladderTiers, useTinyMan, api,
    // environment, orderAlgoDepth} = config;
    // Note - during jest testing, runState is a Proxy
    if (runState.isExiting) {
        console.log("Exiting!");
        return;
    }
    runState.inRunLoop = true;
    const currentState = await (0, getCurrentState_1.default)(config, assetInfo);
    const { latestPrice, currentEscrows, decimals } = currentState;
    if (!assetInfo) {
        assetInfo = currentState.assetInfo;
    }
    if (latestPrice === undefined || latestPrice === 0) {
        runState.inRunLoop = false;
        await (0, sleep_1.default)(1000);
        runLoop({ assetInfo, config, lastBlock, runState });
        return;
    }
    const { createEscrowPrices, cancelSet } = (0, getPlannedOrderChanges_1.default)({
        config,
        currentEscrows,
        latestPrice,
    });
    await (0, cancelOrdersAndUpdateDB_1.default)({
        config,
        cancelSet,
        latestPrice,
        currentEscrows,
    });
    await (0, placeOrdersAndUpdateDB_1.default)({
        config,
        createEscrowPrices,
        decimals,
        latestPrice,
    });
    runState.inRunLoop = false;
    await (0, sleep_1.default)(1000);
    runLoop({ assetInfo, config, lastBlock, runState });
};
exports.default = runLoop;
