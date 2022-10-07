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

const getCancelPromises = require("./getCancelPromises").default;
// const {LogicSigAccount} = require('algosdk');

jest.mock("algosdk", () => {
  const originalModule = jest.requireActual("algosdk");
  return {
    ...originalModule,
    LogicSigAccount: jest.fn((data) => "some data").mockName("LogicSigAccount"),
  };
});

const orders = {
  rows: [
    {
      doc: {
        order: {
          escrowAddr: "algorand_address_here",
          contract: { data: { data: [0, 3, 5, 7] } },
        },
      },
    },
  ],
};

const api = {
  algod: "algodObjHere",
  wallet: "my_algorand_wallet_here",
  closeOrder: jest.fn((order) => "good result"),
};

test("Can get cancel promises", async () => {
  const input = {
    escrows: orders,
    cancelSet: new Set(["algorand_address_here"]),
    api,
    latestPrice: 155,
  };
  const promises = await getCancelPromises(input);
  const goodResultObj = {
    escrowAddr: "algorand_address_here",
    contract: {
      data: {
        data: [0, 3, 5, 7],
      },
      lsig: {},
    },
    client: "algodObjHere",
    wallet: "my_algorand_wallet_here",
  };

  expect(promises).toEqual(["good result"]);
  expect(api.closeOrder.mock.calls[0][0]).toEqual(goodResultObj);
});
