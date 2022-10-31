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

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Field, Form, Formik, FormikValues } from "formik";
import * as yup from "yup";
import runLoop, { stopLoop } from "@/lib/runLoop";
import PouchDB from "pouchdb";
import dynamic from "next/dynamic";

//MUI Components
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import LaunchIcon from "@mui/icons-material/Launch";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LoadingButton from "@mui/lab/LoadingButton";
import Button from "@mui/material/Button";
import Tooltip, { tooltipClasses, TooltipProps } from "@mui/material/Tooltip";
import styled from "@emotion/styled";

// Custom components and hooks
import { Note } from "./Note";
import CustomRangeSlider from "./CustomRangeSlider";
import CustomTextInput from "./CustomTextInput";
import initAPI from "@/lib/initAPI";
import { BotConfig, Environment } from "@/lib/types/config";
import { PassPhrase } from "./CustomPasswordInput";
import { ValidateWallet } from "./validateWallet";
import { AssetSearchInput } from "./AssetSearchInput";
import { getAccountInfo, getTinymanAssets } from "@/lib/helper";
import getAssetInfo from "@/lib/getAssetInfo";
import algosdk from "algosdk";
import { getWallet } from "@/lib/storage";
import { usePriceConversionHook } from "@/hooks/usePriceConversionHook";

const WalletButton: any = dynamic(
  () =>
    import("@/components/walletButton").then((mod: any) => mod.WalletButton),
  {
    ssr: false,
  }
);

interface AssetSchema {
  "asset-id": number | string;
  amount: number;
  "is-frozen": boolean;
  name?: string;
}

const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }}></Tooltip>
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: (theme as any).palette.secondary.dark,
  },
}));

const environmentLinks = ["testnet", "mainnet"];

