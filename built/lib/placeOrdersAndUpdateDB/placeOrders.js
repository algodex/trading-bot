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
const order_depth_amounts_1 = __importDefault(require("./order-depth-amounts"));
const placeOrders = ({ config, createEscrowPrices, decimals, latestPrice, }) => {
    const { assetId, orderAlgoDepth, api } = config;
    const placedOrders = createEscrowPrices.map((priceObj) => {
        const orderDepth = order_depth_amounts_1.default.hasOwnProperty("" + assetId)
            ? order_depth_amounts_1.default["" + assetId]
            : orderAlgoDepth;
        const orderToPlace = {
            asset: {
                id: assetId,
                decimals: decimals, // Asset Decimals
            },
            address: api.wallet.address,
            price: priceObj.price,
            amount: orderDepth / latestPrice,
            execution: "maker",
            type: priceObj.type, // Order Type
        };
        console.log("PLACING ORDER: ", JSON.stringify(orderToPlace), ` Latest Price: ${latestPrice}`);
        const orderPromise = api.placeOrder(orderToPlace);
        return orderPromise;
    });
    return placedOrders;
};
exports.default = placeOrders;
