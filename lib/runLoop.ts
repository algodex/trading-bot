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

import sleep from "./sleep";
import placeOrdersAndUpdateDB from "./placeOrdersAndUpdateDB";
import getCurrentState from "./getCurrentState";
import getPlannedOrderChanges from "./getPlannedOrderChanges";
import cancelOrdersAndUpdateDB from "./cancelOrdersAndUpdateDB";
import { BotConfig } from "./types/config";
import { RunState } from "./types/order";
import getOpenAccountSetFromAlgodex from "./getOpenAccountSetFromAlgodex";
import getCurrentOrders from "./getCurrentOrders";
import getCancelPromises from "./getCancelPromises";
import { cancelOrders } from "./cancelOrders";
import * as events from "./events";
import { getTinymanPoolInfo } from "./getTinyman";
import getAssetInfo from "./getAssetInfo";

export interface RunLoopInput {
  assetInfo: any;
  config: BotConfig;
  lastBlock: number;
  runState: RunState;
  //   runState: CurrentState;
}

let exitLoop = false;
let poolInfoAddr: string;

const runLoop = async ({
  assetInfo,
  config,
  lastBlock,
  runState,
}: RunLoopInput) => {
  // const {assetId, walletAddr, minSpreadPerc, nearestNeighborKeep,
  //   escrowDB, ladderTiers, useTinyMan, api,
  // environment, orderAlgoDepth} = config;

  if (!poolInfoAddr && !exitLoop && config.api) {
    try {
      assetInfo = await getAssetInfo({
        indexerClient: config.api.indexer,
        assetId: config.assetId,
      });
      
      const poolInfo = await getTinymanPoolInfo(
        config.environment,
        config.assetId,
        assetInfo.asset.params.decimals
        );
        
        if (poolInfo) {
          poolInfoAddr = poolInfo?.addr;
        } else {
          stopLoop({ config });
          return;
        }
      } catch (error) {
      console.error(error);
    }
  }

  // Note - during jest testing, runState is a Proxy
  if (runState.isExiting || exitLoop) {
    poolInfoAddr = "";
    console.log("Exiting!");
    return;
  }
  runState.inRunLoop = true;

  const currentState = await getCurrentState(config, assetInfo, poolInfoAddr);
  const { latestPrice, currentEscrows, decimals } = currentState;
  if (!assetInfo) {
    assetInfo = currentState.assetInfo;
  }
  console.debug({ latestPrice });

  if (latestPrice === undefined || latestPrice === 0) {
    runState.inRunLoop = false;
    await sleep(1000);
    runLoop({ assetInfo, config, lastBlock, runState });
    return;
  }

  const { createEscrowPrices, cancelSet } = getPlannedOrderChanges({
    config,
    currentEscrows,
    latestPrice,
  });

  await cancelOrdersAndUpdateDB({
    config,
    cancelSet,
    latestPrice,
    currentEscrows,
  });
  if (createEscrowPrices && createEscrowPrices.length > 0) {
    events.emit("running-bot", {
      status: "Trying to place order...",
    });
  }
  if (createEscrowPrices && createEscrowPrices.length === 0) {
    events.emit("running-bot", {
      status: "Maintaining order while waiting for a price change...",
    });
  }
  events.on(
    "current-balance",
    ({
      walletBalance,
    }: {
      walletBalance: {
        algo: number;
        asa: number;
        assetId: number;
        currentDepth: number;
      };
    }) => {
      if (
        walletBalance.assetId === config.assetId &&
        walletBalance.currentDepth === config.orderAlgoDepth &&
        (walletBalance.algo < config.orderAlgoDepth ||
          walletBalance.asa < config.orderAlgoDepth / latestPrice)
      ) {
        stopLoop({ config, errorStatus: "Low balance!" });
        return;
      }
    }
  );

  await placeOrdersAndUpdateDB({
    config,
    createEscrowPrices,
    decimals,
    latestPrice,
    exitLoop,
  });

  runState.inRunLoop = false;
  await sleep(1000);
  runLoop({ assetInfo, config, lastBlock, runState });
};

export default runLoop;

export const stopLoop = async ({
  config,
  resetExit,
  errorStatus,
}: {
  config?: BotConfig;
  resetExit?: boolean;
  errorStatus?: string;
}) => {
  if (resetExit) {
    exitLoop = false;
    return;
  }
  if (config) {
    exitLoop = true;
    const { assetId, walletAddr, escrowDB, api, environment } = config;

    console.log("Canceling all orders");
    events.emit("running-bot", {
      status: "Exiting bot",
      content: "Canceling all orders",
    });
    const openAccountSet = await getOpenAccountSetFromAlgodex(
      environment,
      walletAddr,
      assetId
    );

    events.emit("running-bot", {
      status: "Exiting bot",
      content: "Get current orders",
    });

    const escrows = await getCurrentOrders(
      escrowDB,
      api.indexer,
      openAccountSet,
      environment
    );
    const cancelArr = escrows.rows.map((escrow) => escrow.doc.order.escrowAddr);
    const cancelSet = new Set(cancelArr);
    const cancelPromises = await getCancelPromises({
      escrows,
      cancelSet,
      api,
      latestPrice: 0,
    });
    events.emit("running-bot", {
      status: "Exiting bot",
      content: "Cancelling orders...",
    });
    await cancelOrders(escrowDB, escrows, cancelPromises);
    events.emit("running-bot", {
      status: "Bot Stopped",
      content: "Exiting!",
    });
    if (errorStatus) {
      events.emit("running-bot", {
        status: "Bot Stopped",
        content: errorStatus,
      });
    }
  }
};