export const cardStyles = {
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

const percentStyles: any = {
  position: "absolute",
  right: "16px",
  top: "9px",
  fontSize: "12px",
};

export const BotForm = () => {
  const [loading, setLoading] = useState(false);
  const [environment, setEnvironment] = useState<any | Environment>(
    process.env.NEXT_PUBLIC_ENVIRONMENT || "testnet"
  );
  const [config, setConfig] = useState<null | BotConfig>();
  const [passphrase, setPassphrase] = useState<PassPhrase>({
    password: "",
    show: false,
  });
  const formikRef = useRef<any>();
  const [openModal, setOpenModal] = useState(false);
  const [openMnemonic, setOpenMnemonic] = useState<string | null>(null);
  const [visibleBalance, setVisibleBalance] = useState<AssetSchema[]>([]);
  const [walletAddr, setWalletAddr] = useState(getWallet());
  const [mnemonic, setMnemonic] = useState("");
  const [formError, setFormError] = useState("");
  const { conversionRate } = usePriceConversionHook({ env: environment });

  const initialValues = {
    assetId: "",
    orderAlgoDepth: 25000,
    ladderTiers: 3,
    minSpreadPerc: 0.25,
    nearestNeighborKeep: 0.125,
  };

  const validationSchema = yup.object().shape({
    assetId: yup
      .number()
      .positive("Invalid")
      .label("Asset Id")
      .required("Required"),
    orderAlgoDepth: yup
      .number()
      .positive("Invalid")
      .max(10000000)
      .min(1)
      .label("Order Size")
      .required("Required"),
    nearestNeighborKeep: yup
      .number()
      .positive("Invalid")
      .min(0)
      .label("Nearest Keep")
      .optional(),
    ladderTiers: yup
      .number()
      .positive("Invalid")
      .min(1)
      .max(15)
      .label("Order")
      .required("Required"),
    minSpreadPerc: yup
      .number()
      .positive("Invalid")
      .min(0.01)
      .max(5)
      .label("Spread")
      .required("Required"),
  });

  const handleStart = (formValues: FormikValues) => {
    const assetId = formValues.assetId;
    if (!lowBalance(assetId)) {
      if (!walletAddr) {
        setOpenMnemonic("mnemonic");
      } else if (walletAddr && !mnemonic) {
        validateWallet();
      } else if (walletAddr && mnemonic) {
        try {
          const pouchUrl = process.env.POUCHDB_URL
            ? process.env.POUCHDB_URL + "/"
            : "";
          const fullPouchUrl =
            pouchUrl +
            "market_maker_" +
            formValues.assetId +
            "_" +
            walletAddr.slice(0, 8).toLowerCase();
          const escrowDB = new PouchDB(fullPouchUrl);
          const api = initAPI(environment);
          const _config = {
            ...(formValues as any),
            assetId,
            walletAddr,
            environment,
            useTinyMan: true,
            api,
            escrowDB,
            mnemonic,
          };

          stopLoop({ resetExit: true });
          setConfig(_config);
          setLoading(true);
          runLoop({
            config: _config,
            assetInfo: null,
            lastBlock: 0,
            runState: {
              isExiting: false,
              inRunLoop: false,
            },
          });
        } catch (error) {
          setLoading(false);
          console.error(error);
        }
      }
    }
  };

  const stopBot = () => {
    if (config) {
      stopLoop({ config });
      setLoading(false);
    }
  };

  const handleChange = ({ target: { value } }: SelectChangeEvent<string>) => {
    if (!loading) {
      setEnvironment(value);
      setVisibleBalance([]);
    }
  };

  const validateWallet = useCallback(() => {
    if (walletAddr && !mnemonic) {
      setOpenModal(true);
    }
  }, [walletAddr, mnemonic]);

  const handleClose = useCallback((mnemonic?: string) => {
    setOpenModal(false);
    if (mnemonic) {
      setMnemonic(mnemonic);
    }
  }, []);

  useEffect(() => {
    validateWallet();
  }, [validateWallet]);

  const updateASAInfo = useCallback(
    async (ASAs: AssetSchema[]) => {
      const url =
        environment === "testnet"
          ? "https://algoindexer.testnet.algoexplorerapi.io"
          : "https://algoindexer.algoexplorerapi.io";
      const indexerClient = new algosdk.Indexer("", url, 443);

      const result: any = await Promise.all(
        ASAs.map(async (asset) => {
          try {
            if (asset["asset-id"] === "ALGO") {
              return { ...asset, name: asset["asset-id"] };
            }
            const res = await getAssetInfo({
              indexerClient,
              assetId: asset["asset-id"] as number,
            });

            return { ...asset, name: res.asset.params.name };
          } catch (error) {
            console.error(error);
          }
        })
      );
      setVisibleBalance(result);
    },
    [environment]
  );

  const getAccount = useCallback(
    async (assetId: number) => {
      if (walletAddr && assetId) {
        if (await presentOnTinyman(assetId)) {
          try {
            const res = await getAccountInfo(walletAddr, environment);
            const ASAs = res.data.assets;
            const currentASA = ASAs.find(
              (asset: AssetSchema) => asset["asset-id"] === assetId
            );
            const algoBalance = {
              amount: res.data.amount / 1000000,
              "asset-id": "ALGO",
              "is-frozen": false,
            };
            if (currentASA) {
              const val = [
                algoBalance,
                {
                  ...currentASA,
                  amount: currentASA.amount / 1000000,
                },
              ];
              setVisibleBalance(val);
              updateASAInfo(val);
            } else {
              setVisibleBalance([algoBalance]);
            }
          } catch (error) {
            console.error(error);
          }
        } else {
          setFormError("This asset is not present on Tinyman");
        }
      } else {
        setVisibleBalance([]);
      }
    },
    [walletAddr, environment, updateASAInfo]
  );

  useEffect(() => {
    if (walletAddr && formikRef.current?.values?.assetId) {
      getAccount(formikRef.current?.values?.assetId);
    } else {
      setVisibleBalance([]);
    }
  }, [getAccount, walletAddr, environment]);

  const lowBalance = (assetId: number) => {
    if (assetId && visibleBalance.length > 0) {
      const found = visibleBalance.find(
        (asset) => asset["asset-id"] === assetId
      );
      // const algoBal = visibleBalance.find(
      //   (asset) => asset["asset-id"] === "ALGO"
      // );
      if (found) {
        return false;
        // if (found.amount > 20 && algoBal && algoBal?.amount > 20) {
        //   return false;
        // } else {
        //   setFormError(
        //     "This ASA‘s liquidity is too low on Tinyman to use this bot"
        //   );
        //   return true;
        // }
      } else {
        setFormError("You need to have this asset in your wallet holdings");
        return true;
      }
    }
    return false;
  };

  const presentOnTinyman = async (assetId: number) => {
    const res = await getTinymanAssets(environment);
    if (res[assetId]) return true;
    return false;
  };
  return (
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
            value={environment}
            onChange={handleChange}
            inputProps={{ "aria-label": "Without label" }}
            sx={{
              fontSize: "14px",
              fontWeight: 600,
              color: environment === "testnet" ? "accent.main" : "blue.main",
              border: "none",
              ".MuiOutlinedInput-input": {
                padding: "0.4rem 1.7rem",
                paddingLeft: "0.8rem",
              },
              ".MuiOutlinedInput-notchedOutline": {
                borderWidth: "2px",
                borderColor:
                  environment === "testnet" ? "accent.main" : "blue.main",
              },
            }}
          >
            {environmentLinks.map((environment) => (
              <MenuItem key={environment} value={environment}>
                {environment.toUpperCase()}
              </MenuItem>
            ))}
          </Select>
        </Grid>
        <Grid item md={8} xs={12} marginLeft={"auto"}>
          <WalletButton
            walletAddr={walletAddr}
            setWalletAddr={setWalletAddr}
            openMnemonic={openMnemonic}
            setOpenMnemonic={setOpenMnemonic}
            mnemonic={mnemonic}
            setMnemonic={setMnemonic}
          />
        </Grid>
      </Grid>
      <Formik
        innerRef={formikRef}
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleStart}
        validateOnBlur={false}
      >
        {({
          handleSubmit,
          isValid,
          values,
          setFieldValue,
          errors,
          touched,
        }) => {
          return (
            <Form onSubmit={handleSubmit}>
              <>
                <Grid container sx={{ alignItems: "center", rowGap: "5px" }}>
                  <Grid item md={7} xs={12}>
                    <AssetSearchInput
                      setFieldValue={(name: string, val: string) => {
                        const value = val ? parseInt(val) : "";
                        setFieldValue(name, value);
                        setFormError("");
                        if (value) {
                          getAccount(value);
                        } else {
                          setVisibleBalance([]);
                        }
                      }}
                      name="assetId"
                      environment={environment}
                    />
                    {touched["assetId"] && errors["assetId"] && (
                      <Typography
                        sx={{
                          pt: "5px",
                          color: "error.main",
                          fontSize: "12px",
                        }}
                      >
                        {errors["assetId"]}
                      </Typography>
                    )}
                  </Grid>
                  {formikRef.current?.values?.assetId ? (
                    <Grid item md={4} marginLeft={"auto"}>
                      <Link
                        href={`https://${
                          environment === "mainnet" ? "app" : "testnet"
                        }.algodex.com/trade/${
                          formikRef.current.values.assetId
                        }`}
                        target={"_blank"}
                        rel="noreferrer"
                        sx={{
                          color: "secondary.contrastText",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "end",
                          textDecoration: "underline",
                          fontWeight: 500,
                        }}
                      >
                        View in Algodex
                        <LaunchIcon sx={{ fontSize: "14px", ml: "5px" }} />
                      </Link>
                    </Grid>
                  ) : (
                    ""
                  )}
                </Grid>
                <Typography sx={{ pt: "5px", fontSize: "14px" }}>
                  *This bot currently uses Tinyman as a price oracle.
                </Typography>
                {formError && (
                  <Typography
                    sx={{
                      pt: "5px",
                      color: "error.main",
                      fontSize: "12px",
                      display: "flex",
                      alignItems: "center",
                      columnGap: "5px",
                    }}
                  >
                    <InfoRoundedIcon
                      sx={{
                        fontSize: "12px",
                      }}
                    />
                    {formError}
                  </Typography>
                )}
                {visibleBalance.length > 0 && (
                  <Box
                    sx={{
                      border: "2px solid",
                      borderColor: "secondary.contrastText",
                      padding: "15px 20px",
                      borderRadius: "3px",
                      marginTop: "40px",
                      marginBottom: "20px",
                      background: "transparent",
                    }}
                  >
                    <Typography marginBottom={"10px"}>
                      Available Balance
                    </Typography>
                    {visibleBalance.map((asset) => (
                      <Box
                        key={asset["asset-id"]}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: "2px",
                          paddingInline: "30px",
                        }}
                      >
                        <Typography sx={{ fontSize: "18px", fontWeight: 700 }}>
                          {asset.name || asset["asset-id"]}:
                        </Typography>
                        <Typography
                          sx={{
                            textAlign: "end",
                            fontSize: "18px",
                            fontWeight: 700,
                          }}
                        >
                          {asset.amount.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                )}
                <Box sx={cardStyles}>
                  <Typography marginBottom={"20px"}>
                    Order Size (in ALGOs)
                    <HtmlTooltip
                      title={
                        <Box
                          sx={{
                            width: "300px",
                            maxWidth: "100%",
                            padding: ".3rem",
                          }}
                        >
                          <Typography
                            fontWeight={700}
                            marginBottom={"6px"}
                            fontSize={"12px"}
                          >
                            Order Size is the size of your orders listed in
                            ALGOs.
                            <br />
                            <br />
                            For example, if you are trading an ASA worth 0.5
                            ALGOs and set the Order Size to 50, you will have to
                            place orders with 100 of the ASA on one side and 50
                            ALGOs on the other side. These amounts will be
                            adjusted as the price changes.
                          </Typography>
                        </Box>
                      }
                      placement="top"
                      arrow
                      sx={{
                        cursor: "pointer",
                        marginLeft: "0.5rem",
                      }}
                    >
                      <InfoRoundedIcon
                        sx={{
                          marginLeft: "5px",
                          fontSize: "16px",
                          color: "secondary.dark",
                          cursor: "pointer",
                        }}
                      />
                    </HtmlTooltip>
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
                        name="orderAlgoDepth"
                        id="orderAlgoDepth"
                        min={1}
                        max={10000000}
                      />
                      <Typography
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          fontSize: "13px",
                        }}
                      >
                        <span>1</span>
                        <span>10M</span>
                      </Typography>
                    </Grid>
                    <Grid item md={2} marginLeft={"auto"}>
                      <Field
                        component={CustomTextInput}
                        type="number"
                        name="orderAlgoDepth"
                        id="orderAlgoDepth"
                        max={10000000}
                        min={1}
                        required
                        sx={{
                          input: {
                            padding: "6.5px 0px 6.5px 14px",
                            width: "94px",
                          },
                        }}
                      />
                    </Grid>
                  </Grid>
                  <Note
                    note={`These settings ${
                      values.orderAlgoDepth / conversionRate < 100
                        ? "DO NOT "
                        : ""
                    }qualify for ALGX Rewards.`}
                    link={{
                      url: "https://docs.algodex.com/rewards-program/algx-liquidity-rewards-program",
                      title: "Read about Rewards Calcuations",
                    }}
                  />
                </Box>

                <Box sx={cardStyles}>
                  <Typography marginBottom={"20px"}>
                    Spread Percentage
                    <HtmlTooltip
                      title={
                        <Box
                          sx={{
                            width: "300px",
                            maxWidth: "100%",
                            padding: ".3rem",
                          }}
                        >
                          <Typography
                            fontWeight={700}
                            marginBottom={"6px"}
                            fontSize={"12px"}
                          >
                            Spread Percentage is the percent difference between
                            users&apos; Bid/Ask orders with the mid-market
                            price. A smaller percentage will result in orders
                            more likely to fill and will qualify for more ALGX
                            rewards.
                          </Typography>
                        </Box>
                      }
                      placement="top"
                      arrow
                      sx={{
                        cursor: "pointer",
                        marginLeft: "0.5rem",
                      }}
                    >
                      <InfoRoundedIcon
                        sx={{
                          marginLeft: "5px",
                          fontSize: "16px",
                          color: "secondary.dark",
                          cursor: "pointer",
                        }}
                      />
                    </HtmlTooltip>
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
                        name="minSpreadPerc"
                        id="minSpreadPerc"
                        marks
                        step={0.1}
                        max={5}
                        min={0.01}
                        onChange={({
                          target: { value },
                        }: {
                          target: HTMLInputElement;
                        }) => {
                          if (
                            parseFloat(value) >= 0.01 &&
                            parseFloat(value) <= 5
                          ) {
                            setFieldValue("minSpreadPerc", parseFloat(value));
                            setFieldValue(
                              "nearestNeighborKeep",
                              parseFloat(value) / 2
                            );
                          }
                        }}
                      />
                      <Typography
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          fontSize: "13px",
                        }}
                      >
                        <span>0.01</span>
                        <span>5</span>
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      md={2}
                      marginLeft={"auto"}
                      sx={{ position: "relative" }}
                    >
                      <Field
                        component={CustomTextInput}
                        type="number"
                        name="minSpreadPerc"
                        id="minSpreadPerc"
                        max={5}
                        // min={0.01}
                        required
                        sx={{
                          input: {
                            padding: "6.5px 0px 6.5px 14px",
                            width: "63px",
                          },
                        }}
                        onChange={({
                          target: { value },
                        }: {
                          target: HTMLInputElement;
                        }) => {
                          const _value = !value
                            ? ""
                            : parseFloat(value) <= 0
                            ? 0.01
                            : parseFloat(value) > 5
                            ? 5
                            : parseFloat(value);
                          setFieldValue("minSpreadPerc", _value);
                          setFieldValue(
                            "nearestNeighborKeep",
                            _value ? _value / 2 : 0
                          );
                        }}
                      />
                      <span style={percentStyles}>%</span>
                    </Grid>
                  </Grid>
                  <Note
                    note={`These settings ${
                      values.minSpreadPerc > 1 ? "DO NOT " : ""
                    }qualify for ALGX Rewards.`}
                    link={{
                      url: "https://docs.algodex.com/rewards-program/algx-liquidity-rewards-program",
                      title: "Read about Rewards Calcuations",
                    }}
                  />
                </Box>
                <Box sx={cardStyles}>
                  <Typography marginBottom={"20px"}>
                    Number of Orders
                    <HtmlTooltip
                      title={
                        <Box
                          sx={{
                            width: "300px",
                            maxWidth: "100%",
                            padding: ".3rem",
                          }}
                        >
                          <Typography
                            fontWeight={700}
                            marginBottom={"6px"}
                            fontSize={"12px"}
                          >
                            Number of Orders is the number of orders that will
                            be placed on each side. This number is the same for
                            both the bid and ask sides.
                            <br />
                            <br />
                            For example, if you set this number to “3” then 3
                            buy orders will be placed and 3 sell orders will be
                            placed following the parameters set above.
                          </Typography>
                        </Box>
                      }
                      placement="top"
                      arrow
                      sx={{
                        cursor: "pointer",
                        marginLeft: "0.5rem",
                      }}
                    >
                      <InfoRoundedIcon
                        sx={{
                          marginLeft: "5px",
                          fontSize: "16px",
                          color: "secondary.dark",
                          cursor: "pointer",
                        }}
                      />
                    </HtmlTooltip>
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
                        name="ladderTiers"
                        id="ladderTiers"
                        max={15}
                        min={1}
                      />
                      <Typography
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          fontSize: "13px",
                        }}
                      >
                        <span>1</span>
                        <span>15</span>
                      </Typography>
                    </Grid>
                    <Grid item md={2} marginLeft={"auto"}>
                      <Field
                        component={CustomTextInput}
                        type="number"
                        name="ladderTiers"
                        id="ladderTiers"
                        max={15}
                        min={1}
                        required
                        sx={{
                          input: {
                            padding: "6.5px 0px 6.5px 14px",
                            width: "63px",
                          },
                        }}
                        onChange={({
                          target: { value },
                        }: {
                          target: HTMLInputElement;
                        }) => {
                          const _value = !value
                            ? ""
                            : parseFloat(value) > 15
                            ? 15
                            : parseFloat(value);
                          setFieldValue("ladderTiers", _value);
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
                      <HtmlTooltip
                        title={
                          <Box
                            sx={{
                              width: "300px",
                              maxWidth: "100%",
                              padding: ".3rem",
                            }}
                          >
                            <Typography
                              fontWeight={700}
                              marginBottom={"6px"}
                              fontSize={"12px"}
                            >
                              Nearest Neighbor Keep is the tolerance for the bot
                              to cancel and replace orders as the price is
                              changing. If your current orders are within the
                              percentage set here, the bot will not cancel and
                              replace until they go above this tolerance. This
                              setting defaults to half of the set spread
                              percentage.
                            </Typography>
                          </Box>
                        }
                        placement="top"
                        arrow
                        sx={{
                          cursor: "pointer",
                          marginLeft: "0.5rem",
                        }}
                      >
                        <InfoRoundedIcon
                          sx={{
                            marginLeft: "5px",
                            fontSize: "16px",
                            color: "secondary.dark",
                            cursor: "pointer",
                          }}
                        />
                      </HtmlTooltip>
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
                          step={0.1}
                          marks
                          name="nearestNeighborKeep"
                          id="nearestNeighborKeep"
                          max={values.minSpreadPerc}
                          min={0}
                        />
                        <Typography
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            fontSize: "13px",
                          }}
                        >
                          <span>0</span>
                          <span>{values.minSpreadPerc}</span>
                        </Typography>
                      </Grid>
                      <Grid item md={2} marginLeft={"auto"}>
                        <Field
                          component={CustomTextInput}
                          type="number"
                          name="nearestNeighborKeep"
                          id="nearestNeighborKeep"
                          max={values.minSpreadPerc}
                          // min={0}
                          required
                          sx={{
                            input: {
                              padding: "6.5px 0px 6.5px 14px",
                              width: "63px",
                            },
                          }}
                        />
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>

                {!loading ? (
                  <LoadingButton
                    variant="contained"
                    fullWidth
                    type="submit"
                    loading={loading}
                    disabled={loading || !isValid || formError !== ""}
                    sx={{ py: "0.8rem", mt: "1rem" }}
                  >
                    Start Bot
                  </LoadingButton>
                ) : (
                  <Button
                    variant="contained"
                    fullWidth
                    type="button"
                    sx={{
                      py: "0.8rem",
                      mt: "1rem",
                      backgroundColor: "error.dark",
                      "&:hover": {
                        backgroundColor: "error.dark",
                      },
                    }}
                    onClick={stopBot}
                  >
                    Stop Bot
                  </Button>
                )}
              </>
            </Form>
          );
        }}
      </Formik>
      <ValidateWallet
        open={openModal}
        handleClose={handleClose}
        passphrase={passphrase}
        setPassphrase={setPassphrase}
        walletAddr={walletAddr}
        setWalletAddr={setWalletAddr}
      />
    </>
  );
};
