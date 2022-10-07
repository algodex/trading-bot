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

const getIdealPrices = require("./getIdealPrices").default;

test("verify ideal prices are fine", () => {
  const latestPrice = 12.5;
  const prices = getIdealPrices(5, latestPrice, 0.0035);
  expect(prices.length === 10);
  const pricesLessThanLatest = prices.filter((price) => price < latestPrice);
  const pricesGreaterThanLatest = prices.filter((price) => price > latestPrice);
  expect(pricesLessThanLatest.length === 5);
  expect(pricesGreaterThanLatest.length === 5);
  const lowestAsk = prices
    .filter((price) => price > latestPrice)
    .reduce((lowest, price) => Math.min(lowest, price), 99999);
  const highestBid = prices
    .filter((price) => price < latestPrice)
    .reduce((highest, price) => Math.max(highest, price), 0);

  expect(highestBid).toBeLessThanOrEqual(latestPrice * (1 - 0.0035) * 1.0005);
  expect(highestBid).toBeGreaterThanOrEqual(
    latestPrice * (1 - 0.0035) * 0.9995
  );
  expect(lowestAsk).toBeGreaterThanOrEqual(latestPrice * (1 + 0.0035) * 0.9995);
  expect(lowestAsk).toBeLessThanOrEqual(latestPrice * (1 + 0.0035) * 1.0005);
});
