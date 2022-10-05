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
  palette: {
    primary: {
      main: "#D8DEE7",
      dark: "#718096",
      contrastText: "#1A202C",
    },
    secondary: {
      main: "#cc4444",
    },
    background: {
      default: "#f5f5f5",
    },
    accent: {
      main: '#44C480',
      dark: '#579F6E',
      contrastText: '#FFFFFF',
    },
    error: {
      main: red.A400,
    },
  },
});

export default theme;
