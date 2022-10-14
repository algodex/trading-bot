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
import CryptoJS from "crypto-js";

export const storageKeys = {
  wallet: "algodex_tb_wallet_address",
  mnemonic: "ag_m_s_x",
};

export const getWallet = () => {
  const wallet =
    typeof window !== "undefined"
      ? localStorage.getItem(storageKeys.wallet)
      : null;
  return wallet;
};

export const getMnemonic = (passphrase: string) => {
  const ciphertext =
    typeof window !== "undefined"
      ? localStorage.getItem(storageKeys.mnemonic)
      : null;
  if (ciphertext) {
    // Decrypt mnemonic
    try {
      var bytes = CryptoJS.AES.decrypt(ciphertext, passphrase);
      var mnemonic = bytes.toString(CryptoJS.enc.Utf8);
      return mnemonic;
    } catch (error) {
      return error;
    }
  } else {
    return null;
  }
};

export const saveWallet = (
  wallet: string,
  mnemonic: string,
  passphrase: string
) => {
  localStorage.setItem(storageKeys.wallet, wallet);
  // Encrypt mnemonic and save
  var ciphertext = CryptoJS.AES.encrypt(mnemonic, passphrase).toString();
  localStorage.setItem(storageKeys.mnemonic, ciphertext);
};

export const clearWallet = () => {
  localStorage.removeItem(storageKeys.wallet);
  localStorage.removeItem(storageKeys.mnemonic);
};
