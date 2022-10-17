"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomPasswordInput = void 0;
const react_1 = __importDefault(require("react"));
// MUI components
const OutlinedInput_1 = __importDefault(require("@mui/material/OutlinedInput"));
const InputLabel_1 = __importDefault(require("@mui/material/InputLabel"));
const InputAdornment_1 = __importDefault(require("@mui/material/InputAdornment"));
const FormControl_1 = __importDefault(require("@mui/material/FormControl"));
const Visibility_1 = __importDefault(require("@mui/icons-material/Visibility"));
const VisibilityOff_1 = __importDefault(require("@mui/icons-material/VisibilityOff"));
const IconButton_1 = __importDefault(require("@mui/material/IconButton"));
const CustomPasswordInput = ({ passphrase, setPassphrase, }) => {
    return (<>
      <FormControl_1.default sx={{
            m: 0,
            width: "100%",
            input: {
                padding: "11.5px 14px",
            },
        }} variant="outlined">
        <InputLabel_1.default htmlFor="outlined-adornment-password" sx={{
            lineHeight: 1,
            fontSize: "0.8rem",
            "&.Mui-focused": {
                lineHeight: "1.4375em",
                color: "secondary.contrastText",
                opacity: 0.6,
            },
        }}>
          Passphrase
        </InputLabel_1.default>
        <OutlinedInput_1.default id="outlined-adornment-password" type={passphrase.show ? "text" : "password"} value={passphrase.password} onChange={({ target: { value } }) => {
            setPassphrase((prev) => ({
                ...prev,
                password: value,
            }));
        }} endAdornment={<InputAdornment_1.default position="end">
              <IconButton_1.default aria-label="toggle password visibility" onClick={() => {
                setPassphrase((prev) => ({
                    ...prev,
                    show: !prev.show,
                }));
            }} onMouseDown={(e) => {
                e.preventDefault();
            }} edge="end">
                {passphrase.show ? <VisibilityOff_1.default /> : <Visibility_1.default />}
              </IconButton_1.default>
            </InputAdornment_1.default>} label="Password"/>
      </FormControl_1.default>
    </>);
};
exports.CustomPasswordInput = CustomPasswordInput;
