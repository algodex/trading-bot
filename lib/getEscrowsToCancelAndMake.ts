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

import { Order, OrderDoc } from "./types/order";

export type OrderType = "buy" | "sell";

export interface EscrowToMake {
  price: number;
  type: OrderType;
}

export interface EscrowToCancel {
  price: number;
  type: OrderType;
  address: string;
}

export interface EscrowsToCancelAndMake {
  createEscrowPrices: Array<EscrowToMake>;
  cancelEscrowAddrs: Array<string>;
}

export interface GetEscrowsToCancelAndMakeInput {
  escrows: OrderDoc[];
  latestPrice: number;
  minSpreadPerc: number;
  nearestNeighborKeep: number;
  idealPrices: number[];
}

export const getEscrowsToCancelAndMake = ({
  escrows,
  latestPrice,
  minSpreadPerc,
  nearestNeighborKeep,
  idealPrices,
}: GetEscrowsToCancelAndMakeInput): EscrowsToCancelAndMake => {
  const bidCancelPoint = latestPrice * (1 - minSpreadPerc);
  const askCancelPoint = latestPrice * (1 + minSpreadPerc);
  const escrowsTemp = escrows.map((escrow) => {
    return {
      price: escrow.doc.order.price,
      type: escrow.doc.order.type,
      address: escrow.doc._id,
    };
  });
  const cancelEscrowAddrs: Array<string> = escrowsTemp
    .filter((escrow) => {
      if (
        escrow.price > bidCancelPoint * (1 + 0.000501) &&
        escrow.type === "buy"
      ) {
        return true;
      } else if (
        escrow.price < askCancelPoint * (1 - 0.000501) &&
        escrow.type === "sell"
      ) {
        return true;
      }
      if (
        idealPrices.find(
          (idealPrice) =>
            Math.abs((idealPrice - escrow.price) / escrow.price) <
            nearestNeighborKeep
        )
      ) {
        return false;
      }
      return true;
    })
    .map((escrow) => escrow.address);
  const cancelAddrSet = new Set(cancelEscrowAddrs);
  const remainingEscrows = escrowsTemp.filter(
    (escrow) => !cancelAddrSet.has(escrow.address)
  );

  const createEscrowPrices: Array<EscrowToMake> = idealPrices
    .filter((idealPrice) => {
      if (
        remainingEscrows.find(
          (escrow) =>
            Math.abs((idealPrice - escrow.price) / escrow.price) <
            nearestNeighborKeep
        )
      ) {
        return false;
      }
      return true;
    })
    .map((price) => {
      return {
        price,
        type: price < latestPrice ? "buy" : "sell",
      };
    });
  return { createEscrowPrices, cancelEscrowAddrs };
};
