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

import React, {
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
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
import HttpsIcon from "@mui/icons-material/Https";

// Custom components and hooks
import { Note } from "./Note";
import CustomRangeSlider from "./Form/CustomRangeSlider";
import CustomTextInput from "./Form/CustomTextInput";
import initAPI from "@/lib/initAPI";
import { ValidateWallet } from "./Modals/validateWallet";
import { AssetSearchInput } from "./Form/AssetSearchInput";
import {
  getAccountInfo,
  calculateLogValue,
  calculateReverseLogValue,
  checkTinymanLiquidity,
  currentlyTrading,
  addToTradeList,
  removeFromTradeList,
} from "@/lib/helper";
import { usePriceConversionHook } from "@/hooks/usePriceConversionHook";
import Image from "next/image";
import events from "@/lib/events";
import CustomNumberFormatter from "./Form/CustomNumberFormatter";
import { AppContext } from "@/context/appContext";
import { getTinymanPools } from "@/lib/getTinyman";
import { initialState, updateReducer } from "./Reducer/updateReducer";
import { AvailableBalance } from "./AvailableBalance";
import { HtmlTooltip } from "./HtmlTooltip";
import { storageKeys } from "@/lib/storage";
import { UseFormik } from "@/hooks/useFormik";

const WalletButton: any = dynamic(
  () =>
    import("@/components/walletButton").then((mod: any) => mod.WalletButton),
  {
    ssr: false,
  }
);
export interface AssetSchema {
  "asset-id": number | string;
  amount: number;
  "is-frozen": boolean;
  name: string;
  amountInUSD: number;
  decimals: number;
}

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
  right: "7px",
  top: "10px",
  fontSize: "12px",
};

