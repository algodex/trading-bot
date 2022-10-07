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

const getAssetInfo = require("./getAssetInfo").default;

const assetInfo = { assetInfo: "someInfo" };

const mockIndexer = {
  lookupAssetByID: jest.fn((account) => {
    return { do: () => new Promise((resolve) => resolve(assetInfo)) };
  }),
};

test("gets assetInfo", async () => {
  // const accountInfo = await indexer.lookupAccountByID('asdsadas').do();
  const assetInfoFromIndexer = await getAssetInfo({
    assetId: 111,
    indexerClient: mockIndexer,
  });
  expect(assetInfoFromIndexer.assetInfo).toBe("someInfo");
  expect(mockIndexer.lookupAssetByID.mock.calls[0][0]).toBe(111);
});
