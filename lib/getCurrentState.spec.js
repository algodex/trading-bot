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

const getCurrentState = require("./getCurrentState").default;

const assetInfo = { asset: { params: { decimals: 6 } } };

jest.mock("./getLatestPrice", () => ({
  default: jest.fn(
    () => new Promise((resolve) => resolve("latestPriceResult"))
  ),
}));
jest.mock("./initWallet", () => ({
  default: jest.fn(() => new Promise((resolve) => resolve("completed"))),
}));
jest.mock("./getAssetInfo", () => ({
  default: jest.fn(() => new Promise((resolve) => resolve(assetInfo))),
}));
jest.mock("./getCurrentOrders", () => ({
  default: jest.fn(
    () => new Promise((resolve) => resolve("currentEscrowsResult"))
  ),
}));
jest.mock("./getOpenAccountSetFromAlgodex", () => ({
  default: jest.fn(() => new Promise((resolve) => resolve("openAccountSet"))),
}));

const getLatestPrice = require("./getLatestPrice").default;
const initWallet = require("./initWallet").default;
const getAssetInfo = require("./getAssetInfo").default;
const getCurrentOrders = require("./getCurrentOrders").default;
const getOpenAccountSetFromAlgodex =
  require("./getOpenAccountSetFromAlgodex").default;

test("Calls all state initialization functions", async () => {
  const config = {
    assetId: 5555,
    walletAddr: "my wallet address",
    escrowDB: "escrow DB object",
    useTinyMan: true,
    api: { indexer: "algorand indexer obj" },
    environment: "testnet",
  };

  const state = await getCurrentState(config, null);
  const getLatestPriceMock = getLatestPrice.mock;
  const initWalletMock = initWallet.mock;
  const getAssetInfoMock = getAssetInfo.mock;
  const getCurrentOrdersMock = getCurrentOrders.mock;
  const getOpenAccountSetFromAlgodexMock = getOpenAccountSetFromAlgodex.mock;

  expect(getLatestPriceMock.calls).toEqual([[5555, "testnet", true]]);
  expect(initWalletMock.calls).toEqual([
    [{ indexer: "algorand indexer obj" }, "my wallet address"],
  ]);
  expect(getAssetInfoMock.calls).toEqual([
    [{ indexerClient: "algorand indexer obj", assetId: 5555 }],
  ]);
  expect(getCurrentOrdersMock.calls).toEqual([
    ["escrow DB object", "algorand indexer obj", "openAccountSet", "testnet"],
  ]);
  expect(getOpenAccountSetFromAlgodexMock.calls).toEqual([
    ["testnet", "my wallet address", 5555],
  ]);
  expect(state).toEqual({
    latestPrice: "latestPriceResult",
    currentEscrows: "currentEscrowsResult",
    decimals: 6,
    assetInfo: { asset: { params: { decimals: 6 } } },
    openAccountSet: "openAccountSet",
  });
  return;
});
