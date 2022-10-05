import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { useState } from "react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { defaults } from "@/next-i18next.config";
import Head from "next/head";
import { BotForm } from "@/components/BotForm";

export async function getServerSideProps({ locale }: { locale: any }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [...defaults, "index"])),
    },
  };
}

const RegisterPage = () => {
  const { t } = useTranslation("index");
  const [loading, setLoading] = useState(false);

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
        <Grid item xs={12} md={6} lg={5} xl={4}>
          <BotForm />
        </Grid>
        <Grid item xs={12} md={6} lg={6} xl={5}>
          <Box>
            <TextField
              placeholder="MultiLine with rows: 2 and rowsMax: 4"
              multiline
              rows={20}
              // maxRows={20}
              fullWidth
            />
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default RegisterPage;