export const BotForm = () => {
  const formikRef = useRef<any>();
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("Must be inside of a App Provider");
  }
  const {
    walletAddr,
    setWalletAddr,
    validateWallet,
    openMnemonic,
    setOpenMnemonic,
    mnemonic,
    setMnemonic,
    environment,
    setEnvironment,
    loading,
    setLoading,
  }: any = context;

  const [
    { availableBalance, ASAError, ASAWarning, currentPrices, config },
    dispatch,
  ] = useReducer(updateReducer, initialState);
  const { algoRate } = usePriceConversionHook({
    env: environment,
  });
  const [gettingAccount, setGettingAccount] = useState(false);

  const initialValues = {
    assetId: "",
    assetDecimals: "",
    assetName: "",
    orderAlgoDepth_range: calculateReverseLogValue(300, 1, 10000000),
    orderAlgoDepth: 300,
    ladderTiers: 3,
    minSpreadPerc_range: calculateReverseLogValue(0.25, 0.01, 5),
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

  const handleStart = async (formValues: FormikValues) => {
    const _formValues = { ...formValues };
    delete _formValues.minSpreadPerc_range;
    delete _formValues.orderAlgoDepth_range;
    delete _formValues.assetDecimals;
    const assetId = formValues.assetId;

    if (
      !(await lowBalanceOrRisky(
        assetId,
        formValues.orderAlgoDepth,
        formValues.ladderTiers
      ))
    ) {
      if (!walletAddr) {
        setOpenMnemonic("mnemonic");
      } else if (walletAddr && !mnemonic) {
        validateWallet();
      } else if (walletAddr && mnemonic) {
        if (currentlyTrading(assetId, dispatch)) return;
        try {
          const pouchUrl = process.env.NEXT_PUBLIC_POUCHDB_URL
            ? process.env.NEXT_PUBLIC_POUCHDB_URL + "/"
            : "";
          const fullPouchUrl =
            pouchUrl +
            "market_maker_" +
            assetId +
            "_" +
            walletAddr.slice(0, 8).toLowerCase();
          const escrowDB = new PouchDB(fullPouchUrl);
          const api = initAPI(environment);
          const _config = {
            ...(_formValues as any),
            assetId,
            walletAddr,
            environment,
            useTinyMan: true,
            api,
            escrowDB,
            mnemonic,
          };
          _config.minSpreadPerc = _config.minSpreadPerc / 100;
          _config.nearestNeighborKeep = _config.nearestNeighborKeep / 100;
          dispatch({ type: "config", payload: _config });
          stopLoop({ resetExit: true });
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

  const stopBot = (callFn?: boolean) => {
    setLoading(false);
    removeFromTradeList(config?.assetId);
    if (config && callFn) stopLoop({ config });
  };

  const handleChange = ({ target: { value } }: SelectChangeEvent<string>) => {
    if (!loading) {
      formikRef.current.resetForm();
      dispatch({ type: "asaError", payload: null });
      setEnvironment(value);
      dispatch({ type: "balance", payload: [] });
    }
  };

  //Look up the connected wallet's account
  const getAccount = async (
    assetId: number,
    assetDecimals: number,
    assetName: string
  ) => {
    if (walletAddr && assetId) {
      setGettingAccount(true);

      //Check if this asset has enough liquidity on tinyman
      const latestPrice = await checkTinymanLiquidity({
        assetId,
        decimals: assetDecimals,
        environment,
      });
      dispatch({
        type: "currentPrice",
        payload: [algoRate, (latestPrice || 0) * algoRate],
      });
      if (latestPrice && latestPrice > 0) {
        try {
          const res = await getAccountInfo(walletAddr, environment);
          const ASAs = res.data.assets;

          //Check if wallet have the asset, if it doesn't replace with 0 amount
          const walletASA = ASAs.find(
            (asset: AssetSchema) => asset["asset-id"] === assetId
          ) || { amount: 0, "asset-id": assetId, "is-frozen": false };

          const algoBalance = {
            amount: res.data.amount / 1000000, // Algo decimal is 6
            "asset-id": "ALGO",
            "is-frozen": false,
            decimals: 6, // Algo decimal is 6
            amountInUSD: (res.data.amount / 1000000) * algoRate,
          };

          const val: AssetSchema[] = [
            algoBalance,
            {
              ...walletASA,
              name: assetName,
              decimals: assetDecimals,
              amount: walletASA.amount / 10 ** assetDecimals,
              amountInUSD:
                (walletASA.amount / 10 ** assetDecimals) *
                (latestPrice || 0) *
                algoRate,
            },
          ];

          dispatch({ type: "balance", payload: val });
          if (loading) {
            events.emit("current-balance", {
              walletBalance: {
                assetId,
                algo: algoBalance.amount,
                asa: val[1].amount,
                currentDepth: formikRef.current.values.orderAlgoDepth,
              },
            });
          }

          //Delay timer before it triggers a new request
          setTimeout(() => {
            setGettingAccount(false);
          }, 5000);
        } catch (error) {
          console.error(error);

          setTimeout(() => {
            setGettingAccount(false);
          }, 5000);
        }
      } else {
        if (!loading) {
          dispatch({
            type: "asaError",
            payload:
              "This ASA???s liquidity is too low on Tinyman to use this bot",
          });
        }
        setTimeout(() => {
          setGettingAccount(false);
        }, 5000);
      }
    } else {
      dispatch({ type: "balance", payload: [] });
    }
  };

  useEffect(() => {
    //If no ongoing request and wallet is connected, get the current balance
    if (!gettingAccount) {
      if (walletAddr && formikRef.current?.values?.assetId && !ASAError) {
        getAccount(
          formikRef.current?.values?.assetId,
          formikRef.current?.values?.assetDecimals,
          formikRef.current?.values?.assetName
        );
      } else if (!walletAddr || !formikRef.current?.values?.assetId) {
        dispatch({ type: "balance", payload: [] });
      }
    }
  }, [walletAddr, environment, gettingAccount, ASAError]);

  //Check if the balance is low or too risky to trade
  const lowBalanceOrRisky = (
    assetId: number,
    orderAlgoDepth: number,
    ladderTiers: number
  ) => {
    if (assetId && availableBalance.length > 0) {
      const found = availableBalance.find(
        (asset: AssetSchema) => asset["asset-id"] === assetId
      );
      const algoBal = availableBalance.find(
        (asset: AssetSchema) => asset["asset-id"] === "ALGO"
      );
      if (found) {
        if (found.amount > 0 && algoBal && algoBal?.amount > 0) {
          const checkLiquidity = async () => {
            try {
              const { results } = await getTinymanPools(environment);
              const maxLiquidity = Math.max(
                ...results
                  .filter(
                    (item: any) =>
                      item.asset_1.id === String(assetId) &&
                      !isNaN(item.current_asset_1_reserves_in_usd)
                  )
                  .map((item: any) => item.current_asset_1_reserves_in_usd)
              );
              const amountToTrade = ladderTiers * algoRate * orderAlgoDepth;
              if (maxLiquidity) {
                if (amountToTrade >= maxLiquidity * 0.5) {
                  dispatch({
                    type: "asaError",
                    payload:
                      "This ASA???s liquidity on Tinyman is too low and risky to use this bot, please reduce your order sizes or select a different ASA",
                  });
                  return true;
                } else if (amountToTrade > maxLiquidity * 0.1) {
                  dispatch({
                    type: "asaWarning",
                    payload: "Warning, this ASA???s liquidity is low on Tinyman",
                  });
                  return false;
                }
              } else {
                dispatch({
                  type: "asaError",
                  payload:
                    "This ASA???s liquidity is too low on Tinyman to use this bot",
                });
                return true;
              }
              dispatch({
                type: "asaError",
                payload: null,
              });
              dispatch({
                type: "asaWarning",
                payload: null,
              });
              return false;
            } catch (error) {
              setTimeout(() => {
                checkLiquidity();
              }, 7000);
            }
          };
          return checkLiquidity();
        } else {
          dispatch({
            type: "asaError",
            payload: "This ASA or Algo balance is too low to use this bot",
          });
          return true;
        }
      }
    }
    return false;
  };

  useEffect(() => {
    // Remove the asset list on page load
    if (!loading && !config) {
      localStorage.removeItem(storageKeys.assets);
    }

    // Listen to running bot events
    events.on("running-bot", ({ content }: { content: string }) => {
      //Update tradelist
      if (config && loading) {
        addToTradeList(config.assetId);
      }

      // If low balance error, stop the bot on the UI
      if (content === "Low balance!") {
        stopBot();
        dispatch({
          type: "asaError",
          payload: content,
        });
      }
    });
  }, [config, loading]);

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
          {environment && (
            <Select
              className="environment-select-wrapper"
              value={environment}
              onChange={handleChange}
              disabled={loading}
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
          )}
        </Grid>
        <Grid item md={8} xs={12} marginLeft={"auto"}>
          <WalletButton
            walletAddr={walletAddr}
            setWalletAddr={setWalletAddr}
            openMnemonic={openMnemonic}
            setOpenMnemonic={setOpenMnemonic}
            mnemonic={mnemonic}
            setMnemonic={setMnemonic}
            loading={loading}
            validateWallet={validateWallet}
          />
        </Grid>
      </Grid>
      <Formik
        innerRef={formikRef}
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleStart}
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
                <UseFormik />
                <Grid container sx={{ alignItems: "center", rowGap: "5px" }}>
                  <Grid item md={7} xs={12}>
                    <AssetSearchInput
                      setFieldValue={(
                        val: string,
                        assetDecimals: number,
                        assetName: string
                      ) => {
                        const assetId = val ? parseInt(val) : "";
                        dispatch({
                          type: "asaError",
                          payload: null,
                        });
                        dispatch({
                          type: "asaWarning",
                          payload: null,
                        });
                        currentlyTrading(assetId, dispatch);
                        if (assetId && assetDecimals) {
                          getAccount(assetId, assetDecimals, assetName);
                        } else {
                          dispatch({ type: "balance", payload: [] });
                        }
                        setFieldValue("assetDecimals", assetDecimals);
                        setFieldValue("assetName", assetName);
                        setFieldValue("assetId", assetId);
                      }}
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
                {(ASAError || ASAWarning) && (
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
                    {ASAError || ASAWarning}
                  </Typography>
                )}
                <AvailableBalance
                  availableBalance={availableBalance}
                  currentPrices={currentPrices}
                  assetId={values.assetId}
                />

                <Box sx={cardStyles}>
                  <Typography marginBottom={"8px"}>
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
                    <Grid item lg={8} md={8} xs={12} sx={{ marginTop: "14px" }}>
                      <Field
                        component={CustomRangeSlider}
                        name="orderAlgoDepth_range"
                        id="orderAlgoDepth_range"
                        scale={(value: number) =>
                          calculateLogValue(value, 1, 10000000)
                        }
                        valueLabelFormat={(value: number) => (
                          <div>{value.toLocaleString()}</div>
                        )}
                        min={1}
                        max={10000000}
                        onChange={({
                          target: { value },
                        }: {
                          target: HTMLInputElement;
                        }) => {
                          setFieldValue("orderAlgoDepth_range", value);
                          setFieldValue(
                            "orderAlgoDepth",
                            calculateLogValue(parseFloat(value), 1, 10000000)
                          );
                          dispatch({
                            type: "asaError",
                            payload: null,
                          });
                        }}
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
                    <Grid
                      item
                      md={3}
                      marginLeft={"auto"}
                      sx={{ textAlign: "end" }}
                    >
                      <Typography
                        sx={{
                          textAlign: "end",
                          fontSize: "14px",
                          fontWeight: 700,
                          color: "grey.200",
                          wordBreak: "break-word",
                        }}
                      >
                        ???$
                        {(values.orderAlgoDepth * algoRate).toLocaleString(
                          undefined,
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }
                        )}
                      </Typography>
                      <Box sx={{ position: "relative" }}>
                        <Field
                          component={CustomNumberFormatter}
                          name="orderAlgoDepth"
                          id="orderAlgoDepth"
                          max={10000000}
                          min={1}
                          step={0.01}
                          required
                          sx={{
                            maxWidth: "116px",
                            input: {
                              padding: "6.5px 22px 6.5px 14px",
                              width: "100%",
                              textAlign: "end",
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
                              ? 1
                              : parseFloat(value) > 10000000
                              ? 10000000
                              : parseFloat(value);
                            setFieldValue(
                              "orderAlgoDepth_range",
                              calculateReverseLogValue(_value, 1, 10000000)
                            );
                            setFieldValue("orderAlgoDepth", _value);
                            dispatch({
                              type: "asaError",
                              payload: null,
                            });
                          }}
                        />

                        <span style={percentStyles}>
                          <Image
                            src={"/algorand-logo.svg"}
                            alt=""
                            width={12}
                            height={12}
                          />
                        </span>
                      </Box>
                    </Grid>
                  </Grid>
                  <Note
                    note={
                      <>
                        <span>These settings</span>{" "}
                        {values.orderAlgoDepth * algoRate < 100 ? (
                          <u>DO NOT</u>
                        ) : null}{" "}
                        <span>qualify for ALGX Rewards.</span>
                      </>
                    }
                    isPositive={values.orderAlgoDepth * algoRate >= 100}
                    link={{
                      url: "https://docs.algodex.com/rewards-program/algx-liquidity-rewards-program",
                      title: "Read about Rewards Calculations",
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
                    <Grid item lg={8} md={8} xs={12}>
                      <Field
                        component={CustomRangeSlider}
                        name="minSpreadPerc_range"
                        id="minSpreadPerc_range"
                        step={0.1}
                        scale={(value: number) =>
                          calculateLogValue(value, 0.01, 5)
                        }
                        min={0.01}
                        max={5}
                        onChange={({
                          target: { value },
                        }: {
                          target: HTMLInputElement;
                        }) => {
                          const _value = parseFloat(value);
                          if (_value >= 0.01 && _value <= 5) {
                            setFieldValue("minSpreadPerc_range", _value);
                            setFieldValue(
                              "minSpreadPerc",
                              parseFloat(
                                calculateLogValue(_value, 0.01, 5).toFixed(2)
                              )
                            );
                            setFieldValue(
                              "nearestNeighborKeep",
                              parseFloat(
                                calculateLogValue(_value, 0.01, 5).toFixed(2)
                              ) / 2
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
                      md={3}
                      marginLeft={"auto"}
                      sx={{ position: "relative", textAlign: "end" }}
                    >
                      <Field
                        component={CustomTextInput}
                        type="number"
                        name="minSpreadPerc"
                        id="minSpreadPerc"
                        max={5}
                        min={0.01}
                        step={0.01}
                        required
                        sx={{
                          maxWidth: "115px",
                          input: {
                            padding: "6.5px 11px 6.5px 14px",
                            width: "100%",
                            textAlign: "end",
                            "@media(max-width:900px)": {
                              paddingRight: "22px",
                            },
                          },
                        }}
                        onChange={({
                          target: { value },
                        }: {
                          target: HTMLInputElement;
                        }) => {
                          const _value = !value
                            ? ""
                            : parseFloat(value) > 5
                            ? 5
                            : parseFloat(value);
                          setFieldValue(
                            "nearestNeighborKeep",
                            _value ? _value / 2 : 0
                          );
                          setFieldValue(
                            "minSpreadPerc_range",
                            parseFloat(
                              calculateReverseLogValue(_value, 0.01, 5).toFixed(
                                2
                              )
                            )
                          );
                          setFieldValue("minSpreadPerc", _value);
                        }}
                      />
                      <span style={percentStyles}>%</span>
                    </Grid>
                  </Grid>
                  <Note
                    note={
                      <>
                        <span>These settings</span>{" "}
                        {values.minSpreadPerc > 5 ? <u>DO NOT</u> : null}{" "}
                        <span>qualify for ALGX Rewards.</span>
                      </>
                    }
                    isPositive={values.minSpreadPerc <= 5}
                    link={{
                      url: "https://docs.algodex.com/rewards-program/algx-liquidity-rewards-program",
                      title: "Read about Rewards Calculations",
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
                            For example, if you set this number to ???3??? then 3
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
                    <Grid item lg={8} md={8} xs={12}>
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
                    <Grid item md={3} marginLeft={"auto"} textAlign="end">
                      <Field
                        component={CustomTextInput}
                        type="number"
                        name="ladderTiers"
                        id="ladderTiers"
                        max={15}
                        min={1}
                        required
                        sx={{
                          maxWidth: "111px",
                          input: {
                            padding: "6.5px 0px 6.5px 14px",
                            width: "100%",
                            textAlign: "end",
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
                    <Typography fontWeight={500}>Advanced Options</Typography>
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
                      <Grid item lg={8} md={8} xs={12}>
                        <Field
                          component={CustomRangeSlider}
                          step={0.01}
                          name="nearestNeighborKeep"
                          id="nearestNeighborKeep"
                          max={values.minSpreadPerc || 0}
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
                      <Grid
                        item
                        md={3}
                        marginLeft={"auto"}
                        sx={{ position: "relative", textAlign: "end" }}
                      >
                        <Field
                          component={CustomTextInput}
                          type="number"
                          name="nearestNeighborKeep"
                          id="nearestNeighborKeep"
                          max={values.minSpreadPerc || 0}
                          min={0}
                          required
                          step={0.001}
                          sx={{
                            maxWidth: "111px",
                            input: {
                              padding: "6.5px 11px 6.5px 14px",
                              width: "100%",
                              textAlign: "end",
                              "@media(max-width:900px)": {
                                paddingRight: "22px",
                              },
                            },
                          }}
                          onChange={({
                            target: { value },
                          }: {
                            target: HTMLInputElement;
                          }) => {
                            const _value = !value
                              ? ""
                              : parseFloat(value) > values.minSpreadPerc || 0
                              ? values.minSpreadPerc || 0
                              : parseFloat(value);

                            setFieldValue("nearestNeighborKeep", _value);
                          }}
                        />
                        <span style={percentStyles}>%</span>
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>

                {walletAddr && !mnemonic && (
                  <Typography
                    sx={{
                      py: "5px",
                      color: "error.main",
                      fontSize: "12px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      textAlign: "center",
                      columnGap: "2px",
                    }}
                  >
                    <HttpsIcon
                      sx={{
                        fontSize: "17px",
                      }}
                    />
                    Wallet is locked. Click on wallet address at top <br /> to
                    enter passphrase to enable start button.
                  </Typography>
                )}

                {!loading ? (
                  <LoadingButton
                    variant="contained"
                    fullWidth
                    type="submit"
                    loading={loading}
                    disabled={
                      loading ||
                      !isValid ||
                      !values.assetId ||
                      ASAError !== null ||
                      (walletAddr && !mnemonic)
                    }
                    sx={{ py: "0.8rem", mt: "1rem", fontWeight: "bold" }}
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
                      fontWeight: "bold",
                      backgroundColor: "error.dark",
                      "&:hover": {
                        backgroundColor: "error.dark",
                      },
                    }}
                    onClick={() => stopBot(true)}
                  >
                    Stop Bot
                  </Button>
                )}
              </>
            </Form>
          );
        }}
      </Formik>
      <ValidateWallet />
    </>
  );
};
