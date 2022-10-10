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

const {
  cancelOrders,
  convertCancelResultsToDBPromises,
} = require("./cancelOrders");

const escrowDB = {
  remove: jest.fn((doc) => new Promise((resolve) => resolve("done"))),
};

const orders = {
  rows: [
    {
      doc: {
        order: {
          escrowAddr: "algorandaddr1",
        },
      },
    },
  ],
};

test("converts cancel results", () => {
  const results = [[{ escrowAddr: "algorandaddr1" }]];

  convertCancelResultsToDBPromises(escrowDB, results, orders);
  expect(escrowDB.remove.mock.calls.length).toBe(1);
  const mockResults = escrowDB.remove.mock.calls[0][0];
  expect(JSON.stringify(mockResults)).toBe(
    JSON.stringify({ order: results[0][0] })
  );
});

test("executes promises", async () => {
  const promiseResults = [[{ escrowAddr: "algorandaddr1" }]];

  const results = await cancelOrders(escrowDB, orders, [
    new Promise((resolve) => resolve(promiseResults[0])),
  ]);
  expect(results[0]).toBe("done");
});
