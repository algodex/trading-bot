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
exports.WalletButton = void 0;
const react_1 = __importStar(require("react"));
//MUI Components
const Button_1 = __importDefault(require("@mui/material/Button"));
const Typography_1 = __importDefault(require("@mui/material/Typography"));
const Box_1 = __importDefault(require("@mui/material/Box"));
// Custom components
const MnemonicModal_1 = require("./MnemonicModal");
const helper_1 = require("@/lib/helper");
const storage_1 = require("@/lib/storage");
const disconnectWallet_1 = require("./disconnectWallet");
const WalletButton = () => {
    const [openModal, setOpenModal] = (0, react_1.useState)(null);
    const handleOpenModal = () => {
        if ((0, storage_1.getWallet)()) {
            setOpenModal("disconnect");
        }
        else {
            setOpenModal("mnemonic");
        }
    };
    const handleCloseModal = () => setOpenModal(null);
    const walletAddr = (0, react_1.useMemo)(() => {
        return (0, storage_1.getWallet)();
    }, [openModal]);
    return (<>
      <Box_1.default sx={{
            display: "flex",
            alignItems: "center",
            columnGap: "9px",
            justifyContent: "end",
            flexWrap: "wrap",
            "@media(max-width:900px)": {
                justifyContent: "start",
            },
        }}>
        <Typography_1.default sx={{ fontWeight: 600, fontSize: "17px" }}>
          Connected Wallet:
        </Typography_1.default>
        <Button_1.default variant="outlined" onClick={handleOpenModal}>
          {(0, storage_1.getWallet)() ? (0, helper_1.shortenAddress)(walletAddr || '') : "Input Mnemonic"}
        </Button_1.default>
      </Box_1.default>
      <MnemonicModal_1.MnemonicModal open={openModal === "mnemonic"} handleClose={handleCloseModal}/>
      <disconnectWallet_1.DisconnectWallet open={openModal === "disconnect"} handleClose={handleCloseModal}/>
    </>);
};
exports.WalletButton = WalletButton;
