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

import React from "react";
import PropTypes from "prop-types";

// MUI Components
import MUIToolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";

// Custom Language Selector
import LocaleNavMenu from "@/components/Nav/LocaleNavMenu";
import { Logo } from "../Logo";

/**
 * Toolbar
 * @param height
 * @param rest
 * @returns {JSX.Element}
 * @constructor
 */
function Toolbar({
  height,
  onClick,
  isMobile,
  ...rest
}: {
  height?: number;
  onClick: () => void;
  isMobile: boolean;
}) {
  return (
    <MUIToolbar sx={{ height, backgroundColor: "primary.main" }} {...rest}>
      <Box flex={1} display={"flex"} alignItems={"baseline"}>
        <Logo isMobile={isMobile} />
      </Box>
      <LocaleNavMenu onClick={onClick} />
      {/* TODO: Make Menu Collapsable*/}
    </MUIToolbar>
  );
}
export default Toolbar;
