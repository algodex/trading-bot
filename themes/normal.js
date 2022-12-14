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

import { createTheme } from "@mui/material/styles";
import { red } from "@mui/material/colors";

const fontFamilies = {
  heading: "'Alliance No.1', Inter, sans-serif",
  body: "Inter, sans-serif",
  monospace: "'Roboto Mono', monospace",
};

// Regular Colors
const theme = createTheme({
  typography: {
    fontFamily: [fontFamilies.body],
  },
  components: {
    MuiButton: {
      styleOverrides: {
        contained: {
          backgroundColor: "#579F6E",
          color: "#FFFFFF",
          "&:hover": {
            backgroundColor: "#579F6E",
            boxShadow:
              "0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px rgba(0, 0, 0, 0.14), 0px 1px 5px rgba(0, 0, 0, 0.12)",
          },
        },
        outlined: {
          backgroundColor: "transparent",
          borderColor: "#000000",
          color: "#000000",
          borderWidth: "2px",
          paddingBlock: "2px",
          "&:hover": {
            backgroundColor: "#000000",
            color: "#D8DEE7",
            borderWidth: "2px",
          },
        },
      },
    },
  },
  palette: {
    primary: {
      main: "#D8DEE7",
      dark: "#718096",
      contrastText: "#1A202C",
    },
    secondary: {
      main: "#cc4444",
      dark: "#4A5568",
      contrastText: "#000000",
    },
    background: {
      default: "#f5f5f5",
    },
    grey: {
      100: "#D9D9D9",
      200: "#A1AEC0",
      300: "#CAD1DA",
    },
    blue: {
      main: "#2d75d6",
      dark: "#2D3748",
    },
    accent: {
      main: "#44C480",
      dark: "#579F6E",
      dark600: '#255C46',
      contrastText: "#FFFFFF",
    },
    dark600:{
      main: '#255C46',
    },
    error: {
      main: "#B82828",
      dark: "#EB5757",
    },
  },
});

export default theme;
