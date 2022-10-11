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
const react_1 = __importDefault(require("react"));
// MUI Components
const Toolbar_1 = __importDefault(require("@mui/material/Toolbar"));
const Box_1 = __importDefault(require("@mui/material/Box"));
// Custom Language Selector
const LocaleNavMenu_1 = __importDefault(require("@/components/Nav/LocaleNavMenu"));
const Logo_1 = require("../Logo");
/**
 * Toolbar
 * @param height
 * @param rest
 * @returns {JSX.Element}
 * @constructor
 */
function Toolbar({ height, onClick, isMobile, ...rest }) {
    return (<Toolbar_1.default sx={{ height, backgroundColor: "primary.main" }} {...rest}>
      <Box_1.default flex={1} display={"flex"} alignItems={"baseline"}>
        <Logo_1.Logo isMobile={isMobile}/>
      </Box_1.default>
      <LocaleNavMenu_1.default onClick={onClick}/>
      {/* TODO: Make Menu Collapsable*/}
    </Toolbar_1.default>);
}
exports.default = Toolbar;
