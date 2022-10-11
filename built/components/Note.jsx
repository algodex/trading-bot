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
exports.Note = void 0;
const react_1 = __importDefault(require("react"));
// Material UI components
const Typography_1 = __importDefault(require("@mui/material/Typography"));
const Box_1 = __importDefault(require("@mui/material/Box"));
const CheckCircleOutlineRounded_1 = __importDefault(require("@mui/icons-material/CheckCircleOutlineRounded"));
const Link_1 = __importDefault(require("./Nav/Link"));
const Note = ({ link, icon: IconComponent, note, styles, }) => {
    return (<Box_1.default sx={{
            backgroundColor: "primary.main",
            color: "primary.contrastText",
            borderRadius: "3px",
            padding: "7px 12px",
            display: "flex",
            fontSize: "13px",
            alignItems: "flex-start",
            ...styles,
        }}>
      {IconComponent == "Empty" ? (<></>) : IconComponent ? (<IconComponent />) : (<CheckCircleOutlineRounded_1.default sx={{ marginRight: "5px", fontSize: "15px", marginTop: '3px' }}/>)}
      <Box_1.default>
        {note && (<Typography_1.default fontSize={"14px"} fontWeight={700} fontStyle="italic">
            {note}{" "}
            {link && (<Link_1.default href={link.url} target={"_blanc"} sx={{
                    color: "accent.dark",
                }}>
                {link.title}
              </Link_1.default>)}
          </Typography_1.default>)}
      </Box_1.default>
    </Box_1.default>);
};
exports.Note = Note;
