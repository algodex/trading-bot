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
import HttpsIcon from "@mui/icons-material/Https";

// Custom components and hooks
import { Note } from "./Note";
import CustomRangeSlider from "./CustomRangeSlider";
import CustomTextInput from "./CustomTextInput";
import initAPI from "@/lib/initAPI";
import { BotConfig, Environment } from "@/lib/types/config";
import { PassPhrase } from "./CustomPasswordInput";
import { ValidateWallet } from "./validateWallet";
import { AssetSearchInput } from "./AssetSearchInput";
import {
  getAccountInfo,
  getTinymanAssets,
  getTinymanLiquidity,
} from "@/lib/helper";
import getAssetInfo from "@/lib/getAssetInfo";
import algosdk from "algosdk";
import { getWallet } from "@/lib/storage";
import { usePriceConversionHook } from "@/hooks/usePriceConversionHook";
import Image from "next/image";
import events from "@/lib/events";

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
  amountInUSD?: number;
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
  right: "4px",
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
  const [availableBalance, setAvailableBalance] = useState<AssetSchema[]>([]);
  const [walletAddr, setWalletAddr] = useState(getWallet());
  const [mnemonic, setMnemonic] = useState("");
  const [ASAError, setASAError] = useState("");
  const [ASAWarning, setASAWarning] = useState("");
  const { assetRates, algoRate } = usePriceConversionHook({
    env: environment,
  });
  const [gettingAccount, setGettingAccount] = useState(false);

  const calculateLogValue = (value: number, min: number, max: number) => {
    if (value === min) return min;
    const minv = Math.log(min);
    const maxv = Math.log(max);
    const scale = (maxv - minv) / (max - min);
    return parseFloat(Math.exp(minv + scale * (value - min)).toFixed(2));
  };

  const calculateReverseLogValue = (value: any, min: number, max: number) => {
    if (value) {
      const minv = Math.log(min);
      const maxv = Math.log(max);
      const scale = (maxv - minv) / (max - min);
      return (Math.log(value) - minv) / scale + min;
    }
    return min;
  };

  const initialValues = {
    assetId: "",
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
      formikRef.current.resetForm();
      setASAError("");
      setEnvironment(value);
      setAvailableBalance([]);
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
      setAvailableBalance(result);
    },
    [environment]
  );

  const getAccount = async (assetId: number) => {
    if (walletAddr && assetId) {
      setGettingAccount(true);
      if (await presentOnTinyman(assetId)) {
        try {
          const res = await getAccountInfo(walletAddr, environment);
          const ASAs = res.data.assets;
          const currentASA = ASAs.find(
            (asset: AssetSchema) => asset["asset-id"] === assetId
          ) || { amount: 0, "asset-id": assetId, "is-frozen": false };

          const currentData = availableBalance.find(
            (ass) => ass?.["asset-id"] === assetId
          );

          const algoBalance = {
            amount: res.data.amount / 1000000,
            "asset-id": "ALGO",
            "is-frozen": false,
            amountInUSD: (res.data.amount / 1000000) * assetRates[0]?.price,
          };
          if (currentASA) {
            const val = [
              algoBalance,
              {
                ...currentASA,
                name: currentData?.name || currentASA.name,
                amount: currentASA.amount / 1000000,
                amountInUSD:
                  (currentASA.amount / 1000000) *
                  assetRates[currentASA["asset-id"]]?.price,
              },
            ];
            setAvailableBalance(val);
            updateASAInfo(val);

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
          } else {
            setAvailableBalance([algoBalance]);
          }
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
          setASAError("This asset is not present on Tinyman");
        }
        setTimeout(() => {
          setGettingAccount(false);
        }, 5000);
      }
    } else {
      setAvailableBalance([]);
    }
  };

  useEffect(() => {
    if (!gettingAccount) {
      if (walletAddr && formikRef.current?.values?.assetId && !ASAError) {
        getAccount(formikRef.current?.values?.assetId);
      } else if (!walletAddr || !formikRef.current?.values?.assetId) {
        setAvailableBalance([]);
      }
    }
  }, [walletAddr, environment, gettingAccount, ASAError]);

  const lowBalanceOrRisky = (
    assetId: number,
    orderAlgoDepth: number,
    ladderTiers: number
  ) => {
    if (assetId && availableBalance.length > 0) {
      const found = availableBalance.find(
        (asset) => asset["asset-id"] === assetId
      );
      const algoBal = availableBalance.find(
        (asset) => asset["asset-id"] === "ALGO"
      );
      if (found) {
        if (found.amount > 0 && algoBal && algoBal?.amount > 0) {
          const checkLiquidity = async () => {
            try {
              const { results } = await getTinymanLiquidity(environment);
              const maxLiquidity = Math.max(
                ...results
                  .filter(
                    (item: any) =>
                      item.asset_1.id === String(assetId) &&
                      !isNaN(item.current_asset_1_reserves_in_usd)
                  )
                  .map((item: any) => item.current_asset_1_reserves_in_usd)
              );
              if (assetRates[assetId]) {
                const amountToTrade =
                  orderAlgoDepth * assetRates[assetId].price * ladderTiers;
                if (maxLiquidity) {
                  if (amountToTrade >= maxLiquidity * 0.5) {
                    setASAError(
                      "This ASA‘s liquidity is too high and risky to use this bot"
                    );
                    return true;
                  } else if (amountToTrade > maxLiquidity * 0.1) {
                    setASAWarning("Warning, this ASA‘s liquidity is high");
                    return false;
                  }
                } else {
                  setASAError(
                    "This ASA‘s liquidity is too low on Tinyman to use this bot"
                  );
                  return true;
                }
                setASAError("");
                setASAWarning("");
                return false;
              }
            } catch (error) {
              setTimeout(() => {
                checkLiquidity();
              }, 7000);
            }
          };
          return checkLiquidity();
        } else {
          setASAError("This ASA or Algo balance is too low to use this bot");
          return true;
        }
      }
    }
    return false;
  };

  const presentOnTinyman = async (assetId: number) => {
    try {
      const res = await getTinymanAssets(environment);
      if (res[assetId]) return true;
      return false;
    } catch (error) {
      setTimeout(() => {
        presentOnTinyman(assetId);
      }, 7000);
    }
  };

  useEffect(() => {
    events.on("running-bot", ({ content }: { content: string }) => {
      if (content === "Low balance!") {
        setLoading(false);
        setASAError(content);
      }
    });

    return () => events.off("running-bot");
  }, []);
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
                        setASAError("");
                        setASAWarning("");
                        if (value) {
                          getAccount(value);
                        } else {
                          setAvailableBalance([]);
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
                {availableBalance.length > 0 && (
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
                    {availableBalance.map((asset) => (
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

                        <Box>
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
                          {(asset.amountInUSD || asset.amountInUSD === 0) && (
                            <Typography
                              sx={{
                                textAlign: "end",
                                fontSize: "14px",
                                fontWeight: 700,
                                color: "grey.200",
                              }}
                            >
                              $
                              {asset.amountInUSD.toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    ))}
                  </Box>
                )}
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
                          setASAError("");
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
                        ≈$
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
                          component={CustomTextInput}
                          type="number"
                          name="orderAlgoDepth"
                          id="orderAlgoDepth"
                          max={10000000}
                          min={1}
                          required
                          sx={{
                            maxWidth: "111px",
                            input: {
                              padding: "6.5px 14px 6.5px 14px",
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
                            setASAError("");
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
                    note={`These settings ${
                      values.orderAlgoDepth * algoRate < 100 ? "DO NOT " : ""
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
                          maxWidth: "111px",
                          input: {
                            padding: "6.5px 14px 6.5px 14px",
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
                            : parseFloat(value) > 5
                            ? 5
                            : parseFloat(value);
                          setFieldValue(
                            "minSpreadPerc_range",
                            parseFloat(
                              calculateReverseLogValue(_value, 0.01, 5).toFixed(
                                2
                              )
                            )
                          );
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
                              padding: "6.5px 14px 6.5px 14px",
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

                {walletAddr !== undefined && !mnemonic && (
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
                      ASAError !== "" ||
                      (walletAddr !== undefined && !mnemonic)
                    }
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
