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

import React from "react";

//MUI Components
import Typography from "@mui/material/Typography";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { openOrderSchema } from "./ordersTable";
import { usePriceConversionHook } from "@/hooks/usePriceConversionHook";
import { Environment } from "@/lib/types/config";

export const OrderRow = ({
  openOrders,
  activeCurrency,
  assetName,
  environment,
}: {
  openOrders: openOrderSchema[];
  activeCurrency: "ALGO" | "USD";
  assetName: string;
  environment: Environment;
}) => {
  const { algoRate } = usePriceConversionHook({
    env: environment,
  });
  return (
    <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
      <TableCell
        component="th"
        scope="row"
        sx={{ paddingInline: "8px !important" }}
      >
        <Typography
          sx={{
            fontWeight: 600,
            textTransform: "uppercase",
          }}
        >
          {openOrders[0].type}
        </Typography>
      </TableCell>
      <TableCell align="center">
        <Typography
          sx={{
            fontSize: "12px",
            fontWeight: 700,
            marginBottom: "2px",
            color: "grey.200",
          }}
        >
          Price ({activeCurrency})
        </Typography>
        {openOrders.map((order, index) => (
          <Typography
            key={index}
            sx={{
              fontSize: "12px",
              color: `${order.type === "sell" ? "error.main" : "accent.dark"}`,
            }}
          >
            {(
              order.price * (activeCurrency === "USD" ? algoRate : 1)
            ).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 4,
            })}
          </Typography>
        ))}
      </TableCell>
      <TableCell align="center">
        <Typography
          sx={{
            fontSize: "12px",
            fontWeight: 700,
            marginBottom: "2px",
            color: "grey.200",
          }}
        >
          AMOUNT ({assetName})
        </Typography>
        {openOrders.map((order, index) => (
          <Typography
            key={index}
            sx={{
              fontSize: "12px",
            }}
          >
            {order.amount.toLocaleString(undefined, {
              maximumFractionDigits: 4,
            })}
          </Typography>
        ))}
      </TableCell>
      <TableCell align="center">
        <Typography
          sx={{
            fontSize: "12px",
            fontWeight: 700,
            marginBottom: "2px",
            color: "grey.200",
          }}
        >
          TOTAL ({activeCurrency})
        </Typography>

        {openOrders.map((order, index) => (
          <Typography
            key={index}
            sx={{
              fontSize: "12px",
            }}
          >
            {(
              order.total * (activeCurrency === "USD" ? algoRate : 1)
            ).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </Typography>
        ))}
      </TableCell>
    </TableRow>
  );
};
