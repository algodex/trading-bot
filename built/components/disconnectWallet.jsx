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
exports.DisconnectWallet = void 0;
const react_1 = __importStar(require("react"));
//MUI Components
const Modal_1 = __importDefault(require("@mui/material/Modal"));
const Typography_1 = __importDefault(require("@mui/material/Typography"));
const Box_1 = __importDefault(require("@mui/material/Box"));
const Button_1 = __importDefault(require("@mui/material/Button"));
const ArrowBack_1 = __importDefault(require("@mui/icons-material/ArrowBack"));
const ContentCopy_1 = __importDefault(require("@mui/icons-material/ContentCopy"));
const Tooltip_1 = __importDefault(require("@mui/material/Tooltip"));
//lib
const storage_1 = require("@/lib/storage");
const image_1 = __importDefault(require("next/image"));
const helper_1 = require("@/lib/helper");
const DisconnectWallet = ({ open, handleClose, }) => {
    const [tooltiptext, setTooltiptext] = (0, react_1.useState)("Click to Copy");
    const clearSession = () => {
        (0, storage_1.clearWallet)();
        handleClose();
    };
    const copyAddress = (address) => {
        document.querySelector(".copyToClipboard");
        navigator.clipboard.writeText(address);
        setTooltiptext(`Copied: ${address}`);
        setTimeout(() => {
            setTooltiptext("Click to Copy");
        }, 500);
    };
    const walletAddr = (0, react_1.useMemo)(() => {
        return (0, storage_1.getWallet)();
    }, [open]);
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
            padding: "40px 20px",
            maxHeight: "100%",
            overflow: "scroll",
        }}>
        <Box_1.default sx={{
            paddingInline: "1rem",
            width: "85%",
            marginX: "auto",
            "@media (max-width: 800px)": {
                width: "90%",
                paddingInline: "4rem",
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
              <image_1.default src="/password.png" alt="password" width="55" height="55"/>
            </Box_1.default>
            <Box_1.default>
              <Typography_1.default sx={{
            fontSize: "22px",
            fontWeight: 700,
        }}>
                Connected Wallet
              </Typography_1.default>
              <Box_1.default sx={{
            display: "flex",
            alignItems: "center",
            background: "#EEEEEE",
            border: "1px solid",
            borderColor: "secondary.dark",
            borderRadius: "3px",
            width: "fit-content",
            padding: "0.3rem 1rem",
            marginY: "10px",
        }}>
                <Typography_1.default fontSize={"1rem"} textAlign={"center"} fontWeight={500}>
                  {(0, helper_1.shortenAddress)(walletAddr || "", 10)}
                </Typography_1.default>
                <Tooltip_1.default title={tooltiptext} placement="top" arrow sx={{
            cursor: "pointer",
            marginLeft: "0.5rem",
        }}>
                  <ContentCopy_1.default sx={{
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
        }} onClick={() => copyAddress(walletAddr || "")}/>
                </Tooltip_1.default>
              </Box_1.default>
              <Typography_1.default sx={{
            fontSize: "16px",
            fontWeight: 500,
            marginBottom: "10px",
            color: "primary.dark",
        }}>
                Only one wallet can be connected at a time. You can disconnect
                this wallet and connect a different one. Disconnecting will
                clear the stored mnemonic and passphrase.
              </Typography_1.default>
            </Box_1.default>
          </Box_1.default>

          <Box_1.default sx={{ textAlign: "center", marginBlock: "40px" }}>
            <Button_1.default variant="contained" sx={{
            backgroundColor: "primary.dark",
            color: "#FFFFFF",
            "&:hover": {
                backgroundColor: "primary.dark",
            },
        }} onClick={handleClose}>
              <ArrowBack_1.default sx={{ marginRight: "5px" }}/> Back
            </Button_1.default>
          </Box_1.default>
          <Typography_1.default sx={{
            fontSize: "12px",
            fontWeight: 600,
            fontStyle: "italic",
            cursor: "pointer",
            textAlign: "center",
            textDecoration: "underline",
        }} onClick={clearSession}>
            Clear Mnemonic and Disconnect Wallet
          </Typography_1.default>
        </Box_1.default>
      </Box_1.default>
    </Modal_1.default>);
};
exports.DisconnectWallet = DisconnectWallet;
