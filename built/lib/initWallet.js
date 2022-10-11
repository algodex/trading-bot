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
Object.defineProperty(exports, "__esModule", { value: true });
const initWallet = async (algodexApi, walletAddr) => {
    await algodexApi.setWallet({
        type: "sdk",
        address: walletAddr,
        connector: require("@algodex/algodex-sdk/lib/wallet/connectors/AlgoSDK"),
        // eslint-disable-next-line max-len
        mnemonic: process.env.WALLET_MNEMONIC,
    });
};
exports.default = initWallet;