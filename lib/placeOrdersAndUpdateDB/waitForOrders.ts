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

import { Order } from "../types/order";

const waitForOrders = async (ordersToPlace: any[]) => {
  const results = await Promise.all(
    ordersToPlace.map((p) => p.catch((e:any) => e))
  );
  const validResults = results.filter((result:any) => !(result instanceof Error));
  const invalidResults = results.filter((result:any) => result instanceof Error);
  if (invalidResults && invalidResults.length > 0) {
    console.error({ invalidResults });
  }
  return { validResults, invalidResults };
};

export default waitForOrders;
