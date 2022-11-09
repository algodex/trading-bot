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
import * as events from "../events";
import { stopLoop } from "../runLoop";

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

  const placedOrders = createEscrowPrices.map(async (priceObj) => {
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
      wallet: api.wallet,
      price: priceObj.price, // Price in ALGOs
      amount: orderDepth / latestPrice, // Amount to Buy or Sell
      execution: "maker", // Type of exeuction
      type: priceObj.type, // Order Type
    };
    const orderTodisplay = { ...orderToPlace };
    delete orderTodisplay.wallet;
    console.log(
      "PLACING ORDER: ",
      JSON.stringify(orderTodisplay),
      ` Latest Price: ${latestPrice}`
    );
    events.emit("running-bot", {
      status: "PLACING ORDER",
      content: `Placing ${
        orderTodisplay.type
      } Order for asset: ${JSON.stringify(
        orderTodisplay
      )},\n Latest Price: ${latestPrice}`,
    });
    try {
      const orderPromise = await api.placeOrder(
        orderToPlace,
        { wallet: api.wallet },
        notifyStatus
      );
      console.log({ orderPromise });
      return orderPromise;
    } catch (error) {
      console.log("show error here", error);
      // stopLoop({ config });
    }
  });
  return placedOrders;
};

export default placeOrders;

const notifyStatus = (status: any) => {
  console.log("show status here", status);
};
