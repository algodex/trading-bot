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

import React, { useContext, useEffect, useState } from "react";

//MUI Components
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

//lib and custom components
import { getMnemonic } from "@/lib/storage";
import Image from "next/image";
import { CustomPasswordInput } from "../Form/CustomPasswordInput";
import { AppContext } from "@/context/appContext";
import { ClearPassphrase } from "../ClearPassphrase";

export const ValidateWallet = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("Must be inside of a App Provider");
  }
  const {
    openValidateModal,
    passphrase,
    setPassphrase,
    handleCloseValidate,
    forgotPassphrase,
    setForgotPassphrase,
    clearPassphrase,
  }: any = context;

  const validate = (e: any) => {
    e.preventDefault();
    if (passphrase) {
      const mnemonic: any = getMnemonic(passphrase.password);
      if (!mnemonic || mnemonic.message === "Malformed UTF-8 data") {
        setErrorMessage("Invalid passphrase, please retry!");
      } else if (typeof mnemonic === "string") {
        handleCloseValidate(mnemonic);
      }
    } else {
      setErrorMessage("Enter a passphrase!");
    }
  };

  useEffect(() => {
    if (passphrase) {
      setErrorMessage("");
    }
  }, [passphrase]);

  return (
    <Modal
      open={openValidateModal}
      onClose={() => {
        clearPassphrase();
        handleCloseValidate();
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
        {forgotPassphrase ? (
          <ClearPassphrase />
        ) : (
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
          </Box>
        )}
      </Box>
    </Modal>
  );
};
