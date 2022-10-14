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
exports.Logo = void 0;
const material_1 = require("@mui/material");
const image_1 = __importDefault(require("next/image"));
const react_1 = __importDefault(require("react"));
// custom components
const Link_1 = __importDefault(require("./Nav/Link"));
const Logo = ({ styles, isMobile, }) => {
    return (<div style={styles}>
      <Link_1.default href="/" sx={{
            display: "flex",
            alignItems: "baseline",
            textDecoration: "none",
            color: "#1A202C",
        }}>
        {isMobile ? (<image_1.default src="/algodex-icon.svg" alt="Algodex Icon Logo" width="24" height="24"/>) : (<image_1.default src="/algodex-logo.svg" alt="Algodex Logo" width="160" height="30"/>)}
        <material_1.Typography fontWeight={700} fontSize={"18px"} marginLeft={"10px"}>
        Trading Bot
        </material_1.Typography>
      </Link_1.default>
    </div>);
};
exports.Logo = Logo;
