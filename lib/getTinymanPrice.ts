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

const axios = require("axios");

const getTinymanPrice = async (
  assetId: number,
  environment: string
): Promise<number> => {
  const tinymanPriceURL =
    environment === "mainnet"
      ? "https://mainnet.analytics.tinyman.org/api/v1/current-asset-prices/"
      : "https://testnet.analytics.tinyman.org/api/v1/current-asset-prices/";

  const assetData = await axios({
    method: "get",
    url: tinymanPriceURL,
    responseType: "json",
    timeout: 10000,
  });
  const algoPrice = assetData.data[0].price;
  console.log(assetData.data[assetId])
  console.log(assetData.data)
  const latestPrice = assetData.data[assetId].price / algoPrice;
  return latestPrice;
};

export default getTinymanPrice;
