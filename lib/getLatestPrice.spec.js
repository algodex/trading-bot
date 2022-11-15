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

const getLatestPrice = require("./getLatestPrice").default;

jest.mock("axios", (req) =>
  jest
    .fn((req) => {
      if (
        req.url === "https://testnet.algodex.com/algodex-backend/assets.php"
      ) {
        return {
          data: {
            ok: true,
            rows: 237,
            data: [
              {
                id: 442424,
                unix_time: 1657428189,
                price: 0.068907007455,
                priceBefore: 0.068907007455,
                price24Change: 0,
                isTraded: true,
              },
              {
                id: 3333332,
                unix_time: 1657962386,
                price: 3.061931833692,
                priceBefore: 3.08962015105,
                price24Change: -0.89617221549356,
                isTraded: true,
              },
            ],
          },
        };
      } else if (
        req.url === "https://app.algodex.com/algodex-backend/assets.php"
      ) {
        // Mainnet
        return {
          data: {
            ok: true,
            rows: 237,
            data: [
              {
                id: 333,
                unix_time: 1657428189,
                price: 0.05555,
                priceBefore: 0.068907007455,
                price24Change: 0,
                isTraded: true,
              },
              {
                id: 444,
                unix_time: 1657962386,
                price: 3.222,
                priceBefore: 3.08962015105,
                price24Change: -0.89617221549356,
                isTraded: true,
              },
            ],
          },
        };
      } else if (
        req.url ===
        "https://mainnet.analytics.tinyman.org/api/v1/current-asset-prices/"
      ) {
        // asset 0 is price of algo
        return {
          data: {
            0: { price: 2 },
            542132831: { price: 2.1e-5 },
            793124631: { price: 0.330026 },
            378382099: { price: 0.190918 },
          },
        };
      } else if (
        req.url ===
        "https://testnet.analytics.tinyman.org/api/v1/current-asset-prices/"
      ) {
        return {
          data: {
            0: { price: 2 },
            111: { price: 555 },
            233: { price: 0.777 },
            444: { price: 0.999 },
          },
        };
      }
    })
    .mockName("axios")
);

test("get latest price from algodex", async () => {
  const price = await getLatestPrice({
    assetId: 3333332,
    environment: "testnet",
    useTinyMan: false,
  });
  expect(price).toEqual(3.061931833692);
  const price2 = await getLatestPrice({
    assetId: 333,
    environment: "mainnet",
    useTinyMan: false,
  });
  expect(price2).toEqual(0.05555);
});

// test("get latest price from tinyman", async () => {
//   const price = await getLatestPrice({
//     assetId: 233,
//     environment: "testnet",
//     useTinyMan: true,
//   });
//   expect(price).toEqual(0.777 / 2);
//   const price2 = await getLatestPrice({
//     assetId: 542132831,
//     environment: "mainnet",
//     useTinyMan: true,
//   });
//   expect(price2).toEqual(2.1e-5 / 2);
// });
