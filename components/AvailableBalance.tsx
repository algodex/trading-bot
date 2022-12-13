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
import Box from "@mui/material/Box";
import LaunchIcon from "@mui/icons-material/Launch";
import Typography from "@mui/material/Typography";
import { HtmlTooltip } from "./HtmlTooltip";
import Link from "./Nav/Link";
import { AssetSchema } from "./BotForm";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";

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

export const AvailableBalance = ({
  availableBalance,
  currentPrices,
  assetId,
}: {
  availableBalance: any[];
  currentPrices: any;
  assetId: string;
}) => {
  if (availableBalance.length < 1) return null;
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
            justifyContent: "end",
            textAlign: "center",
          }}
        >
          <Typography
            sx={{
              fontSize: "12px",
              fontWeight: 700,
              width: "34%",
              marginBottom: "10px",
            }}
          >
            Price (USD)
          </Typography>

          <Typography
            sx={{
              fontSize: "12px",
              fontWeight: 700,
              width: "36%",
              marginBottom: "10px",
            }}
          >
            Available Balance
            <HtmlTooltip
              title={
                <Box
                  sx={{
                    width: "300px",
                    maxWidth: "100%",
                    padding: ".3rem",
                  }}
                >
                  <Typography
                    fontWeight={700}
                    marginBottom={"6px"}
                    fontSize={"12px"}
                  >
                    Available Balance is your current balance available to place
                    new orders. It does not include any assets currently in
                    placed orders.
                  </Typography>
                </Box>
              }
              placement="top"
              arrow
              sx={{
                cursor: "pointer",
              }}
            >
              <InfoRoundedIcon
                sx={{
                  marginLeft: "5px",
                  fontSize: "13px",
                  color: "secondary.dark",
                  cursor: "pointer",
                }}
              />
            </HtmlTooltip>
          </Typography>
        </Box>
        <TableContainer>
          <Table sx={tableStyles}>
            <TableBody>
              {availableBalance.map((asset: AssetSchema, index: number) => (
                <TableRow
                  key={index}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row" width={"100px"}>
                    <Typography
                      sx={{
                        fontSize: "18px",
                        fontWeight: 700,
                        width: "30%",
                      }}
                    >
                      {asset.name || asset["asset-id"]}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography
                      sx={{
                        fontSize: "18px",
                        fontWeight: 700,
                      }}
                    >
                      $
                      {currentPrices[index].toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </Typography>
                  </TableCell>

                  <TableCell align="center">
                    <Typography
                      sx={{
                        fontSize: "18px",
                        fontWeight: 700,
                      }}
                    >
                      {asset.amount.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "14px",
                        fontWeight: 700,
                        color: "grey.200",
                      }}
                    >
                      $
                      {asset.amountInUSD.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <Typography
        sx={{
          fontSize: "16px",
          fontWeight: 700,
          color: "secondary.dark",
          backgroundColor: "grey.300",
          padding: "10px 20px",
        }}
      >
        Look up prices and market activity at{" "}
        <Link
          href={`https://vestige.fi/asset/${assetId}`}
          target={"_blanc"}
          sx={{
            color: "accent.dark",
            alignItems: "center",
            display: "inline-flex",
          }}
        >
          vestige.fi
          <LaunchIcon sx={{ fontSize: "14px", ml: "5px" }} />
        </Link>
      </Typography>
    </Box>
  );
};
