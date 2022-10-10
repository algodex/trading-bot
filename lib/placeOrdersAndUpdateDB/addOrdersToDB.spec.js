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

const addOrdersToDB = require("./addOrdersToDB").default;
jest.mock("../convertToDBObject", () => ({
  default: jest.fn((order) => {
    return order;
  }),
}));
const convertToDBObject = require("../convertToDBObject").default;

const escrowDB = {
  put: jest.fn((doc) => new Promise((resolve) => resolve("addedToDB"))),
};

const validResults = [
  [{ contract: { amount: 50 } }],
  [{ contract: { amount: 20 } }],
];

test("correctly trying to add orders to DB", async () => {
  const results = await addOrdersToDB(escrowDB, validResults);
  expect(results[0] === "addedToDB" && results[1] === "addedToDB");
  const mocked = convertToDBObject.mock;
  const expectedCall0 = { contract: { amount: 50 } };
  const expectedCall1 = { contract: { amount: 20 } };
  expect(mocked.calls[0][0]).toEqual(expectedCall0);
  expect(mocked.calls[1][0]).toEqual(expectedCall1);

  console.log({ convertToDBObject });
});
