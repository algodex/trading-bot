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

//MUI Components
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import Tooltip from "@mui/material/Tooltip";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";

//lib and custom components
import { getMnemonic } from "@/lib/storage";
import Image from "next/image";
import { shortenAddress } from "@/lib/helper";
import { CustomPasswordInput } from "./CustomPasswordInput";
import { AppContext } from "@/context/appContext";
import { ClearPassphrase } from "./ClearPassphrase";

export const ExportWallet = ({
  open,
  handleClose,
}: {
  open: boolean;
  handleClose: any;
}) => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("Must be inside of a App Provider");
  }
  const {
    walletAddr,
    forgotPassphrase,
    setForgotPassphrase,
    passphrase,
    setPassphrase,
  }: any = context;
  const [tooltiptext, setTooltiptext] = useState("Click to Copy");
  const [exportStep, setExportStep] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [safe, setSafe] = useState<boolean>(false);
  const [mnemonicList, setMnemonicList] = useState<string[]>([]);

  const closeModal = () => {
    handleClose();
    setExportStep(0);
    setPassphrase({
      password: "",
      show: false,
    });
    setErrorMessage("");
    setSafe(false);
  };

  const copyAddress = (address: string) => {
    document.querySelector(".copyToClipboard");
    navigator.clipboard.writeText(address);
    setTooltiptext(`Copied: ${address}`);
    setTimeout(() => {
      setTooltiptext("Click to Copy");
    }, 500);
  };

  const validate = (e: any) => {
    e.preventDefault();
    if (passphrase) {
      const mnemonic: any = getMnemonic(passphrase.password);
      if (!mnemonic || mnemonic.message === "Malformed UTF-8 data") {
        setErrorMessage("Invalid passphrase, please retry!");
      } else if (typeof mnemonic === "string") {
        setExportStep(2);
        setSafe(false);
        setMnemonicList(mnemonic.split(" "));
      }
    } else {
      setErrorMessage("Enter a passphrase!");
    }
  };

  const copySeedPhrase = () => {
    navigator.clipboard.writeText(mnemonicList.join(" "));
  };

  return (
    <Modal
      open={open}
      onClose={closeModal}
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
          <ClearPassphrase closeModal={closeModal} />
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
            {exportStep === 1 ? (
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
                      Enter the passphrase to show mnemonic phrase and export
                      account
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "12px",
                        fontStyle: "italic",
                      }}
                    >
                      The passphrase is only stored locally. If you have
                      forgetten it, you will need to clear and re-enter the
                      mnemonic.
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

                  <Box sx={{ textAlign: "center", marginTop: "20px" }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          color={"dark600" as any}
                          value={safe}
                          onChange={({ target: { checked } }) => {
                            setSafe(checked);
                          }}
                        />
                      }
                      label="No one is looking - Reveal Seed Phrase"
                    />
                  </Box>
                  <Box sx={{ textAlign: "center", marginBlock: "40px" }}>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={!passphrase.password || !safe}
                      onClick={validate}
                    >
                      Enter
                    </Button>
                  </Box>
                </form>
              </>
            ) : exportStep === 2 ? (
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
                      Export Account
                    </Typography>

                    <Typography
                      sx={{
                        fontSize: "16px",
                        fontWeight: 500,
                        marginBottom: "5px",
                        color: "primary.dark",
                      }}
                    >
                      You can copy the whole seed phrase or reveal the words
                      below{" "}
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
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(60px, 1fr))",
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
                        type={safe ? "text" : "password"}
                        className="input"
                        style={{ marginLeft: "2px" }}
                        id={`input${index}`}
                        value={mnemonicList[index]}
                        readOnly
                      />
                    </Box>
                  ))}
                </Box>
                <Box sx={{ textAlign: "center", marginTop: "20px" }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        color={"dark600" as any}
                        value={safe}
                        onChange={({ target: { checked } }) => {
                          setSafe(checked);
                        }}
                      />
                    }
                    label="No one is looking - Reveal Seed Phrase"
                  />
                </Box>
                <Box sx={{ textAlign: "center", marginBlock: "20px" }}>
                  <Button variant="contained" onClick={copySeedPhrase}>
                    Copy Seed phrase
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
                      Only one wallet can be connected at a time. You can
                      disconnect this wallet and connect a different one.
                      Disconnecting will clear the stored mnemonic and
                      passphrase.
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
                    onClick={closeModal}
                  >
                    <ArrowBackIcon sx={{ marginRight: "5px" }} /> Back
                  </Button>
                </Box>
                <Box sx={{ textAlign: "center", marginBottom: "40px" }}>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setExportStep(1);
                    }}
                  >
                    EXPORT ACCOUNT
                  </Button>
                </Box>
              </>
            )}
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
              Clear Mnemonic and Disconnect Wallet
            </Typography>
          </Box>
        )}
      </Box>
    </Modal>
  );
};
