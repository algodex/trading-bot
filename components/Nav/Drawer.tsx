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

import React, { ReactNode } from "react";

// MUI Components
import MUIDrawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

// Custom MUI Components
import ListItemLink from "@/components/Nav/ListItemLink";

export interface link {
  link: string;
  icon: ReactNode;
  text: string;
}

/**
 * Drawer
 * @component
 * @param width
 * @param offset
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
function Drawer({
  width,
  offset,
  links,
  toggleDrawer,
  open,
  ...props
}: {
  width: number;
  offset: number;
  links: link[];
  toggleDrawer: () => void;
  open: boolean;
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <MUIDrawer
      variant={isMobile ? "temporary" : "persistent"}
      anchor="left"
      open={open}
      sx={{
        width: open ? width : 0,
        flexShrink: 0,
        ["& .MuiDrawer-paper"]: { width, boxSizing: "border-box" },
      }}
      {...props}
    >
      {/* Add Toolbar for spacing */}
      <Toolbar sx={{ height: offset }} />
      <Box sx={{ overflow: "auto" }}>
        <List>
          {links.map((item) => (
            <ListItemLink
              key={item.link}
              to={item.link}
              icon={item.icon}
              primary={item.text}
              onClick={() => {
                if (toggleDrawer) {
                  toggleDrawer();
                }
              }}
            />
          ))}
        </List>
      </Box>
    </MUIDrawer>
  );
}

Drawer.defaultProps = {
  width: 250,
};
export default Drawer;
