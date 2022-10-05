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
  onClick: Function;
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
