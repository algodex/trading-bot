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

import React, { useCallback, useState } from "react";
import algosdk from "algosdk";
import Image from "next/image";

//MUI Components
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";

//lib
import { saveWallet } from "@/lib/storage";
import { CustomPasswordInput, PassPhrase } from "./CustomPasswordInput";

export const MnemonicModal = ({
  open,
  handleClose,
  setWalletAddr,
}: {
  open: boolean;
  handleClose: any;
  setWalletAddr: any;
}) => {
  const [mnemonic, setMnemonic] = useState<string | undefined>();
  const [passphrase, setPassphrase] = useState<PassPhrase>({
    password: "",
    show: false,
  });

  const prefillInputs = useCallback((mnemonicList: string[]) => {
    [...Array(25)].forEach((item, index) => {
      const currentInput: HTMLInputElement | null = document.querySelector(
        `#input${index}`
      );
      if (currentInput && mnemonicList[index]) {
        currentInput.value = mnemonicList[index].trim();
      }
    });
  }, []);

  const importWallet = useCallback(async () => {
    if (mnemonic && passphrase.password) {
      const account = algosdk.mnemonicToSecretKey(mnemonic);
      setWalletAddr(account.addr);
      saveWallet(account.addr, mnemonic, passphrase.password);
      setMnemonic(undefined);
      setPassphrase({
        password: "",
        show: false,
      });
      handleClose();
    }
  }, [mnemonic, passphrase]);

  const getPassPhrase = useCallback(() => {
    const inputs: NodeListOf<HTMLInputElement> | null =
      document.querySelectorAll(".input");
    const phrases: string[] = [];
    inputs.forEach((input) => {
      if (input.value) {
        phrases.push(input.value);
      }
    });
    if (phrases.length === 25) {
      setMnemonic(phrases.join(" "));
    }
  }, []);

  return (
    <Modal
      open={open}
      onClose={() => {
        handleClose();
        setMnemonic(undefined);
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
          padding: "20px 20px",
          maxHeight: "100%",
          "@media (max-width: 750px)": {
            overflow: "scroll",
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
            handleClose();
            setMnemonic(undefined);
          }}
        >
          <ChevronLeftIcon sx={{ fontSize: "30px" }} />
          CANCEL
        </Typography>
        <Box
          sx={{
            paddingInline: "1rem",
            "@media(min-width:800px)": {
              paddingInline: "4rem",
            },
          }}
        >
          {mnemonic ? (
            <Box
              sx={{
                width: "85%",
                marginX: "auto",
                "@media (max-width: 800px)": {
                  width: "90%",
                },
                "@media (max-width: 501px)": {
                  width: "100%",
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
                    Create Passphrase
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: "16px",
                      fontWeight: 500,
                      marginBottom: "5px",
                      color: "primary.dark",
                    }}
                  >
                    Create a passphrase to unlock this wallet in new sessions on
                    this device
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "12px",
                      fontStyle: "italic",
                    }}
                  >
                    The passphrase is only stored locally. If you forget it, you
                    will need to clear and re-enter the mnemonic.
                  </Typography>
                </Box>
              </Box>
              <Box
                sx={{
                  width: "50%",
                  marginX: "auto",
                  "@media (max-width: 501px)": {
                    width: "80%",
                  },
                }}
              >
                <form>
                  <CustomPasswordInput
                    passphrase={passphrase}
                    setPassphrase={setPassphrase}
                  />
                </form>
              </Box>
              <Box sx={{ textAlign: "center", marginBlock: "40px" }}>
                <Button
                  variant="contained"
                  disabled={!passphrase.password}
                  onClick={importWallet}
                >
                  Create Passphrase
                </Button>
              </Box>
            </Box>
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
                <FormatListBulletedIcon
                  sx={{
                    fontSize: "40px",
                    marginTop: "10px",
                    "@media (max-width: 330px)": {
                      display: "none",
                    },
                  }}
                />
                <Box>
                  <Typography
                    sx={{
                      fontSize: "22px",
                      fontWeight: 700,
                    }}
                  >
                    Import Wallet with Mnemonic Phrase
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: "16px",
                      fontWeight: 500,
                      marginBottom: "5px",
                      color: "primary.dark",
                    }}
                  >
                    Enter the 25 word seed phrase to connect your wallet.
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "12px",
                      fontStyle: "italic",
                    }}
                  >
                    The entered mnemonic is encrypted only stored locally on
                    this device. Algodex cannot access your mnemonic phrase and
                    is not responsible for any lost funds if you lose your
                    wallet mnemonic.
                  </Typography>
                </Box>
              </Box>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))",
                  gridRowGap: "30px",
                  gridColumnGap: "30px",
                  "@media (max-width: 501px)": {
                    gridTemplateColumns: "repeat(auto-fit, minmax(60px, 1fr))",
                  },
                }}
              >
                {[...Array(25)].map((item, index) => (
                  <Box
                    key={index}
                    sx={{
                      background: "transparent",
                      border: "1px solid",
                      borderRadius: "3px",
                      overflow: "hidden",
                      borderColor: "grey.200",
                      display: "flex",
                      padding: "2px 4px",
                      input: {
                        width: "100%",
                        border: "none",
                        fontSize: "16px",
                        "&:focus": {
                          outline: "none",
                        },
                      },
                    }}
                  >
                    {index + 1}.
                    <input
                      type="text"
                      className="input"
                      style={{ marginLeft: "2px" }}
                      id={`input${index}`}
                      onChange={({ target: { value } }) => {
                        const mnemonicList =
                          value.split(",").length > 1
                            ? value.split(",")
                            : value.split(" ");
                        const formattedList = mnemonicList.filter(
                          (item) => item !== "" && item !== " "
                        );
                        if (formattedList.length === 25) {
                          prefillInputs(formattedList);
                        }
                      }}
                    />
                  </Box>
                ))}
              </Box>
              <Box sx={{ textAlign: "center", marginBlock: "40px" }}>
                <Button variant="outlined" onClick={getPassPhrase}>
                  IMPORT WALLET
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Box>
    </Modal>
  );
};
