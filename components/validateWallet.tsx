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

import React, { useEffect, useState } from "react";

//MUI Components
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import Tooltip from "@mui/material/Tooltip";

//lib
import { clearWallet, getMnemonic } from "@/lib/storage";
import Image from "next/image";
import { CustomPasswordInput, PassPhrase } from "./CustomPasswordInput";
import { shortenAddress } from "@/lib/helper";

export const ValidateWallet = ({
  open,
  handleClose,
  passphrase,
  setPassphrase,
  walletAddr,
  setWalletAddr,
}: {
  open: boolean;
  handleClose: (arg?: string) => void;
  passphrase: PassPhrase;
  setPassphrase: (arg: any) => void;
  walletAddr: string | null;
  setWalletAddr: any;
}) => {
  const [forgotPassphrase, setForgotPassphrase] = useState<boolean>(false);
  const [tooltiptext, setTooltiptext] = useState("Click to Copy");
  const [errorMessage, setErrorMessage] = useState("");

  const validate = (e: any) => {
    e.preventDefault();
    if (passphrase) {
      const mnemonic: any = getMnemonic(passphrase.password);
      if (!mnemonic || mnemonic.message === "Malformed UTF-8 data") {
        setErrorMessage("Invalid passphrase, please retry!");
      } else if (typeof mnemonic === "string") {
        handleClose(mnemonic);
      }
    } else {
      setErrorMessage("Enter a passphrase!");
    }
  };

  const clearPassprase = () => {
    setForgotPassphrase(false);
    setPassphrase((prev: PassPhrase) => ({ ...prev, password: "" }));
  };

  const clearSession = () => {
    clearWallet();
    clearPassprase();
    handleClose();
    setWalletAddr(null);
  };

  const copyAddress = (address: string) => {
    document.querySelector(".copyToClipboard");
    navigator.clipboard.writeText(address);
    setTooltiptext(`Copied: ${address}`);
    setTimeout(() => {
      setTooltiptext("Click to Copy");
    }, 500);
  };

  useEffect(() => {
    if (passphrase) {
      setErrorMessage("");
    }
  }, [passphrase]);

  return (
    <Modal
      open={open}
      onClose={() => {
        clearPassprase();
        handleClose();
      }}
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
        {forgotPassphrase && (
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
        )}
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
          {forgotPassphrase ? (
            <>
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
                    mnemonic will need to be re-entered to connect back to a
                    wallet.
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
            </>
          ) : (
            <>
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
                  <Image
                    src="/password.png"
                    alt="password"
                    width="35"
                    height="35"
                  />
                </Box>
                <Box>
                  <Typography
                    sx={{
                      fontSize: "22px",
                      fontWeight: 700,
                    }}
                  >
                    Enter Passphrase
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: "16px",
                      fontWeight: 500,
                      marginBottom: "10px",
                      color: "primary.dark",
                    }}
                  >
                    Enter the passphrase to unlock this wallet - Wallet needs to
                    be unlocked every time page is refreshed.
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "12px",
                      fontStyle: "italic",
                    }}
                  >
                    The passphrase is only stored locally. If you have forgetten
                    it, you will need to clear and re-enter the mnemonic.
                  </Typography>
                </Box>
              </Box>
              <form>
                <Box
                  sx={{
                    width: "50%",
                    marginX: "auto",
                    "@media (max-width: 501px)": {
                      width: "80%",
                    },
                  }}
                >
                  <CustomPasswordInput
                    passphrase={passphrase}
                    setPassphrase={setPassphrase}
                  />
                  {errorMessage && (
                    <Typography
                      sx={{
                        fontSize: "12px",
                        color: "error.main",
                      }}
                    >
                      {errorMessage}
                    </Typography>
                  )}
                </Box>
                <Box sx={{ textAlign: "center", marginBlock: "40px" }}>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={!passphrase.password}
                    onClick={validate}
                  >
                    Enter
                  </Button>
                </Box>
              </form>
              <Typography
                sx={{
                  fontSize: "12px",
                  fontWeight: 600,
                  fontStyle: "italic",
                  cursor: "pointer",
                  textAlign: "center",
                  textDecoration: "underline",
                }}
                onClick={() => setForgotPassphrase(true)}
              >
                Forgot Passphrase? Clear Mnemonic
              </Typography>
            </>
          )}
        </Box>
      </Box>
    </Modal>
  );
};
