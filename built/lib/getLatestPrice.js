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
const getTinymanPrice_1 = __importDefault(require("./getTinymanPrice"));
const axios = require("axios");
const getLatestPrice = async (assetId, environment, useTinyMan = false) => {
    if (String(useTinyMan) === "true") {
        return await (0, getTinymanPrice_1.default)(assetId, environment);
    }
    const ordersURL = environment === "testnet"
        ? "https://testnet.algodex.com/algodex-backend/assets.php"
        : "https://app.algodex.com/algodex-backend/assets.php";
    const assetData = await axios({
        method: "get",
        url: ordersURL,
        responseType: "json",
        timeout: 10000,
    });
    const assets = assetData.data.data;
    const latestPrice = assets.find((asset) => asset.id == assetId).price;
    return latestPrice;
};
exports.default = getLatestPrice;
