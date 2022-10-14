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

const initWallet = require("./initWallet").default;
const algosdk = require("algosdk");

const algodexApiMock = {
  setWallet: jest.fn((input) => new Promise((resolve) => resolve(input))),
};
// remove: jest.fn(doc => new Promise(resolve => resolve('done'))),

test("can initialize wallet", async () => {
  process.env.NEXT_PUBLIC_ALGOD_SERVER = "http://algod-server";
  process.env.ALGOD_PORT = 8080;
  process.env.ALGOD_TOKEN = "asdasdasda";

  process.env.NEXT_PUBLIC_INDEXER_SERVER = "http://indexer-server";
  process.env.NEXT_PUBLIC_INDEXER_PORT = 8080;
  process.env.NEXT_PUBLIC_INDEXER_TOKEN = "bbbadasda";

  const account = algosdk.generateAccount();
  const passphrase = algosdk.secretKeyToMnemonic(account.sk);

  // const api = initAPI('testnet');
  process.env.WALLET_MNEMONIC = passphrase;
  const wallet = await initWallet(algodexApiMock, account);
  const firstCall = algodexApiMock.setWallet.mock.calls[0][0];
  expect(firstCall.type).toEqual("sdk");
  expect(firstCall.address).toEqual(account);
  expect(firstCall.mnemonic).toEqual(passphrase);
  console.log(wallet);
  // const al
  // const algodexApiMock = {
  //   setWallet: jest.fn(input =>
  // }
});
