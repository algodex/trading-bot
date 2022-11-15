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

import { Environment } from "./types/config";
import getTinymanPrice from "./getTinymanPrice";
import { getTinymanPoolInfo } from "./getTinyman";
const axios = require("axios");

const getLatestPrice = async ({
  assetId,
  environment,
  useTinyMan = false,
  decimals,
  poolInfoAddr,
}: {
  assetId: number;
  environment: Environment;
  useTinyMan: boolean;
  decimals: number;
  poolInfoAddr?: string;
}): Promise<number> => {
  if (String(useTinyMan) === "true") {
    if (!poolInfoAddr) {
      const poolInfo = await getTinymanPoolInfo(environment, assetId, 6);
      poolInfoAddr = poolInfo?.addr;
    }

    return await getTinymanPrice(assetId, environment, decimals, poolInfoAddr);
  }
  const ordersURL =
    environment === "testnet"
      ? "https://testnet.algodex.com/algodex-backend/assets.php"
      : "https://app.algodex.com/algodex-backend/assets.php";

  const assetData = await axios({
    method: "get",
    url: ordersURL,
    responseType: "json",
    timeout: 10000,
  });
  const assets = assetData.data.data;
  const latestPrice = assets.find((asset: any) => asset.id === assetId).price;
  return latestPrice;
};

export default getLatestPrice;
