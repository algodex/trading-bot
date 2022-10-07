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

const convertToDBObject = require("./convertToDBObject").default;

test("converts correctly", () => {
  process.env.ALGODEX_ALGO_ESCROW_APP = "22045503";

  const objExample = {
    address: "WYWRYK42XADLY3O62N52BOLT27DMPRA3WNBT2OBRT65N6OEZQWD4OSH6PI",
    escrowAddr: "WYWRYK42XADLY3O62N52BOLT27DMPRA3WNBT2OBRT65N6OEZQWD4OSH6PI",
    version: 6,
    price: 203.07776019802384,
    amount: 0.0489885786952751,
    asset: { id: 15322902, decimals: 6 },
    type: "buy",
    contract: {
      creator: "WYWRYK42XADLY3O62N52BOLT27DMPRA3WNBT2OBRT65N6OEZQWD4OSH6PI",
      lsig: {
        lsig: {
          logic: {
            toJSON: () => {
              return "some json";
            },
          },
        },
      },
      escrow: "SH2DVOXVJE6K57YWGEGXDMASHBCFXHVY667IZ27USKMAERDKXMJCSTIMJI",
    },
  };
  const obj = convertToDBObject(objExample);

  const objCheck = {
    address: "WYWRYK42XADLY3O62N52BOLT27DMPRA3WNBT2OBRT65N6OEZQWD4OSH6PI",
    escrowAddr: "WYWRYK42XADLY3O62N52BOLT27DMPRA3WNBT2OBRT65N6OEZQWD4OSH6PI",
    amount: 0.0489885786952751,
    appId: 22045503,
    asset: { id: 15322902, decimals: 6 },
    assetId: 15322902,
    contract: {
      creator: "WYWRYK42XADLY3O62N52BOLT27DMPRA3WNBT2OBRT65N6OEZQWD4OSH6PI",
      data: "some json",
      escrow: "SH2DVOXVJE6K57YWGEGXDMASHBCFXHVY667IZ27USKMAERDKXMJCSTIMJI",
    },
    price: 203.07776019802384,
    total: 9.948490836721096,
    type: "buy",
    unixTime: 1657922532,
    version: 6,
  };
  obj.unixTime = objCheck.unixTime;
  expect(obj).toEqual(objCheck);
});
