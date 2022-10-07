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

const getPlannedOrderChanges = require("./getPlannedOrderChanges").default;
// const withDefault = require('./js-util/withDefault');

jest.mock("./getEscrowsToCancelAndMake", () => {
  return {
    getEscrowsToCancelAndMake: jest.fn(() => {
      return {
        createEscrowPrices: [44.1, 44.2, 44.3],
        cancelEscrowAddrs: ["algorand addr1"],
      };
    }),
  };
});
jest.mock("./getIdealPrices", () => {
  return {
    default: jest.fn(() => {
      return [44.1, 44.2, 44.3, 44.4];
    }),
  };
});

const { getEscrowsToCancelAndMake } = require("./getEscrowsToCancelAndMake");
const getIdealPrices = require("./getIdealPrices").default;

test("Can get planned order changes", () => {
  const config = {
    minSpreadPerc: 0.0035,
    nearestNeighborKeep: 0.0025,
    ladderTiers: 4,
  };
  const currentEscrows = { rows: ["escrow_addr_1", "escrow_addr_2"] };
  const latestPrice = 44.25;

  const { createEscrowPrices, cancelSet } = getPlannedOrderChanges({
    config,
    currentEscrows,
    latestPrice,
  });
  expect(Array.from(cancelSet)).toEqual(["algorand addr1"]);
  expect(createEscrowPrices).toEqual([44.1, 44.2, 44.3]);
  const getIdealPricesMock = getIdealPrices.mock;
  const getEscrowsToCancelAndMakeMock = getEscrowsToCancelAndMake.mock;
  expect(getIdealPricesMock.calls).toEqual([[4, 44.25, 0.0035]]);
  expect(getEscrowsToCancelAndMakeMock.calls).toEqual([
    [
      {
        escrows: ["escrow_addr_1", "escrow_addr_2"],
        latestPrice: 44.25,
        minSpreadPerc: 0.0035,
        nearestNeighborKeep: 0.0025,
        idealPrices: [44.1, 44.2, 44.3, 44.4],
      },
    ],
  ]);
});
