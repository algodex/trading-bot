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

import React, { useMemo, useState } from "react";
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
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

// Custom components
import { Note } from "./Note";
import CustomRangeSlider from "./CustomRangeSlider";
import { MnemonicModal } from "./MnemonicModal";
import { getWallet } from "@/lib/storage";
import { shortenAddress } from "@/lib/helper";

const MAINNET_LINK = process.env.NEXT_PUBLIC_MAINNET_LINK;
const TESTNET_LINK = process.env.NEXT_PUBLIC_TESTNET_LINK;
const ENABLE_NETWORK_SELECTION = TESTNET_LINK && MAINNET_LINK;
const environmentLinks = ["TESTNET", "MAINNET"];

const cardStyles = {
  border: "1px solid",
  borderColor: "grey.100",
  padding: "15px 20px",
  borderRadius: "3px",
  marginBlock: "20px",
  background: "transparent",
  boxShadow: "none",
  "&:before": {
    display: "none",
  },
};
export const BotForm = () => {
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = React.useState(false);
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);
  const environment = process.env.ENVIRONMENT || "TESTNET";
  const [environmentText, setEnvironmentText] = useState(
    environment.toUpperCase()
  );

  const walletAddress = useMemo(() => {
    return getWallet();
  }, [openModal]);

  const initialValues = {
    assetId: "",
    orderAlgoSize: 0,
    mnemonic: "",
    numOrders: 0,
    spreadPercent: 0,
    nearestKeep: 0,
    terms: true,
  };

  const validationSchema = yup.object().shape({
    assetId: yup
      .string()
      .label("Asset Id")
      .max(32, "Name must be less than 100 characters")
      .required("Required"),
    orderAlgoSize: yup
      .number()
      .positive("Invalid")
      .label("Order Size")
      .required("Required"),
    nearestKeep: yup.number().label("Nearest Keep").optional(),
    mnemonic: yup
      .string()
      .label("Password")
      .min(8, "Password must be more than 8 characters")
      .max(32, "Password must be less than 32 characters")
      .required("Required"),
    numOrders: yup
      .number()
      .label("Please confirm your password")
      .required("Required"),
    spreadPercent: yup
      .number()
      .label("Please add a spread")
      .required("Required"),
    terms: yup.boolean().label("Accept Terms").required("Required"),
  });

  const handleStart = (formValues: any) => {
    console.log(formValues);
  };

  const handleChange = ({ target: { value } }: SelectChangeEvent<string>) => {
    setEnvironmentText(value);
    // if (ENABLE_NETWORK_SELECTION) {
    // setEnvironmentText(value);
    //       if (value === "MAINNET") {
    //         window.location = `${MAINNET_LINK}`;
    //       } else {
    //         window.location = `${TESTNET_LINK}`;
    //       }
    // }
  };

  return (
    <>
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
                      <Button variant="outlined" onClick={handleOpenModal}>
                        {walletAddress
                          ? shortenAddress(walletAddress)
                          : "Input Mnemonic"}
                      </Button>
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
                <Typography
                  sx={{ pt: "5px", fontSize: "14px", marginBottom: "40px" }}
                >
                  *This bot currently uses Tinyman as a price oracle.
                </Typography>

                <Box sx={cardStyles}>
                  <Typography marginBottom={"20px"}>
                    Order Size (in ALGOs)
                    <InfoRoundedIcon
                      sx={{
                        marginLeft: "5px",
                        fontSize: "16px",
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
                    <Grid item lg={9} md={8} xs={12}>
                      <Field
                        component={CustomRangeSlider}
                        name="orderAlgoSize"
                        id="orderAlgoSize"
                        max={1000}
                      />
                      <Typography
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          fontSize: "13px",
                        }}
                      >
                        <span>0</span>
                        <span>1000</span>
                      </Typography>
                    </Grid>
                    <Grid item md={2} marginLeft={"auto"}>
                      <Field
                        component={CustomTextInput}
                        type="number"
                        name="orderAlgoSize"
                        id="orderAlgoSize"
                        max={1000}
                        required
                        sx={{
                          input: {
                            padding: "6.5px 14px",
                            width: "55px",
                          },
                        }}
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

                <Box sx={cardStyles}>
                  <Typography marginBottom={"20px"}>
                    Spread Percentage
                    <InfoRoundedIcon
                      sx={{
                        marginLeft: "5px",
                        fontSize: "16px",
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
                    <Grid item lg={9} md={8} xs={12}>
                      <Field
                        component={CustomRangeSlider}
                        name="spreadPercent"
                        id="spreadPercent"
                        max={100}
                      />
                      <Typography
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          fontSize: "13px",
                        }}
                      >
                        <span>0</span>
                        <span>100</span>
                      </Typography>
                    </Grid>
                    <Grid item md={2} marginLeft={"auto"}>
                      <Field
                        component={CustomTextInput}
                        type="number"
                        name="spreadPercent"
                        id="spreadPercent"
                        max={100}
                        required
                        sx={{
                          input: {
                            padding: "6.5px 14px",
                            width: "55px",
                          },
                        }}
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
                <Box sx={cardStyles}>
                  <Typography marginBottom={"20px"}>
                    Number of Orders
                    <InfoRoundedIcon
                      sx={{
                        marginLeft: "5px",
                        fontSize: "16px",
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
                    <Grid item lg={9} md={8} xs={12}>
                      <Field
                        component={CustomRangeSlider}
                        name="numOrders"
                        id="numOrders"
                        max={10}
                      />
                      <Typography
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          fontSize: "13px",
                        }}
                      >
                        <span>0</span>
                        <span>10</span>
                      </Typography>
                    </Grid>
                    <Grid item md={2} marginLeft={"auto"}>
                      <Field
                        component={CustomTextInput}
                        type="number"
                        name="numOrders"
                        id="numOrders"
                        max={10}
                        required
                        sx={{
                          input: {
                            padding: "6.5px 14px",
                            width: "55px",
                          },
                        }}
                      />
                    </Grid>
                  </Grid>
                </Box>
                <Accordion sx={cardStyles}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    sx={{
                      minHeight: 0,
                      padding: 0,
                      "&.Mui-expanded": {
                        minHeight: 0,
                        borderBottom: "solid 1px",
                        borderColor: "grey.100",
                        paddingBottom: "14px",
                      },
                      ".MuiAccordionSummary-content, .MuiAccordionSummary-content.Mui-expanded":
                        {
                          margin: 0,
                        },
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "20px",
                        fontWeight: 500,
                      }}
                    >
                      Advanced Options
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography marginBottom={"20px"}>
                      Nearest Neighbor Keep
                      <InfoRoundedIcon
                        sx={{
                          marginLeft: "5px",
                          fontSize: "16px",
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
                      <Grid item lg={9} md={8} xs={12}>
                        <Field
                          component={CustomRangeSlider}
                          name="nearestKeep"
                          id="nearestKeep"
                          max={10}
                        />
                        <Typography
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            fontSize: "13px",
                          }}
                        >
                          <span>0</span>
                          <span>10</span>
                        </Typography>
                      </Grid>
                      <Grid item md={2} marginLeft={"auto"}>
                        <Field
                          component={CustomTextInput}
                          type="number"
                          name="nearestKeep"
                          id="nearestKeep"
                          max={10}
                          required
                          sx={{
                            input: {
                              padding: "6.5px 14px",
                              width: "55px",
                            },
                          }}
                        />
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>
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

      <MnemonicModal open={openModal} handleClose={handleCloseModal} />
    </>
  );
};
