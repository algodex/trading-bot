"use strict";
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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MnemonicModal = void 0;
const react_1 = __importStar(require("react"));
const algosdk_1 = __importDefault(require("algosdk"));
const image_1 = __importDefault(require("next/image"));
//MUI Components
const Modal_1 = __importDefault(require("@mui/material/Modal"));
const Typography_1 = __importDefault(require("@mui/material/Typography"));
const Box_1 = __importDefault(require("@mui/material/Box"));
const Button_1 = __importDefault(require("@mui/material/Button"));
const ChevronLeft_1 = __importDefault(require("@mui/icons-material/ChevronLeft"));
const FormatListBulleted_1 = __importDefault(require("@mui/icons-material/FormatListBulleted"));
//lib
const storage_1 = require("@/lib/storage");
const CustomPasswordInput_1 = require("./CustomPasswordInput");
const MnemonicModal = ({ open, handleClose, }) => {
    const [mnemonic, setMnemonic] = (0, react_1.useState)();
    const [passphrase, setPassphrase] = (0, react_1.useState)({
        password: "",
        show: false,
    });
    const prefillInputs = (mnemonicList) => {
        [...Array(25)].forEach((item, index) => {
            const currentInput = document.querySelector(`#input${index}`);
            if (currentInput && mnemonicList[index]) {
                currentInput.value = mnemonicList[index];
            }
        });
    };
    const importWallet = async () => {
        if (mnemonic && passphrase.password) {
            let account = algosdk_1.default.mnemonicToSecretKey(mnemonic);
            (0, storage_1.saveWallet)(account.addr, mnemonic, passphrase.password);
            setMnemonic(undefined);
            setPassphrase({
                password: "",
                show: false,
            });
            handleClose();
        }
    };
    const getPassPhrase = () => {
        const inputs = document.querySelectorAll(".input");
        const phrases = [];
        inputs.forEach((input) => {
            if (input.value) {
                phrases.push(input.value);
            }
        });
        if (phrases.length === 25) {
            setMnemonic(phrases.join(" "));
        }
    };
    return (<Modal_1.default open={open} onClose={() => {
            handleClose();
            setMnemonic(undefined);
        }} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
      <Box_1.default sx={{
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
            overflow: "scroll",
        }}>
        <Typography_1.default sx={{
            fontSize: "18px",
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
            width: "fit-content",
            marginBottom: "25px",
        }} onClick={() => {
            handleClose();
            setMnemonic(undefined);
        }}>
          <ChevronLeft_1.default sx={{ fontSize: "30px" }}/>
          CANCEL
        </Typography_1.default>
        <Box_1.default sx={{
            paddingInline: "1rem",
            "@media(min-width:800px)": {
                paddingInline: "4rem",
            },
        }}>
          {mnemonic ? (<Box_1.default sx={{
                width: "85%",
                marginX: "auto",
                "@media (max-width: 800px)": {
                    width: "90%",
                },
                "@media (max-width: 501px)": {
                    width: "100%",
                },
            }}>
              <Box_1.default sx={{
                marginBottom: "30px",
                display: "flex",
                columnGap: "10px",
                "@media(min-width:800px)": {
                    paddingLeft: "4rem",
                },
            }}>
                <Box_1.default sx={{
                marginTop: "10px",
            }}>
                  <image_1.default src="/password.png" alt="password" width="35" height="35"/>
                </Box_1.default>
                <Box_1.default>
                  <Typography_1.default sx={{
                fontSize: "22px",
                fontWeight: 700,
            }}>
                    Create Passphrase
                  </Typography_1.default>

                  <Typography_1.default sx={{
                fontSize: "16px",
                fontWeight: 500,
                marginBottom: "5px",
                color: "primary.dark",
            }}>
                    Create a passphrase to unlock this wallet in new sessions on
                    this device
                  </Typography_1.default>
                  <Typography_1.default sx={{
                fontSize: "12px",
                fontStyle: "italic",
            }}>
                    The passphrase is only stored locally. If you forget it, you
                    will need to clear and re-enter the mnemonic.
                  </Typography_1.default>
                </Box_1.default>
              </Box_1.default>
              <Box_1.default sx={{
                width: "50%",
                marginX: "auto",
                "@media (max-width: 501px)": {
                    width: "80%",
                },
            }}>
                <CustomPasswordInput_1.CustomPasswordInput passphrase={passphrase} setPassphrase={setPassphrase}/>
              </Box_1.default>
              <Box_1.default sx={{ textAlign: "center", marginBlock: "40px" }}>
                <Button_1.default variant="contained" disabled={!passphrase.password} onClick={importWallet}>
                  Create Passphrase
                </Button_1.default>
              </Box_1.default>
            </Box_1.default>) : (<>
              <Box_1.default sx={{
                marginBottom: "30px",
                display: "flex",
                columnGap: "10px",
                "@media(min-width:800px)": {
                    paddingLeft: "4rem",
                },
            }}>
                <FormatListBulleted_1.default sx={{
                fontSize: "40px",
                marginTop: "10px",
                "@media (max-width: 330px)": {
                    display: "none",
                },
            }}/>
                <Box_1.default>
                  <Typography_1.default sx={{
                fontSize: "22px",
                fontWeight: 700,
            }}>
                    Import Wallet with Mnemonic Phrase
                  </Typography_1.default>

                  <Typography_1.default sx={{
                fontSize: "16px",
                fontWeight: 500,
                marginBottom: "5px",
                color: "primary.dark",
            }}>
                    Enter the 25 word seed phrase to connect your wallet.
                  </Typography_1.default>
                  <Typography_1.default sx={{
                fontSize: "12px",
                fontStyle: "italic",
            }}>
                    The entered mnemonic is encrypted only stored locally on
                    this device. Algodex cannot access your mnemonic phrase and
                    is not responsible for any lost funds if you lose your
                    wallet mnemonic.
                  </Typography_1.default>
                </Box_1.default>
              </Box_1.default>
              <Box_1.default sx={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))",
                gridRowGap: "30px",
                gridColumnGap: "30px",
                "@media (max-width: 501px)": {
                    gridTemplateColumns: "repeat(auto-fit, minmax(60px, 1fr))",
                },
            }}>
                {[...Array(25)].map((item, index) => (<Box_1.default key={index} sx={{
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
                }}>
                    {index + 1}.
                    <input type="text" className="input" id={`input${index}`} onChange={({ target: { value } }) => {
                    const mnemonicList = value.split(",").length > 1
                        ? value.split(",")
                        : value.split(" ");
                    if (mnemonicList.filter((item) => item !== "" && item !== " ").length === 25) {
                        prefillInputs(mnemonicList);
                    }
                }}/>
                  </Box_1.default>))}
              </Box_1.default>
              <Box_1.default sx={{ textAlign: "center", marginBlock: "40px" }}>
                <Button_1.default variant="outlined" onClick={getPassPhrase}>
                  IMPORT WALLET
                </Button_1.default>
              </Box_1.default>
            </>)}
        </Box_1.default>
      </Box_1.default>
    </Modal_1.default>);
};
exports.MnemonicModal = MnemonicModal;
