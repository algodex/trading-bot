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

import getLatestPrice from "./getLatestPrice";
import initWallet from "./initWallet";
import getAssetInfo from "./getAssetInfo";
import getCurrentOrders from "./getCurrentOrders";
import getOpenAccountSetFromAlgodex from "./getOpenAccountSetFromAlgodex";
import { BotConfig } from "./types/config";
import { AllDocsResult } from "./types/order";

export interface CurrentState {
  latestPrice: number;
  currentEscrows: AllDocsResult;
  decimals: number;
  assetInfo: any;
  openAccountSet: Set<string>;
}

const getCurrentState = async (
  config: BotConfig,
  assetInfo: any
): Promise<CurrentState> => {
  const {
    assetId,
    walletAddr,
    escrowDB,
    useTinyMan,
    api,
    environment,
    mnemonic,
  } = config;

  const openAccountSet = await getOpenAccountSetFromAlgodex(
    environment,
    walletAddr,
    assetId
  );
  if (!api.wallet) {
    await initWallet(api, walletAddr, mnemonic);
  }
  if (!assetInfo) {
    assetInfo = await getAssetInfo({ indexerClient: api.indexer, assetId });
  }
  const decimals = assetInfo.asset.params.decimals;

  const currentEscrows = await getCurrentOrders(
    escrowDB,
    api.indexer,
    openAccountSet,
    environment
  );

  const latestPrice = await getLatestPrice(assetId, environment, useTinyMan);
  return { latestPrice, currentEscrows, decimals, assetInfo, openAccountSet };
};

export default getCurrentState;
