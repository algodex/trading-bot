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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getServerSideProps = void 0;
const react_1 = require("react");
const next_i18next_1 = require("next-i18next");
const serverSideTranslations_1 = require("next-i18next/serverSideTranslations");
const next_i18next_config_1 = require("@/next-i18next.config");
const dynamic_1 = __importDefault(require("next/dynamic"));
const head_1 = __importDefault(require("next/head"));
const BotForm = (0, dynamic_1.default)(() => Promise.resolve().then(() => __importStar(require("@/components/BotForm"))).then((mod) => mod.BotForm), {
    ssr: false,
});
//MUI components
const TextField_1 = __importDefault(require("@mui/material/TextField"));
const Grid_1 = __importDefault(require("@mui/material/Grid"));
const Button_1 = __importDefault(require("@mui/material/Button"));
const Box_1 = __importDefault(require("@mui/material/Box"));
// import { BotForm } from "@/components/BotForm";
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
          <BotForm />
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
