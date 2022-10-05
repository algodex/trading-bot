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
  const drawerWidth = 240;
  // Example for Changing Toolbar Height
  // const toolbarHeight = 200
  const toolbarHeight = undefined;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [drawerOpen, setDrawerOpen] = useState(false);
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
        data-testid="app-bar"
        position="static"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar
          isMobile={isMobile}
          toggleDrawer={toggleDrawer}
          height={toolbarHeight}
          {...componentsProps.Toolbar}
        />
      </AppBar>
      <Box sx={{ display: "flex", flex: 1, overflow: "auto" }}>
        {/* Display the Page Component */}
        <Container>{children}</Container>
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
