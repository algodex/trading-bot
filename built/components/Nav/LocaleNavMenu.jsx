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
exports.LocaleNavMenu = void 0;
const react_1 = __importDefault(require("react"));
const prop_types_1 = __importDefault(require("prop-types"));
const router_1 = require("next/router");
const next_i18next_config_1 = require("next-i18next.config");
// MUI Components
const Button_1 = __importDefault(require("@mui/material/Button"));
const ClickAwayListener_1 = __importDefault(require("@mui/material/ClickAwayListener"));
const Grow_1 = __importDefault(require("@mui/material/Grow"));
const Paper_1 = __importDefault(require("@mui/material/Paper"));
const Popper_1 = __importDefault(require("@mui/material/Popper"));
const MenuList_1 = __importDefault(require("@mui/material/MenuList"));
// Icons
const react_country_flag_1 = __importDefault(require("react-country-flag"));
// Custom Components
const MenuItemLink_1 = __importDefault(require("@/components/Nav/MenuItemLink"));
const material_1 = require("@mui/material");
// Map locale code to the flag used in 'react-country-flag'
const localeToFlags = {
    ca: "CA",
    en: "US",
    es: "MX",
    nl: "NL",
    ch: "CN",
    tr: "TR",
    vn: "VN",
    id: "ID",
    iq: "IQ",
    my: "MY",
    ir: "IR",
    it: "IT",
    jp: "JP",
    ru: "RU",
    se: "SE",
    sk: "SK",
    hu: "HU",
    no: "NO",
    ct: "ES-CT",
    th: "TH",
    in: "IN",
    de: "DE",
    kr: "KR",
    fr: "FR",
    pl: "PL",
};
/**
 * LanguageNavMenu
 * @component
 * @param onClick
 * @returns {JSX.Element}
 * @constructor
 */
const LocaleNavMenu = ({ onClick }) => {
    const { asPath, locale } = (0, router_1.useRouter)();
    const [open, setOpen] = react_1.default.useState(false);
    const anchorRef = react_1.default.useRef(null);
    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };
    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }
        setOpen(false);
    };
    const handleListKeyDown = (event) => {
        if (event.key === "Tab") {
            event.preventDefault();
            setOpen(false);
        }
        else if (event.key === "Escape") {
            setOpen(false);
        }
    };
    // return focus to the button when we transitioned from !open -> open
    const prevOpen = react_1.default.useRef(open);
    react_1.default.useEffect(() => {
        if (prevOpen.current === true && open === false) {
            anchorRef.current.focus();
        }
        prevOpen.current = open;
    }, [open]);
    return (<>
      <Button_1.default data-testid="dropdown-container-web" variant="contained" color={"secondary"} sx={{
            backgroundColor: "primary.dark",
        }} ref={anchorRef} id="composition-button" aria-controls={open ? "composition-menu" : undefined} aria-expanded={open ? "true" : undefined} aria-haspopup="true" onClick={handleToggle}>
        <material_1.Typography marginRight={"5px"} color={"primary.contrastext"} fontWeight={"700"} fontSize={"0.9rem"}>
          {locale}{" "}
        </material_1.Typography>{" "}
        <react_country_flag_1.default countryCode={localeToFlags[locale]} svg style={{
            fontSize: "1.4rem",
        }}/>
      </Button_1.default>

      <Popper_1.default open={open} anchorEl={anchorRef.current} role={undefined} placement="bottom-start" transition disablePortal>
        {({ TransitionProps, placement }) => (<Grow_1.default {...TransitionProps} style={{
                transformOrigin: placement === "bottom-start" ? "left top" : "left bottom",
            }}>
            <Paper_1.default>
              <ClickAwayListener_1.default onClickAway={handleClose}>
                <MenuList_1.default autoFocusItem={open} id="composition-menu" aria-labelledby="composition-button" onKeyDown={handleListKeyDown}>
                  {next_i18next_config_1.i18n.locales
                .filter((localeCd) => localeCd !== locale)
                .map((localeCd) => (<MenuItemLink_1.default to={asPath} locale={localeCd} key={localeCd} primary={localeCd} icon={<react_country_flag_1.default countryCode={localeToFlags[localeCd]} svg/>} data-testid="dropdown-item-web"></MenuItemLink_1.default>))}
                </MenuList_1.default>
              </ClickAwayListener_1.default>
            </Paper_1.default>
          </Grow_1.default>)}
      </Popper_1.default>
    </>);
};
exports.LocaleNavMenu = LocaleNavMenu;
exports.LocaleNavMenu.propTypes = {
    /**
     * onClick
     */
    onClick: prop_types_1.default.func,
};
exports.LocaleNavMenu.displayName = "LanguageSelection";
exports.default = exports.LocaleNavMenu;
