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

import { getAlgoPrice } from "@/lib/helper";
import { Environment } from "@/lib/types/config";
import { useCallback, useEffect, useState } from "react";

export const usePriceConversionHook = ({ env }: { env: Environment }) => {
  const [conversionRate, setConversionRate] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  const getPrice = useCallback(async () => {
    const USDCId = env === "mainnet" ? 31566704 : 10458941;
    setLoading(true);
    try {
      const price: any = await getAlgoPrice(USDCId, env);
      setConversionRate(price);
      setTimeout(() => {
        setLoading(false);
      }, 6000);
    } catch (error) {
      console.error(error);
    }
  }, [env]);

  useEffect(() => {
    if (!loading) {
      getPrice();
    }
  }, [env, getPrice, loading]);

  return { conversionRate, getPrice, loading };
};
