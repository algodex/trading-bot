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

import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import PropTypes from "prop-types";

// Defaults
import DefaultToolbar from "@/components/Nav/Toolbar";
import { useState } from "react";

/**
 * Layout Component
 *
 * Component includes three slots
 *
 * @param children
 * @param components
 * @param componentsProps
 * @returns {JSX.Element}
 * @constructor
 * @component
 */
export function Layout({ children, components, componentsProps }: any) {
  const { Toolbar } = components;
  // Example for Changing Toolbar Height
  // const toolbarHeight = 200
  const toolbarHeight = undefined;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [drawerOpen, setDrawerOpen] = useState(false);

  // Example of a Responsive Layout with Fixed Viewport
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        maxHeight: "-webkit-fill-available",
      }}
    >
      <AppBar
        data-testid="app-bar"
        position="static"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar
          isMobile={isMobile}
          height={toolbarHeight}
          {...componentsProps.Toolbar}
        />
      </AppBar>
      <Box sx={{ display: "flex", flex: 1, overflow: "auto" }}>
        {/* Display the Page Component */}
        <Container
          sx={{
            "@media (min-width:1200px)": {
              maxWidth: "95vw !important",
            },
            "@media (min-width:1600px)": {
              maxWidth: "80vw !important",
            },
          }}
        >
          {children}
        </Container>
      </Box>
    </Box>
  );
}

Layout.propTypes = {
  components: PropTypes.shape({
    Toolbar: PropTypes.elementType.isRequired,
  }).isRequired,
};

Layout.defaultProps = {
  components: {
    Toolbar: DefaultToolbar,
  },
  componentsProps: {
    Toolbar: {},
  },
};

export default Layout;
