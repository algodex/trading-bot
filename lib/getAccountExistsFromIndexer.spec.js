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

const getAccountExistsFromIndexer =
  require("./getAccountExistsFromIndexer").default;

const accountInfo = { account: { amount: 4000 } };

const mockIndexer = {
  lookupAccountByID: jest.fn((account) => {
    return {
      do: () =>
        new Promise((resolve, reject) => {
          if (
            account ===
            "OB2NWBH76FWNQ4IXSMESOK3MIELNJR7U7IUZNUOHKRYSDSMFI4WUDDAQ6Q"
          ) {
            resolve(accountInfo);
          } else {
            reject(new Error("account does not exist"));
          }
        }),
    };
  }),
};

test("gets account that exists", async () => {
  // const accountInfo = await indexer.lookupAccountByID('asdsadas').do();
  const accountInfoFromIndexer =
    // eslint-disable-next-line max-len
    await getAccountExistsFromIndexer(
      "OB2NWBH76FWNQ4IXSMESOK3MIELNJR7U7IUZNUOHKRYSDSMFI4WUDDAQ6Q",
      mockIndexer
    );
  expect(accountInfoFromIndexer).toBe(true);
  expect(mockIndexer.lookupAccountByID.mock.calls[0][0]).toBe(
    "OB2NWBH76FWNQ4IXSMESOK3MIELNJR7U7IUZNUOHKRYSDSMFI4WUDDAQ6Q"
  );
});

test("gets account that doesnt exist", async () => {
  // const accountInfo = await indexer.lookupAccountByID('asdsadas').do();
  const accountInfoFromIndexer = await getAccountExistsFromIndexer(
    "wrongaccount",
    mockIndexer
  );
  expect(accountInfoFromIndexer).toBe(false);
  const lastCall = mockIndexer.lookupAccountByID.mock.calls.length - 1;
  expect(mockIndexer.lookupAccountByID.mock.calls[lastCall][0]).toBe(
    "wrongaccount"
  );
});
