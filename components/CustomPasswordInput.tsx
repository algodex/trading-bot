import React from "react";

// MUI components
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";

export interface passPhrase {
  password: string;
  show: boolean;
}

export const CustomPasswordInput = ({
  passphrase,
  setPassphrase,
}: {
  passphrase: passPhrase;
  setPassphrase: Function;
}) => {
  return (
    <>
      <FormControl
        sx={{
          m: 0,
          width: "100%",
          input: {
            padding: "11.5px 14px",
          },
        }}
        variant="outlined"
      >
        <InputLabel
          htmlFor="outlined-adornment-password"
          sx={{
            lineHeight: 1,
            fontSize: "0.8rem",
            "&.Mui-focused": {
              lineHeight: "1.4375em",
              color: "secondary.contrastText",
              opacity: 0.6,
            },
          }}
        >
          Passphrase
        </InputLabel>
        <OutlinedInput
          id="outlined-adornment-password"
          type={passphrase.show ? "text" : "password"}
          value={passphrase.password}
          onChange={({ target: { value } }) => {
            setPassphrase((prev: passPhrase) => ({
              ...prev,
              password: value,
            }));
          }}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={() => {
                  setPassphrase((prev: passPhrase) => ({
                    ...prev,
                    show: !prev.show,
                  }));
                }}
                onMouseDown={(e) => {
                  e.preventDefault();
                }}
                edge="end"
              >
                {passphrase.show ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
          label="Password"
        />
      </FormControl>
    </>
  );
};
