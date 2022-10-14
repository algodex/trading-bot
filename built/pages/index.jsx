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
exports.getServerSideProps = void 0;
const react_1 = require("react");
const next_i18next_1 = require("next-i18next");
const serverSideTranslations_1 = require("next-i18next/serverSideTranslations");
const next_i18next_config_1 = require("@/next-i18next.config");
const head_1 = __importDefault(require("next/head"));
const BotForm_1 = require("@/components/BotForm");
//MUI components
const TextField_1 = __importDefault(require("@mui/material/TextField"));
const Grid_1 = __importDefault(require("@mui/material/Grid"));
const Button_1 = __importDefault(require("@mui/material/Button"));
const Box_1 = __importDefault(require("@mui/material/Box"));
async function getServerSideProps({ locale }) {
    return {
        props: {
            ...(await (0, serverSideTranslations_1.serverSideTranslations)(locale, [...next_i18next_config_1.defaults, "index"])),
        },
    };
}
exports.getServerSideProps = getServerSideProps;
const RegisterPage = () => {
    const { t } = (0, next_i18next_1.useTranslation)("index");
    const [loading, setLoading] = (0, react_1.useState)(false);
    return (<>
      <head_1.default>
        <title>{t("title")}</title>
      </head_1.default>
      <Grid_1.default container spacing={9} sx={{
            paddingBlock: "40px",
        }}>
        <Grid_1.default item xs={12} md={6} lg={5} xl={4}>
          <BotForm_1.BotForm />
        </Grid_1.default>
        <Grid_1.default item xs={12} md={6} lg={6} xl={5}>
          <TextField_1.default placeholder="MultiLine with rows: 2 and rowsMax: 4" multiline rows={20} 
    // maxRows={20}
    fullWidth/>

          <Box_1.default sx={{ textAlign: "end" }}>
            <Button_1.default variant="outlined" sx={{ marginTop: "10px" }}>
              CLEAR LOGS
            </Button_1.default>
          </Box_1.default>
        </Grid_1.default>
      </Grid_1.default>
    </>);
};
exports.default = RegisterPage;
