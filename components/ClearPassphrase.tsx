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

import React, { useContext, useState } from "react";
import Image from "next/image";

//MUI Components
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

//lib
import { shortenAddress } from "@/lib/helper";
import { AppContext } from "@/context/appContext";
import { clearWallet } from "@/lib/storage";

export const ClearPassphrase = ({
  closeModal,
}: {
  closeModal?: () => void;
}) => {
  const [tooltiptext, setTooltiptext] = useState("Click to Copy");
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("Must be inside of a App Provider");
  }
  const {
    walletAddr,
    setWalletAddr,
    setForgotPassphrase,
    handleCloseValidate,
    clearPassphrase,
    setMnemonic,
  }: any = context;

  const copyAddress = (address: string) => {
    document.querySelector(".copyToClipboard");
    navigator.clipboard.writeText(address);
    setTooltiptext(`Copied: ${address}`);
    setTimeout(() => {
      setTooltiptext("Click to Copy");
    }, 500);
  };

  const clearSession = () => {
    clearWallet();
    clearPassphrase();
    if (closeModal) {
      closeModal();
      setMnemonic();
    } else {
      handleCloseValidate();
    }
    setWalletAddr(null);
  };

  return (
    <Box
      sx={{
        paddingInline: "1rem",
        width: "85%",
        marginX: "auto",
        "@media (max-width: 800px)": {
          width: "90%",
          paddingInline: "4rem",
        },
        "@media (max-width: 501px)": {
          width: "100%",
          padding: 0,
        },
      }}
    >
      <Typography
        sx={{
          fontSize: "18px",
          fontWeight: 700,
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
          width: "fit-content",
          marginBottom: "25px",
        }}
        onClick={() => {
          setForgotPassphrase(false);
        }}
      >
        <ChevronLeftIcon sx={{ fontSize: "30px" }} />
        CANCEL
      </Typography>
      <Box
        sx={{
          paddingInline: "1rem",
          width: "85%",
          marginX: "auto",
          "@media (max-width: 800px)": {
            width: "90%",
            paddingInline: "4rem",
          },
          "@media (max-width: 501px)": {
            width: "100%",
            padding: 0,
          },
        }}
      >
        <Box
          sx={{
            marginBottom: "30px",
            display: "flex",
            columnGap: "10px",
            "@media(min-width:800px)": {
              paddingLeft: "4rem",
            },
          }}
        >
          <Box
            sx={{
              marginTop: "20px",
            }}
          >
            <Image src="/password.png" alt="password" width="55" height="55" />
          </Box>
          <Box>
            <Typography
              sx={{
                fontSize: "22px",
                fontWeight: 700,
              }}
            >
              Clear Stored Wallet
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                background: "#EEEEEE",
                border: "1px solid",
                borderColor: "secondary.dark",
                borderRadius: "3px",
                width: "fit-content",
                padding: "0.3rem 1rem",
                marginY: "10px",
              }}
            >
              <Typography
                fontSize={"1rem"}
                textAlign={"center"}
                fontWeight={500}
              >
                {shortenAddress(walletAddr || "", 10)}
              </Typography>
              <Tooltip
                title={tooltiptext}
                placement="top"
                arrow
                sx={{
                  cursor: "pointer",
                  marginLeft: "0.5rem",
                }}
              >
                <ContentCopyIcon
                  sx={{
                    marginLeft: "0.4rem",
                    fontSize: "0.9rem",
                    opacity: 0.7,
                    cursor: "pointer",
                    transition: "all .3s ease",
                    ["&:hover"]: {
                      opacity: 1,
                    },
                    ["@media(max-width:600px)"]: {
                      fontSize: "1.5rem",
                    },
                  }}
                  onClick={() => copyAddress(walletAddr || "")}
                />
              </Tooltip>
            </Box>
            <Typography
              sx={{
                fontSize: "16px",
                fontWeight: 500,
                marginBottom: "10px",
                color: "primary.dark",
              }}
            >
              Clearing the mnemonic disconnects the wallet entirely and a
              mnemonic will need to be re-entered to connect back to a wallet.
              This is not recoverable!
            </Typography>
          </Box>
        </Box>

        <Box sx={{ textAlign: "center", marginBlock: "40px" }}>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "primary.dark",
              color: "#FFFFFF",
              "&:hover": {
                backgroundColor: "primary.dark",
              },
            }}
            onClick={clearSession}
          >
            CLEAR STORED WALLET
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
