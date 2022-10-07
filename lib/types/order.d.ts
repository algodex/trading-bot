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

import { boolean } from "zod";

export interface DBQueryResult {
  rows: Array<DBOrder>;
}

export interface AllDocsResult {
  rows: Array<OrderDoc>;
}

export interface OrderDoc {
  doc: DBOrder;
}
export interface DBOrder {
  _id: string;
  _rev: string;
  order: Order;
}

export interface Order {
  escrowAddr: string;
  unixTime: number;
  address: string;
  version: number;
  price: number;
  amount: number;
  total: number;
  asset: Asset;
  assetId: number;
  type: string;
  appId: number;
  contract: Contract;
}

export interface Asset {
  id: number;
  decimals: number;
}

export interface Contract {
  creator: string;
  data: Data;
  escrow: string;
  lsig?: { lsig: { logic: any } };
}

export interface Data {
  type: string;
  data: number[];
}

export interface RunState {
  isExiting: boolean;
  inRunLoop: boolean;
}
