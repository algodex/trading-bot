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

import React, { useState } from "react";

//MUI Components
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import Tooltip from "@mui/material/Tooltip";

//lib
import { clearWallet } from "@/lib/storage";
import Image from "next/image";
import { shortenAddress } from "@/lib/helper";

export const DisconnectWallet = ({
  open,
  handleClose,
  walletAddr,
  setWalletAddr,
  setMnemonic,
}: {
  open: boolean;
  handleClose: any;
  walletAddr: string | null;
  setWalletAddr: any;
  setMnemonic: any;
}) => {
  const [tooltiptext, setTooltiptext] = useState("Click to Copy");

  const clearSession = () => {
    clearWallet();
    handleClose();
    setWalletAddr(null);
    setMnemonic();
  };

  const copyAddress = (address: string) => {
    document.querySelector(".copyToClipboard");
    navigator.clipboard.writeText(address);
    setTooltiptext(`Copied: ${address}`);
    setTimeout(() => {
      setTooltiptext("Click to Copy");
    }, 500);
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 900,
          maxWidth: "100%",
          bgcolor: "accent.contrastText",
          boxShadow: 2,
          borderRadius: "6px",
          padding: "40px 20px",
          maxHeight: "100%",
        }}
      >
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
                marginTop: "10px",
              }}
            >
              <Image
                src="/password.png"
                alt="password"
                width="55"
                height="55"
              />
            </Box>
            <Box>
              <Typography
                sx={{
                  fontSize: "22px",
                  fontWeight: 700,
                }}
              >
                Connected Wallet
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
                Only one wallet can be connected at a time. You can disconnect
                this wallet and connect a different one. Disconnecting will
                clear the stored mnemonic and passphrase.
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
              onClick={handleClose}
            >
              <ArrowBackIcon sx={{ marginRight: "5px" }} /> Back
            </Button>
          </Box>
          <Typography
            sx={{
              fontSize: "12px",
              fontWeight: 600,
              fontStyle: "italic",
              cursor: "pointer",
              textAlign: "center",
              textDecoration: "underline",
            }}
            onClick={clearSession}
          >
            Clear Mnemonic and Disconnect Wallet
          </Typography>
        </Box>
      </Box>
    </Modal>
  );
};
