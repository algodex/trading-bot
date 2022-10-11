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
exports.MyApp = void 0;
require("@/styles/globals.css");
const prop_types_1 = __importDefault(require("prop-types"));
const head_1 = __importDefault(require("next/head"));
const next_i18next_1 = require("next-i18next");
const styles_1 = require("@mui/material/styles");
const CssBaseline_1 = __importDefault(require("@mui/material/CssBaseline"));
const react_1 = require("@emotion/react");
const ua_parser_js_1 = __importDefault(require("ua-parser-js"));
const app_1 = __importDefault(require("next/app"));
const getTheme_1 = __importDefault(require("@/themes/getTheme"));
const createEmotionCache_1 = __importDefault(require("@/utils/createEmotionCache"));
const Layout_1 = require("@/components/Layout");
const theme = (0, getTheme_1.default)("normal");
// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = (0, createEmotionCache_1.default)();
function MyApp(props) {
    const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
    return (<react_1.CacheProvider value={emotionCache}>
      <head_1.default>
        <meta name="viewport" content="initial-scale=1, width=device-width"/>
      </head_1.default>
      <styles_1.ThemeProvider theme={(0, styles_1.createTheme)({
            ...theme,
            components: theme.components,
        })}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline_1.default />
        <Layout_1.Layout>
          <Component {...pageProps}/>
        </Layout_1.Layout>
      </styles_1.ThemeProvider>
    </react_1.CacheProvider>);
}
exports.MyApp = MyApp;
MyApp.getInitialProps = async (ctx) => {
    const initialProps = await app_1.default.getInitialProps(ctx);
    const deviceType = (0, ua_parser_js_1.default)(ctx.ctx.req.headers["user-agent"]).device.type || "desktop";
    return { pageProps: { ...initialProps, deviceType } };
};
MyApp.propTypes = {
    Component: prop_types_1.default.elementType.isRequired,
    emotionCache: prop_types_1.default.object,
    pageProps: prop_types_1.default.object.isRequired,
};
exports.default = (0, next_i18next_1.appWithTranslation)(MyApp);
