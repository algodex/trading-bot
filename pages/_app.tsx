import type { AppProps } from "next/app";

import "@/styles/globals.css";
import PropTypes from "prop-types";
import Head from "next/head";
import { appWithTranslation } from "next-i18next";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { CacheProvider } from "@emotion/react";
import parser from "ua-parser-js";
import NextApp from "next/app";

import getTheme from "@/themes/getTheme";
import createEmotionCache from "@/utils/createEmotionCache";
import { Layout } from "@/components/Layout";

const theme = getTheme("normal");
// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

export function MyApp(props: any) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider
        theme={createTheme({
          ...theme,
          components: theme.components,
        })}
      >
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ThemeProvider>
    </CacheProvider>
  );
}
MyApp.getInitialProps = async (ctx: any) => {
  const initialProps = await NextApp.getInitialProps(ctx);
  const deviceType =
    parser(ctx.ctx.req.headers["user-agent"]).device.type || "desktop";
  return { pageProps: { ...initialProps, deviceType } };
};

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  emotionCache: PropTypes.object,
  pageProps: PropTypes.object.isRequired,
};

export default appWithTranslation(MyApp);
