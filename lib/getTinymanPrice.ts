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
import { getAccountInfo } from "./helper";

const getTinymanPrice = async (
  assetId: number,
  environment: Environment,
  assetDecimals: number,
  poolInfoAddr: string
): Promise<number> => {
  if (poolInfoAddr) {
    const accountInfo = await getAccountInfo(poolInfoAddr, environment);
    if (accountInfo.data) {
      const { amount: algo, assets } = accountInfo.data;
      const assetAmount =
        assets.find(
          (asset: { [x: string]: any }) => asset["asset-id"] === assetId
        )?.amount || 0;
      if (algo > 0 && assetAmount > 0) {
        const latestPrice = algo / assetAmount / 10 ** (6 - assetDecimals);
        return latestPrice;
      } else {
        return 0;
      }
    }
    return 0;
  }
  return 0;
};

export default getTinymanPrice;
