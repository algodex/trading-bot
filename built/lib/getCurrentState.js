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
const getLatestPrice_1 = __importDefault(require("./getLatestPrice"));
const initWallet_1 = __importDefault(require("./initWallet"));
const getAssetInfo_1 = __importDefault(require("./getAssetInfo"));
const getCurrentOrders_1 = __importDefault(require("./getCurrentOrders"));
const getOpenAccountSetFromAlgodex_1 = __importDefault(require("./getOpenAccountSetFromAlgodex"));
const getCurrentState = async (config, assetInfo) => {
    const { assetId, walletAddr, escrowDB, useTinyMan, api, environment, mnemonic } = config;
    const openAccountSet = await (0, getOpenAccountSetFromAlgodex_1.default)(environment, walletAddr, assetId);
    if (!api.wallet) {
        await (0, initWallet_1.default)(api, walletAddr, mnemonic);
    }
    if (!assetInfo) {
        assetInfo = await (0, getAssetInfo_1.default)({ indexerClient: api.indexer, assetId });
    }
    const decimals = assetInfo.asset.params.decimals;
    const currentEscrows = await (0, getCurrentOrders_1.default)(escrowDB, api.indexer, openAccountSet);
    const latestPrice = await (0, getLatestPrice_1.default)(assetId, environment, useTinyMan);
    return { latestPrice, currentEscrows, decimals, assetInfo, openAccountSet };
};
exports.default = getCurrentState;
