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

const waitForOrders = require("./waitForOrders").default;

test("Can wait for orders", async () => {
  const ordersToPlace = [
    new Promise((resolve, reject) => {
      resolve("order placed");
    }),
    new Promise((resolve, reject) => {
      resolve("order placed");
    }),
    new Promise((resolve, reject) => {
      reject(new Error("could not place order"));
    }),
  ];
  const { validResults, invalidResults } = await waitForOrders(ordersToPlace);
  expect(validResults).toEqual(["order placed", "order placed"]);
  expect(invalidResults.length).toBe(1);
  // expect(invalidResults).toEqual(
  return;
});
