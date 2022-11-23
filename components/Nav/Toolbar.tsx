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

// MUI Components
import MUIToolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";

// Custom Language Selector
import LocaleNavMenu from "@/components/Nav/LocaleNavMenu";
import { Logo } from "../Logo";

//Algodex
import Link from "./Link";
import { link } from "./Drawer";

const styles = {
  linkStyles: {
    fontWeight: "700",
    marginRight: "1.6rem",
    textDecoration: "none",
    color: (theme: any) => theme.palette.primary.dark,
  },
};

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
  isTab,
  toggleDrawer,
  links,
  ...rest
}: {
  height?: number;
  onClick: () => void;
  isMobile: boolean;
  isTab: boolean;
  links: link[];
  toggleDrawer: () => void;
}) {
  return (
    <MUIToolbar sx={{ height, backgroundColor: "primary.main" }} {...rest}>
      <Box flex={1} display={"flex"} alignItems={"baseline"}>
        <Logo isTab={isTab} />
      </Box>
      {!isMobile && (
        <Box
          sx={{ display: "flex", alignItems: "center" }}
          data-testid="toolbar-links"
        >
          {links.map((item) => (
            <Link
              key={item.link}
              href={item.link}
              target="_blanc"
              sx={styles.linkStyles}
            >
              {item.text}
            </Link>
          ))}
        </Box>
      )}
      <LocaleNavMenu onClick={onClick} />
      {isMobile && (
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ ml: 2 }}
          onClick={toggleDrawer}
        >
          <MenuIcon />
        </IconButton>
      )}
    </MUIToolbar>
  );
}
export default Toolbar;
