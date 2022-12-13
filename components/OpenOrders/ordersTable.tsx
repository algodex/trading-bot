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

import React, { useCallback, useContext, useEffect, useState } from "react";

//MUI Components
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import { AppContext } from "@/context/appContext";
import { fetchOpenOrders } from "@/lib/cancelAssetOrders";
import { OrderRow } from "./orderRow";

const tableStyles = {
  ".MuiTableCell-root, .MuiTableRow-root:last-child td, .MuiTableRow-root:last-child th":
    {
      padding: "13px",
      border: "0.2px solid",
      borderTop: "none",
      borderColor: "secondary.contrastText",
    },
  "th.MuiTableCell-root, .MuiTableRow-root:last-child th ": {
    borderLeft: "none",
  },
  ".MuiTableCell-root:last-child, .MuiTableRow-root:last-child td": {
    borderRight: "none",
  },
  ".MuiTableRow-root:last-child th, .MuiTableRow-root:last-child td ": {
    borderBottom: "none",
  },
};

const currencySelectorStyles = {
  selectorContainer: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "grey.100",
    justifyContent: "center",
    borderRadius: "3px",
    overflow: "hidden",
    height: "24px",
  },
  selector: {
    padding: "5px 6px",
    fontSize: "13px",
    fontWeight: 800,
    color: "primary.contrastText",
    cursor: "pointer",
    minWidth: "3rem",
    textAlign: "center",
  },
  activeSelector: {
    color: "accent.contrastText",
    backgroundColor: "grey.200",
  },
};

export type openOrderSchema = {
  address: string;
  amount: number;
  appId: number;
  asset: { id: string };
  execution: "execute" | "taker";
  price: number;
  total: number;
  type: "buy" | "sell";
};

export const OrdersTable = () => {
  const {
    walletAddr,
    mnemonic,
    formValues: { assetId, assetName },
    environment,
    openOrders,
    setOpenOrders,
  }: any = useContext(AppContext);
  const [activeCurrency, setActiveCurrency] = useState<"ALGO" | "USD">("ALGO");

  const getOpenOrders = useCallback(async () => {
    const { orders } = await fetchOpenOrders(environment, {
      address: walletAddr,
      mnemonic,
    });
    if (orders)
      setOpenOrders(orders.filter((order: any) => order.asset.id === assetId));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assetId, walletAddr, mnemonic, environment]);

  useEffect(() => {
    if (assetId && walletAddr) {
      getOpenOrders();
    } else {
      setOpenOrders([]);
    }
  }, [assetId, walletAddr, environment, getOpenOrders, setOpenOrders]);

  if (openOrders.length < 1) return null;
  return (
    <Box
      sx={{
        border: "2px solid",
        borderColor: "secondary.contrastText",
        borderRadius: "3px",
        marginTop: "40px",
        marginBottom: "20px",
        background: "transparent",
      }}
    >
      <Box
        sx={{
          padding: "15px 20px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "10px",
          }}
        >
          <Typography
            sx={{
              fontWeight: 600,
              fontSize: "15px",
            }}
          >
            Bot’s Open Orders:
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography
              sx={{
                fontSize: "12px",
                fontWeight: 700,
                marginRight: "3px",
              }}
            >
              Show prices in:
            </Typography>
            <Box sx={currencySelectorStyles.selectorContainer}>
              <Typography
                sx={[
                  currencySelectorStyles.selector,
                  activeCurrency == "ALGO"
                    ? currencySelectorStyles.activeSelector
                    : {},
                ]}
                onClick={() => {
                  setActiveCurrency("ALGO");
                }}
              >
                ALGO
              </Typography>
              <Typography
                sx={[
                  currencySelectorStyles.selector,
                  activeCurrency == "USD"
                    ? currencySelectorStyles.activeSelector
                    : {},
                ]}
                onClick={() => {
                  setActiveCurrency("USD");
                }}
              >
                USD
              </Typography>
            </Box>
          </Box>
        </Box>
        <TableContainer>
          <Table sx={tableStyles}>
            <TableBody>
              <OrderRow
                openOrders={openOrders.filter(
                  (order: openOrderSchema) => order.type === "sell"
                )}
                activeCurrency={activeCurrency}
                assetName={assetName}
                environment={environment}
              />
              <OrderRow
                openOrders={openOrders.filter(
                  (order: openOrderSchema) => order.type === "buy"
                )}
                activeCurrency={activeCurrency}
                assetName={assetName}
                environment={environment}
              />
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};
