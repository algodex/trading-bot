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

import { AssetSchema } from "../BotForm";

interface State {
  ASAError: string | null;
  availableBalance: AssetSchema[];
  ASAWarning: string | null;
  currentPrices: number[];
}

export const initialState = {
  ASAError: null,
  availableBalance: [],
  ASAWarning: null,
  currentPrices: [],
};

export const updateReducer = (
  state: State,
  action: { type: string; payload: any }
) => {
  const { type, payload } = action;
  switch (type) {
    case "asaError":
      return { ...state, ASAError: payload };
    case "asaWarning":
      return { ...state, ASAWarning: payload };
    case "balance":
      return { ...state, availableBalance: payload };
    case "currentPrice":
      return {
        ...state,
        currentPrices: payload,
      };
    default:
      return state;
  }
};
