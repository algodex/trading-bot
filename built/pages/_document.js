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
const React = __importStar(require("react"));
const document_1 = __importStar(require("next/document"));
const create_instance_1 = __importDefault(require("@emotion/server/create-instance"));
const getTheme_1 = __importDefault(require("@/themes/getTheme"));
const createEmotionCache_1 = __importDefault(require("@/utils/createEmotionCache"));
const theme = (0, getTheme_1.default)('dark');
class MyDocument extends document_1.default {
    render() {
        return (<document_1.Html lang="en">
        <document_1.Head>
          {/* PWA primary color */}
          <meta name="theme-color" content={theme.palette.primary.main}/>
          <link rel="shortcut icon" href="/favicon.ico"/>
          <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"/>
          {/* Inject MUI styles first to match with the prepend: true configuration. */}
          {this.props.emotionStyleTags}
        </document_1.Head>
        <body>
          <document_1.Main />
          <document_1.NextScript />
        </body>
      </document_1.Html>);
    }
}
exports.default = MyDocument;
MyDocument.getInitialProps = async (ctx) => {
    const originalRenderPage = ctx.renderPage;
    const cache = (0, createEmotionCache_1.default)();
    const { extractCriticalToChunks } = (0, create_instance_1.default)(cache);
    ctx.renderPage = () => originalRenderPage({
        enhanceApp: (App) => function EnhanceApp(props) {
            return <App emotionCache={cache} {...props}/>;
        },
    });
    const initialProps = await document_1.default.getInitialProps(ctx);
    const emotionStyles = extractCriticalToChunks(initialProps.html);
    const emotionStyleTags = emotionStyles.styles.map((style) => (<style data-emotion={`${style.key} ${style.ids.join(' ')}`} key={style.key} 
    // eslint-disable-next-line react/no-danger
    dangerouslySetInnerHTML={{ __html: style.css }}/>));
    return {
        ...initialProps,
        emotionStyleTags,
    };
};
