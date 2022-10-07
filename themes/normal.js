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
      200:'#A1AEC0'
    },
    accent: {
      main: "#44C480",
      dark: "#579F6E",
      contrastText: "#FFFFFF",
    },
    error: {
      main: red.A400,
    },
  },
});

export default theme;
