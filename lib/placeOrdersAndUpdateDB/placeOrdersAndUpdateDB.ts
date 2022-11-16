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

import waitForOrders from "./waitForOrders";
import placeOrders from "./placeOrders";
import addOrdersToDB from "./addOrdersToDB";
import { BotConfig } from ".././types/config";
import { EscrowToMake } from "../getEscrowsToCancelAndMake";

export interface PlaceOrdersAndUpdateDBInput {
  config: BotConfig;
  createEscrowPrices: EscrowToMake[];
  decimals: number;
  latestPrice: number;
  exitLoop: boolean;
}
const placeOrdersAndUpdateDB = async ({
  config,
  createEscrowPrices,
  decimals,
  latestPrice,
  exitLoop,
}: PlaceOrdersAndUpdateDBInput) => {
  if (!exitLoop) {
    const ordersToPlace = placeOrders({
      config,
      createEscrowPrices,
      decimals,
      latestPrice,
    });
    const { validResults } = await waitForOrders(ordersToPlace);

    await addOrdersToDB(config.escrowDB, validResults, config.environment);
  }
};

export default placeOrdersAndUpdateDB;
