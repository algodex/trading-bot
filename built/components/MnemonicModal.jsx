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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MnemonicModal = void 0;
const react_1 = __importDefault(require("react"));
const algosdk_1 = __importDefault(require("algosdk"));
//MUI Components
const Modal_1 = __importDefault(require("@mui/material/Modal"));
const Typography_1 = __importDefault(require("@mui/material/Typography"));
const Box_1 = __importDefault(require("@mui/material/Box"));
const Button_1 = __importDefault(require("@mui/material/Button"));
const ChevronLeft_1 = __importDefault(require("@mui/icons-material/ChevronLeft"));
const FormatListBulleted_1 = __importDefault(require("@mui/icons-material/FormatListBulleted"));
const storage_1 = require("@/lib/storage");
const MnemonicModal = ({ open, handleClose, }) => {
    const prefillInputs = (mnemonicList) => {
        [...Array(25)].forEach((item, index) => {
            const currentInput = document.querySelector(`#input${index}`);
            if (currentInput && mnemonicList[index]) {
                currentInput.value = mnemonicList[index];
            }
        });
    };
    const importWallet = async () => {
        const inputs = document.querySelectorAll(".input");
        const phrases = [];
        inputs.forEach((input, index) => {
            if (input.value) {
                phrases.push(input.value);
            }
        });
        if (phrases.length === 25) {
            let account = algosdk_1.default.mnemonicToSecretKey(phrases.join(""));
            (0, storage_1.saveWallet)(account.addr);
            handleClose();
        }
    };
    return (<Modal_1.default open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
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
        }} onClick={handleClose}>
          <ChevronLeft_1.default sx={{ fontSize: "30px" }}/>
          CANCEL
        </Typography_1.default>
        <Box_1.default sx={{
            paddingInline: "1rem",
            "@media(min-width:800px)": {
                paddingInline: "4rem",
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
            marginBottom: "10px",
            color: "primary.dark",
        }}>
                Enter the 25 word seed phrase to connect your wallet.
              </Typography_1.default>
              <Typography_1.default sx={{
            fontSize: "12px",
            fontStyle: "italic",
        }}>
                The entered mnemonic is encrypted only stored locally on this
                device. Algodex cannot access your mnemonic phrase and is not
                responsible for any lost funds if you lose your wallet mnemonic.
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
                const mnemonicList = value.split(",");
                if (mnemonicList.filter((item) => item !== "" && item !== " ")
                    .length === 25) {
                    prefillInputs(mnemonicList);
                }
            }}/>
              </Box_1.default>))}
          </Box_1.default>
          <Box_1.default sx={{ textAlign: "center", marginBlock: "40px" }}>
            <Button_1.default variant="outlined" onClick={importWallet}>
              IMPORT WALLET
            </Button_1.default>
          </Box_1.default>
        </Box_1.default>
      </Box_1.default>
    </Modal_1.default>);
};
exports.MnemonicModal = MnemonicModal;
