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

import orderDepthAmounts from "./order-depth-amounts";
import { BotConfig } from ".././types/config";
import { EscrowToMake } from "../getEscrowsToCancelAndMake";

export interface PlaceOrderInput {
  config: BotConfig;
  createEscrowPrices: EscrowToMake[];
  decimals: number;
  latestPrice: number;
}

const placeOrders = ({
  config,
  createEscrowPrices,
  decimals,
  latestPrice,
}: PlaceOrderInput) => {
  const { assetId, orderAlgoDepth, api } = config;

  const placedOrders = createEscrowPrices.map((priceObj) => {
    //const orderDepth = orderDepthAmounts.hasOwnProperty("" + assetId)
    const orderDepth = Object.prototype.hasOwnProperty.call(
      orderDepthAmounts,
      "" + assetId
    )
      ? orderDepthAmounts["" + assetId]
      : orderAlgoDepth;
    const orderToPlace = {
      asset: {
        id: assetId, // Asset Index
        decimals: decimals, // Asset Decimals
      },
      address: api.wallet.address,
      price: priceObj.price, // Price in ALGOs
      amount: orderDepth / latestPrice, // Amount to Buy or Sell
      execution: "maker", // Type of exeuction
      type: priceObj.type, // Order Type
    };
    console.log(
      "PLACING ORDER: ",
      JSON.stringify(orderToPlace),
      ` Latest Price: ${latestPrice}`
    );
    const orderPromise = api.placeOrder(orderToPlace);
    return orderPromise;
  });
  return placedOrders;
};

export default placeOrders;
