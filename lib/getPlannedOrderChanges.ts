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

import {
  getEscrowsToCancelAndMake,
  // EscrowToCancel,
  EscrowToMake,
} from "./getEscrowsToCancelAndMake";
import getIdealPrices from "./getIdealPrices";
import { BotConfig } from "./types/config";
import { AllDocsResult } from "./types/order";

export interface PlannedOrderChangesInput {
  config: BotConfig;
  currentEscrows: AllDocsResult;
  latestPrice: number;
}

export interface PlannedOrderChanges {
  createEscrowPrices: EscrowToMake[];
  cancelSet: Set<string>;
}

const getPlannedOrderChanges = ({
  config,
  currentEscrows,
  latestPrice,
}: PlannedOrderChangesInput): PlannedOrderChanges => {
  const { minSpreadPerc, nearestNeighborKeep, ladderTiers } = config;

  const idealPrices = getIdealPrices(ladderTiers, latestPrice, minSpreadPerc);
  const { createEscrowPrices, cancelEscrowAddrs } = getEscrowsToCancelAndMake({
    escrows: currentEscrows.rows,
    latestPrice,
    minSpreadPerc,
    nearestNeighborKeep,
    idealPrices,
  });
  const cancelSet = new Set(cancelEscrowAddrs);

  return { createEscrowPrices, cancelSet };
};

export default getPlannedOrderChanges;
