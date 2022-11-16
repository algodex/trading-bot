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

/* eslint-disable camelcase */

jest.mock("./sleep", () => ({
  default: jest.fn(() => {
    return new Promise((resolve) => resolve("did sleep"));
  }),
}));
jest.mock("./placeOrdersAndUpdateDB", () => ({
  default: jest.fn(() => {
    return new Promise((resolve) => resolve("did placeOrdersAndUpdateDB"));
  }),
}));
jest.mock("./getCurrentState", () => ({
  default: jest.fn(() => {
    return new Promise((resolve) => resolve(globalThis.currentState));
  }),
}));
jest.mock("./getPlannedOrderChanges", () => ({
  default: jest.fn(() => {
    return new Promise((resolve) => resolve(globalThis.plannedOrderChanges));
  }),
}));
jest.mock("./cancelOrdersAndUpdateDB", () => ({
  default: jest.fn(() => {
    return new Promise((resolve) => resolve("did cancelOrdersAndUpdateDB"));
  }),
}));

const runLoop = require("./runLoop").default;

const sleep = require("./sleep").default;
const placeOrdersAndUpdateDB = require("./placeOrdersAndUpdateDB").default;
const getCurrentState = require("./getCurrentState").default;
const getPlannedOrderChanges = require("./getPlannedOrderChanges").default;
const cancelOrdersAndUpdateDB = require("./cancelOrdersAndUpdateDB").default;
globalThis.currentState = {
  latestPrice: 5,
  currentEscrows: ["escrowobj1", "escrowobj2"],
  decimals: 6,
};
globalThis.plannedOrderChanges = {
  createEscrowPrices: [4, 4.5, 5, 5.5],
  cancelSet: new Set(["escrowAddr1"]),
};

describe("runLoop tests", () => {
  afterEach(() => {
    globalThis.currentState = {};
    globalThis.plannedOrderChanges = {};
    jest.clearAllMocks();
  });
  test("did run loop", async () => {
    const assetInfo = null;
    const config = "configObj";
    const lastBlock = null;

    // Spy on run loop and stop it after first iteration
    const validator = {
      set: (target, key, value) => {
        if (
          target.inRunLoop === true &&
          key === "inRunLoop" &&
          value === false
        ) {
          target.isExiting = true;
        }
        target[key] = value;
        return true;
      },
    };
    const runState = new Proxy(
      { inRunLoop: false, isExiting: false },
      validator
    );
    await runLoop({ assetInfo, config, lastBlock, runState });
    const sleep_mock = sleep.mock;
    const placeOrdersAndUpdateDB_mock = placeOrdersAndUpdateDB.mock;
    const getCurrentState_mock = getCurrentState.mock;
    const getPlannedOrderChanges_mock = getPlannedOrderChanges.mock;
    const cancelOrdersAndUpdateDB_mock = cancelOrdersAndUpdateDB.mock;

    expect(sleep_mock.calls).toEqual([[1000]]);
    expect(placeOrdersAndUpdateDB_mock.calls).toEqual([
      [{ config: "configObj", decimals: 6, latestPrice: 5, exitLoop:false }],
    ]);
    expect(getCurrentState_mock.calls).toEqual([["configObj", null]]);
    expect(getPlannedOrderChanges_mock.calls).toEqual([
      [
        {
          config: "configObj",
          currentEscrows: ["escrowobj1", "escrowobj2"],
          latestPrice: 5,
        },
      ],
    ]);
    expect(cancelOrdersAndUpdateDB_mock.calls).toEqual([
      [
        {
          config: "configObj",
          latestPrice: 5,
          currentEscrows: ["escrowobj1", "escrowobj2"],
        },
      ],
    ]);
    return;
  });

  test("exits early when cant get state", async () => {
    const assetInfo = null;
    const config = "configObj";
    const lastBlock = null;

    // Spy on run loop and stop it after first iteration
    const validator = {
      set: (target, key, value) => {
        if (
          target.inRunLoop === true &&
          key === "inRunLoop" &&
          value === false
        ) {
          target.isExiting = true;
        }
        target[key] = value;
        return true;
      },
    };
    const runState = new Proxy(
      { inRunLoop: false, isExiting: false },
      validator
    );
    await runLoop({ assetInfo, config, lastBlock, runState });
    const sleep_mock = sleep.mock;
    const placeOrdersAndUpdateDB_mock = placeOrdersAndUpdateDB.mock;
    const getCurrentState_mock = getCurrentState.mock;
    const getPlannedOrderChanges_mock = getPlannedOrderChanges.mock;
    const cancelOrdersAndUpdateDB_mock = cancelOrdersAndUpdateDB.mock;

    expect(sleep_mock.calls).toEqual([[1000]]);
    expect(placeOrdersAndUpdateDB_mock.calls).toEqual([]);
    expect(getCurrentState_mock.calls).toEqual([["configObj", null, ""]]);
    expect(getPlannedOrderChanges_mock.calls).toEqual([]);
    expect(cancelOrdersAndUpdateDB_mock.calls).toEqual([]);
    return;
  });
});
