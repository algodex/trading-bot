import React, { useState } from "react";
import { Field, Form, Formik } from "formik";
import * as yup from "yup";
import { LoadingButton } from "@mui/lab";
import { useRouter } from "next/router";
import CustomTextInput from "./CustomTextInput";

//MUI Components
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import LaunchIcon from "@mui/icons-material/Launch";
import Link from "@mui/material/Link";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import { Note } from "./Note";

const MAINNET_LINK = process.env.NEXT_PUBLIC_MAINNET_LINK;
const TESTNET_LINK = process.env.NEXT_PUBLIC_TESTNET_LINK;
const ENABLE_NETWORK_SELECTION = TESTNET_LINK && MAINNET_LINK;
const environmentLinks = ["TESTNET", "MAINNET"];

const cardStyles = {
  border: "1px solid",
  borderColor: "grey.main",
  padding: "15px 20px",
  borderRadius: "3px",
  marginBlock: "20px",
};
export const BotForm = () => {
  const router = useRouter();
  const CURRENT_PAGE = router.pathname;
  const [loading, setLoading] = useState(false);
  const environment = process.env.ENVIRONMENT || "TESTNET";
  const [environmentText, setEnvironmentText] = useState(
    environment.toUpperCase()
  );

  const initialValues = {
    assetId: "",
    orderAlgoSize: "",
    mnemonic: "",
    numOrders: "",
    spreadPercent: "",
    terms: true,
  };

  const validationSchema = yup.object().shape({
    assetId: yup
      .string()
      .label("Asset Id")
      .max(32, "Name must be less than 100 characters")
      .required(),
    orderAlgoSize: yup
      .string()
      .label("Email")
      .email("Email is invalid")
      .required(),
    mnemonic: yup
      .string()
      .label("Password")
      .min(8, "Password must be more than 8 characters")
      .max(32, "Password must be less than 32 characters")
      .required(),
    numOrders: yup.string().label("Please confirm your password").required(),
    spreadPercent: yup.string().label("Please add a spread").required(),
    terms: yup.boolean().label("Accept Terms").required(),
  });

  const handleStart = (formValues: any) => {
    console.log(formValues);
  };

  const handleChange = ({ target: { value } }: SelectChangeEvent<string>) => {
    if (ENABLE_NETWORK_SELECTION) {
      setEnvironmentText(value);
      //       if (value === "MAINNET") {
      //         window.location = `${MAINNET_LINK}${CURRENT_PAGE}`;
      //       } else {
      //         window.location = `${TESTNET_LINK}${CURRENT_PAGE}`;
      //       }
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleStart}
      validateOnBlur={false}
    >
      {({ handleSubmit, isValid }) => {
        return (
          <Form onSubmit={handleSubmit}>
            <>
              <Grid
                container
                sx={{
                  alignItems: "center",
                  rowGap: "5px",
                  marginBottom: "20px",
                }}
              >
                <Grid item md={3} xs={12}>
                  <Select
                    className="environment-select-wrapper"
                    value={environmentText}
                    onChange={handleChange}
                    inputProps={{ "aria-label": "Without label" }}
                    sx={{
                      fontSize: "14px",
                      fontWeight: 600,
                      color:
                        environmentText === "TESTNET"
                          ? "accent.main"
                          : "error.main",
                      border: "none",
                      ".MuiOutlinedInput-input": {
                        padding: "0.4rem 1.7rem",
                        paddingLeft: "0.8rem",
                      },
                      ".MuiOutlinedInput-notchedOutline": {
                        borderWidth: "2px",
                        borderColor:
                          environmentText === "TESTNET"
                            ? "accent.main"
                            : "error.main",
                      },
                    }}
                  >
                    {environmentLinks.map((environment) => (
                      <MenuItem key={environment} value={environment}>
                        {environment}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
                <Grid item md={8} xs={12} marginLeft={"auto"}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      columnGap: "9px",
                      flexWrap: "wrap",
                    }}
                  >
                    <Typography sx={{ fontWeight: 600, fontSize: "17px" }}>
                      Connected Wallet:
                    </Typography>
                    <Button variant="outlined">Input Mnemonic</Button>
                  </Box>
                </Grid>
              </Grid>
              <Grid container sx={{ alignItems: "center", rowGap: "5px" }}>
                <Grid item md={7} xs={12}>
                  <Field
                    component={CustomTextInput}
                    placeholder="Asset ID"
                    type="email"
                    name="assetId"
                    label="Asset Id"
                    id="assetId"
                    required
                  />
                </Grid>
                <Grid item md={4} marginLeft={"auto"}>
                  <Link
                    href="https://algodex.com"
                    target={"_blank"}
                    rel="noreferrer"
                    sx={{
                      color: "secondary.contrastText",
                      display: "flex",
                      alignItems: "center",
                      textDecoration: "underline",
                      fontWeight: 500,
                    }}
                  >
                    View in Algodex
                    <LaunchIcon sx={{ fontSize: "14px", ml: "5px" }} />
                  </Link>
                </Grid>
              </Grid>
              <Typography sx={{ pt: "5px", fontSize: "14px", marginBottom:'40px' }}>
                *This bot currently uses Tinyman as a price oracle.
              </Typography>

              <Box sx={cardStyles}>
                <Typography marginBottom={"20px"}>
                  Order Size (in ALGOs)
                  <InfoRoundedIcon
                    sx={{
                      marginLeft: "5px",
                      fontSize: "14px",
                      color: "secondary.dark",
                    }}
                  />
                </Typography>
                <Grid
                  container
                  sx={{
                    alignItems: "center",
                    rowGap: "5px",
                    marginBottom: "20px",
                  }}
                >
                  <Grid item md={9} xs={12}>
                    <Field
                      component={CustomTextInput}
                      placeholder="Asset ID"
                      type="email"
                      name="assetId"
                      label="Asset Id"
                      id="assetId"
                      required
                    />
                  </Grid>
                  <Grid item md={2} xs={12} marginLeft={"auto"}>
                    <Field
                      component={CustomTextInput}
                      placeholder="Asset ID"
                      type="email"
                      name="assetId"
                      label="Asset Id"
                      id="assetId"
                      required
                    />
                  </Grid>
                </Grid>
                <Note
                  note="These settings qualify for ALGX Rewards."
                  link={{
                    url: "https://docs.algodex.com/rewards-program/algx-liquidity-rewards-program",
                    title: "Read about Rewards Calcuations",
                  }}
                />
              </Box>
              <LoadingButton
                variant="contained"
                fullWidth
                type="submit"
                loading={loading}
                disabled={loading || !isValid}
                sx={{ py: "0.8rem", mt: "1rem" }}
              >
                Start Bot
              </LoadingButton>
            </>
          </Form>
        );
      }}
    </Formik>
  );
};
