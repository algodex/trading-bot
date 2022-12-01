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

import React, { useState } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import PropTypes from "prop-types";

// Defaults
import DefaultToolbar from "@/components/Nav/Toolbar";
import Drawer from "./Nav/Drawer";

// Icons
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import OutboxIcon from "@mui/icons-material/Outbox";
import ArticleIcon from "@mui/icons-material/Article";
import HelpCenterIcon from "@mui/icons-material/HelpCenter";
import { Footer } from "./footer";

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

const Links = [
  {
    text: "TRADE",
    icon: <TrendingDownIcon />,
    link: "https://app.algodex.com/trade",
  },
  {
    text: "DOCS",
    icon: <ArticleIcon />,
    link: "https://docs.algodex.com",
  },
  {
    text: "SUPPORT",
    icon: <HelpCenterIcon />,
    link: "https://app.algodex.com/support",
  },
  {
    text: "REWARDS",
    icon: <OutboxIcon />,
    link: "https://rewards.algodex.com/",
  },
];

export function Layout({ children, components, componentsProps }: any) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { Toolbar } = components;
  // Example for Changing Toolbar Height
  // const toolbarHeight = 200
  const toolbarHeight = undefined;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTab = useMediaQuery(theme.breakpoints.down("md"));

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

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
        position="static"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar
          isMobile={isMobile}
          toggleDrawer={toggleDrawer}
          links={Links}
          isTab={isTab}
          height={toolbarHeight}
          {...componentsProps.Toolbar}
        />
      </AppBar>
      <Box sx={{ display: "flex", flex: 1, overflow: "auto" }}>
        <Drawer
          open={drawerOpen && isMobile}
          links={Links}
          {...componentsProps.Drawer}
        />
        {/* Display the Page Component */}
        <Container
          sx={{
            "@media (min-width:1200px)": {
              maxWidth: "95vw !important",
            },
            // "@media (min-width:1600px)": {
            //   maxWidth: "80vw !important",
            // },
          }}
        >
          <Box sx={{ paddingBottom: "40px" }}>{children}</Box>
          <Footer />
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
