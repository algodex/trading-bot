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

import getCancelPromises from "./getCancelPromises";
import { cancelOrders } from "./cancelOrders";
import { BotConfig } from "./types/config";
import { AllDocsResult } from "./types/order";
import { EscrowToCancel } from "./getEscrowsToCancelAndMake";

interface CancelOrdersAndUpdateDB {
  config: BotConfig;
  cancelSet: Set<string>;
  latestPrice: number;
  currentEscrows: AllDocsResult;
}
const cancelOrdersAndUpdateDB = async ({
  config,
  cancelSet,
  latestPrice,
  currentEscrows,
}: CancelOrdersAndUpdateDB) => {
  const { escrowDB, api } = config;

  const cancelPromises = await getCancelPromises({
    escrows: currentEscrows,
    cancelSet,
    api,
    latestPrice,
  });
  await cancelOrders(escrowDB, currentEscrows, cancelPromises);
};

export default cancelOrdersAndUpdateDB;
