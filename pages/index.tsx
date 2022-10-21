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

import React from "react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { defaults } from "@/next-i18next.config";
import Head from "next/head";
import { BotForm } from "@/components/BotForm";

//MUI components
import Grid from "@mui/material/Grid";
import { LogOutput } from "@/components/LogOutput";

export async function getServerSideProps({ locale }: { locale: any }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [...defaults, "index"])),
    },
  };
}

const RegisterPage = () => {
  const { t } = useTranslation("index");

  return (
    <>
      <Head>
        <title>{t("title")}</title>
      </Head>
      <Grid
        container
        spacing={9}
        sx={{
          paddingBlock: "40px",
        }}
      >
        <Grid item xs={12} sm={10} marginX="auto" md={6} lg={6} xl={6}>
          <BotForm />
        </Grid>
        <Grid item xs={12} sm={10} marginX="auto" md={6} lg={6} xl={6}>
          <LogOutput />
        </Grid>
      </Grid>
    </>
  );
};

export default RegisterPage;
