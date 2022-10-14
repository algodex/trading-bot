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
exports.BotForm = void 0;
const react_1 = __importStar(require("react"));
const formik_1 = require("formik");
const yup = __importStar(require("yup"));
const runLoop_1 = __importDefault(require("@/lib/runLoop"));
const pouchdb_1 = __importDefault(require("pouchdb"));
const dynamic_1 = __importDefault(require("next/dynamic"));
//MUI Components
const Typography_1 = __importDefault(require("@mui/material/Typography"));
const Grid_1 = __importDefault(require("@mui/material/Grid"));
const Launch_1 = __importDefault(require("@mui/icons-material/Launch"));
const Link_1 = __importDefault(require("@mui/material/Link"));
const Box_1 = __importDefault(require("@mui/material/Box"));
const MenuItem_1 = __importDefault(require("@mui/material/MenuItem"));
const Select_1 = __importDefault(require("@mui/material/Select"));
const InfoRounded_1 = __importDefault(require("@mui/icons-material/InfoRounded"));
const Accordion_1 = __importDefault(require("@mui/material/Accordion"));
const AccordionSummary_1 = __importDefault(require("@mui/material/AccordionSummary"));
const AccordionDetails_1 = __importDefault(require("@mui/material/AccordionDetails"));
const ExpandMore_1 = __importDefault(require("@mui/icons-material/ExpandMore"));
const LoadingButton_1 = __importDefault(require("@mui/lab/LoadingButton"));
const Button_1 = __importDefault(require("@mui/material/Button"));
// Custom components
const Note_1 = require("./Note");
const CustomRangeSlider_1 = __importDefault(require("./CustomRangeSlider"));
const CustomTextInput_1 = __importDefault(require("./CustomTextInput"));
const initAPI_1 = __importDefault(require("@/lib/initAPI"));
const storage_1 = require("@/lib/storage");
const WalletButton = (0, dynamic_1.default)(() => Promise.resolve().then(() => __importStar(require("@/components/walletButton"))).then((mod) => mod.WalletButton), {
    ssr: false,
});
const MAINNET_LINK = process.env.NEXT_PUBLIC_MAINNET_LINK;
const TESTNET_LINK = process.env.NEXT_PUBLIC_TESTNET_LINK;
const ENABLE_NETWORK_SELECTION = TESTNET_LINK && MAINNET_LINK;
const environmentLinks = ["testnet", "mainnet"];
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
const BotForm = () => {
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [environment, setEnvironment] = (0, react_1.useState)(process.env.NEXT_PUBLIC_ENVIRONMENT || "testnet");
    const [config, setConfig] = (0, react_1.useState)();
    const initialValues = {
        assetId: "",
        orderAlgoDepth: 3,
        ladderTiers: 3,
        minSpreadPerc: 0.0025,
        nearestNeighborKeep: 0,
    };
    const validationSchema = yup.object().shape({
        assetId: yup
            .string()
            .label("Asset Id")
            .max(32, "Name must be less than 100 characters")
            .required("Required"),
        orderAlgoDepth: yup
            .number()
            .positive("Invalid")
            .label("Order Size")
            .required("Required"),
        nearestNeighborKeep: yup.number().label("Nearest Keep").optional(),
        ladderTiers: yup
            .number()
            .positive("Invalid")
            .label("Please confirm your password")
            .required("Required"),
        minSpreadPerc: yup
            .number()
            .positive("Invalid")
            .label("Please add a spread")
            .required("Required"),
    });
    const handleStart = (formValues) => {
        console.log(formValues);
        const walletAddr = (0, storage_1.getWallet)();
        const mnemonic = (0, storage_1.getMnemonic)("Secret key");
        if (walletAddr) {
            try {
                const pouchUrl = process.env.POUCHDB_URL
                    ? process.env.POUCHDB_URL + "/"
                    : "";
                const fullPouchUrl = pouchUrl +
                    "market_maker_" +
                    formValues.assetId +
                    "_" +
                    walletAddr.slice(0, 8).toLowerCase();
                const escrowDB = new pouchdb_1.default(fullPouchUrl);
                const useTinyMan = process.env.NEXT_PUBLIC_USE_TINYMAN || false;
                const api = (0, initAPI_1.default)(environment);
                console.log({ api });
                const _config = {
                    ...formValues,
                    walletAddr,
                    environment,
                    useTinyMan,
                    api,
                    escrowDB,
                    mnemonic,
                };
                setConfig(_config);
                console.log(_config);
                setLoading(true);
                (0, runLoop_1.default)({
                    config: _config,
                    assetInfo: null,
                    lastBlock: 0,
                    runState: {
                        isExiting: false,
                        inRunLoop: false,
                    },
                });
            }
            catch (error) {
                setLoading(false);
                console.log(error);
            }
        }
    };
    const stopBot = () => {
        console.log("first");
        if (config) {
            console.log("first2");
            (0, runLoop_1.default)({
                config,
                assetInfo: null,
                lastBlock: 0,
                runState: {
                    isExiting: true,
                    inRunLoop: false,
                },
            });
            setLoading(false);
        }
    };
    const handleChange = ({ target: { value } }) => {
        setEnvironment(value);
    };
    return (<>
      <formik_1.Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleStart} validateOnBlur={false}>
        {({ handleSubmit, isValid }) => {
            return (<formik_1.Form onSubmit={handleSubmit}>
              <>
                <Grid_1.default container sx={{
                    alignItems: "center",
                    rowGap: "5px",
                    marginBottom: "20px",
                }}>
                  <Grid_1.default item md={3} xs={12}>
                    <Select_1.default className="environment-select-wrapper" value={environment} onChange={handleChange} inputProps={{ "aria-label": "Without label" }} sx={{
                    fontSize: "14px",
                    fontWeight: 600,
                    color: environment === "testnet"
                        ? "accent.main"
                        : "error.main",
                    border: "none",
                    ".MuiOutlinedInput-input": {
                        padding: "0.4rem 1.7rem",
                        paddingLeft: "0.8rem",
                    },
                    ".MuiOutlinedInput-notchedOutline": {
                        borderWidth: "2px",
                        borderColor: environment === "testnet"
                            ? "accent.main"
                            : "error.main",
                    },
                }}>
                      {environmentLinks.map((environment) => (<MenuItem_1.default key={environment} value={environment}>
                          {environment.toUpperCase()}
                        </MenuItem_1.default>))}
                    </Select_1.default>
                  </Grid_1.default>
                  <Grid_1.default item md={8} xs={12} marginLeft={"auto"}>
                    <WalletButton />
                  </Grid_1.default>
                </Grid_1.default>
                <Grid_1.default container sx={{ alignItems: "center", rowGap: "5px" }}>
                  <Grid_1.default item md={7} xs={12}>
                    <formik_1.Field component={CustomTextInput_1.default} placeholder="Asset ID" name="assetId" label="Asset Id" id="assetId" required/>
                  </Grid_1.default>
                  <Grid_1.default item md={4} marginLeft={"auto"}>
                    <Link_1.default href="https://algodex.com" target={"_blank"} rel="noreferrer" sx={{
                    color: "secondary.contrastText",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "end",
                    textDecoration: "underline",
                    fontWeight: 500,
                }}>
                      View in Algodex
                      <Launch_1.default sx={{ fontSize: "14px", ml: "5px" }}/>
                    </Link_1.default>
                  </Grid_1.default>
                </Grid_1.default>
                <Typography_1.default sx={{ pt: "5px", fontSize: "14px", marginBottom: "40px" }}>
                  *This bot currently uses Tinyman as a price oracle.
                </Typography_1.default>

                <Box_1.default sx={cardStyles}>
                  <Typography_1.default marginBottom={"20px"}>
                    Order Size (in ALGOs)
                    <InfoRounded_1.default sx={{
                    marginLeft: "5px",
                    fontSize: "16px",
                    color: "secondary.dark",
                }}/>
                  </Typography_1.default>
                  <Grid_1.default container sx={{
                    alignItems: "center",
                    rowGap: "5px",
                    marginBottom: "20px",
                }}>
                    <Grid_1.default item lg={9} md={8} xs={12}>
                      <formik_1.Field component={CustomRangeSlider_1.default} name="orderAlgoDepth" id="orderAlgoDepth" max={1000}/>
                      <Typography_1.default sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "13px",
                }}>
                        <span>0</span>
                        <span>1000</span>
                      </Typography_1.default>
                    </Grid_1.default>
                    <Grid_1.default item md={2} marginLeft={"auto"}>
                      <formik_1.Field component={CustomTextInput_1.default} type="number" name="orderAlgoDepth" id="orderAlgoDepth" max={1000} required sx={{
                    input: {
                        padding: "6.5px 14px",
                        width: "55px",
                    },
                }}/>
                    </Grid_1.default>
                  </Grid_1.default>
                  <Note_1.Note note="These settings qualify for ALGX Rewards." link={{
                    url: "https://docs.algodex.com/rewards-program/algx-liquidity-rewards-program",
                    title: "Read about Rewards Calcuations",
                }}/>
                </Box_1.default>

                <Box_1.default sx={cardStyles}>
                  <Typography_1.default marginBottom={"20px"}>
                    Spread Percentage
                    <InfoRounded_1.default sx={{
                    marginLeft: "5px",
                    fontSize: "16px",
                    color: "secondary.dark",
                }}/>
                  </Typography_1.default>
                  <Grid_1.default container sx={{
                    alignItems: "center",
                    rowGap: "5px",
                    marginBottom: "20px",
                }}>
                    <Grid_1.default item lg={9} md={8} xs={12}>
                      <formik_1.Field component={CustomRangeSlider_1.default} name="minSpreadPerc" id="minSpreadPerc" max={100}/>
                      <Typography_1.default sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "13px",
                }}>
                        <span>0</span>
                        <span>100</span>
                      </Typography_1.default>
                    </Grid_1.default>
                    <Grid_1.default item md={2} marginLeft={"auto"}>
                      <formik_1.Field component={CustomTextInput_1.default} type="number" name="minSpreadPerc" id="minSpreadPerc" max={100} required sx={{
                    input: {
                        padding: "6.5px 14px",
                        width: "55px",
                    },
                }}/>
                    </Grid_1.default>
                  </Grid_1.default>
                  <Note_1.Note note="These settings qualify for ALGX Rewards." link={{
                    url: "https://docs.algodex.com/rewards-program/algx-liquidity-rewards-program",
                    title: "Read about Rewards Calcuations",
                }}/>
                </Box_1.default>
                <Box_1.default sx={cardStyles}>
                  <Typography_1.default marginBottom={"20px"}>
                    Number of Orders
                    <InfoRounded_1.default sx={{
                    marginLeft: "5px",
                    fontSize: "16px",
                    color: "secondary.dark",
                }}/>
                  </Typography_1.default>
                  <Grid_1.default container sx={{
                    alignItems: "center",
                    rowGap: "5px",
                    marginBottom: "20px",
                }}>
                    <Grid_1.default item lg={9} md={8} xs={12}>
                      <formik_1.Field component={CustomRangeSlider_1.default} name="ladderTiers" id="ladderTiers" max={10}/>
                      <Typography_1.default sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "13px",
                }}>
                        <span>0</span>
                        <span>10</span>
                      </Typography_1.default>
                    </Grid_1.default>
                    <Grid_1.default item md={2} marginLeft={"auto"}>
                      <formik_1.Field component={CustomTextInput_1.default} type="number" name="ladderTiers" id="ladderTiers" max={10} required sx={{
                    input: {
                        padding: "6.5px 14px",
                        width: "55px",
                    },
                }}/>
                    </Grid_1.default>
                  </Grid_1.default>
                </Box_1.default>
                <Accordion_1.default sx={cardStyles}>
                  <AccordionSummary_1.default expandIcon={<ExpandMore_1.default />} aria-controls="panel1a-content" id="panel1a-header" sx={{
                    minHeight: 0,
                    padding: 0,
                    "&.Mui-expanded": {
                        minHeight: 0,
                        borderBottom: "solid 1px",
                        borderColor: "grey.100",
                        paddingBottom: "14px",
                    },
                    ".MuiAccordionSummary-content, .MuiAccordionSummary-content.Mui-expanded": {
                        margin: 0,
                    },
                }}>
                    <Typography_1.default sx={{
                    fontSize: "20px",
                    fontWeight: 500,
                }}>
                      Advanced Options
                    </Typography_1.default>
                  </AccordionSummary_1.default>
                  <AccordionDetails_1.default>
                    <Typography_1.default marginBottom={"20px"}>
                      Nearest Neighbor Keep
                      <InfoRounded_1.default sx={{
                    marginLeft: "5px",
                    fontSize: "16px",
                    color: "secondary.dark",
                }}/>
                    </Typography_1.default>
                    <Grid_1.default container sx={{
                    alignItems: "center",
                    rowGap: "5px",
                    marginBottom: "20px",
                }}>
                      <Grid_1.default item lg={9} md={8} xs={12}>
                        <formik_1.Field component={CustomRangeSlider_1.default} name="nearestNeighborKeep" id="nearestNeighborKeep" max={10}/>
                        <Typography_1.default sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "13px",
                }}>
                          <span>0</span>
                          <span>10</span>
                        </Typography_1.default>
                      </Grid_1.default>
                      <Grid_1.default item md={2} marginLeft={"auto"}>
                        <formik_1.Field component={CustomTextInput_1.default} type="number" name="nearestNeighborKeep" id="nearestNeighborKeep" max={10} required sx={{
                    input: {
                        padding: "6.5px 14px",
                        width: "55px",
                    },
                }}/>
                      </Grid_1.default>
                    </Grid_1.default>
                  </AccordionDetails_1.default>
                </Accordion_1.default>
                {!loading ? (<LoadingButton_1.default variant="contained" fullWidth type="submit" loading={loading} disabled={loading || !isValid} sx={{ py: "0.8rem", mt: "1rem" }}>
                    Start Bot
                  </LoadingButton_1.default>) : (<Button_1.default variant="contained" fullWidth type="button" sx={{ py: "0.8rem", mt: "1rem" }} onClick={stopBot}>
                    Stop Bot
                  </Button_1.default>)}
              </>
            </formik_1.Form>);
        }}
      </formik_1.Formik>
    </>);
};
exports.BotForm = BotForm;
