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
exports.Layout = void 0;
const useMediaQuery_1 = __importDefault(require("@mui/material/useMediaQuery"));
const styles_1 = require("@mui/material/styles");
const AppBar_1 = __importDefault(require("@mui/material/AppBar"));
const Box_1 = __importDefault(require("@mui/material/Box"));
const Container_1 = __importDefault(require("@mui/material/Container"));
const prop_types_1 = __importDefault(require("prop-types"));
// Defaults
const Toolbar_1 = __importDefault(require("@/components/Nav/Toolbar"));
const react_1 = require("react");
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
function Layout({ children, components, componentsProps }) {
    const { Toolbar } = components;
    // Example for Changing Toolbar Height
    // const toolbarHeight = 200
    const toolbarHeight = undefined;
    const theme = (0, styles_1.useTheme)();
    const isMobile = (0, useMediaQuery_1.default)(theme.breakpoints.down("sm"));
    const [drawerOpen, setDrawerOpen] = (0, react_1.useState)(false);
    // Example of a Responsive Layout with Fixed Viewport
    return (<Box_1.default sx={{
            display: "flex",
            flexDirection: "column",
            height: "100vh",
            maxHeight: "-webkit-fill-available",
        }}>
      <AppBar_1.default data-testid="app-bar" position="static" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar isMobile={isMobile} height={toolbarHeight} {...componentsProps.Toolbar}/>
      </AppBar_1.default>
      <Box_1.default sx={{ display: "flex", flex: 1, overflow: "auto" }}>
        {/* Display the Page Component */}
        <Container_1.default sx={{
            "@media (min-width:1200px)": {
                maxWidth: "95vw !important",
            },
            "@media (min-width:1600px)": {
                maxWidth: "80vw !important",
            },
        }}>
          {children}
        </Container_1.default>
      </Box_1.default>
    </Box_1.default>);
}
exports.Layout = Layout;
Layout.propTypes = {
    components: prop_types_1.default.shape({
        Toolbar: prop_types_1.default.elementType.isRequired,
    }).isRequired,
};
Layout.defaultProps = {
    components: {
        Toolbar: Toolbar_1.default,
    },
    componentsProps: {
        Toolbar: {},
    },
};
exports.default = Layout;
