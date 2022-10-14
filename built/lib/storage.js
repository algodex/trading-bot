"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveWallet = exports.getMnemonic = exports.getWallet = exports.storageKeys = void 0;
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
const crypto_js_1 = __importDefault(require("crypto-js"));
exports.storageKeys = {
    wallet: "algodex_tb_wallet_address",
    mnemonic: "ag_m_s_x",
};
const getWallet = () => {
    const wallet = typeof window !== "undefined"
        ? localStorage.getItem(exports.storageKeys.wallet)
        : null;
    return wallet;
};
exports.getWallet = getWallet;
const getMnemonic = (passphrase) => {
    const ciphertext = typeof window !== "undefined"
        ? localStorage.getItem(exports.storageKeys.mnemonic)
        : null;
    if (ciphertext) {
        // Decrypt mnemonic
        var bytes = crypto_js_1.default.AES.decrypt(ciphertext, passphrase);
        var mnemonic = bytes.toString(crypto_js_1.default.enc.Utf8);
        return mnemonic;
    }
    else {
        return null;
    }
};
exports.getMnemonic = getMnemonic;
const saveWallet = (wallet, mnemonic, passphrase) => {
    localStorage.setItem(exports.storageKeys.wallet, wallet);
    // Encrypt mnemonic and save
    var ciphertext = crypto_js_1.default.AES.encrypt(mnemonic, passphrase).toString();
    localStorage.setItem(exports.storageKeys.mnemonic, ciphertext);
};
exports.saveWallet = saveWallet;
