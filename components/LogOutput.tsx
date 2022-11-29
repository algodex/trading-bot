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

import events from "@/lib/events";
import React, { useContext, useEffect, useRef, useState } from "react";

//MUI Components
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import Typography from "@mui/material/Typography";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Grid from "@mui/material/Grid";
import Slider from "@mui/material/Slider";
import TextField from "@mui/material/TextField";
import LoadingButton from "@mui/lab/LoadingButton";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";

//Custom styles
import { cardStyles } from "./BotForm";
import { storageKeys } from "@/lib/storage";

//Context
import { AppContext } from "@/context/appContext";

import { cancelAssetOrders } from "@/lib/cancelAssetOrders";

export const LogOutput = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("Must be inside of a App Provider");
  }
  const { walletAddr, mnemonic, environment, formikRef, loading }: any =
    context;
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [delCount, setDelCount] = useState(0);
  const [canceling, setCanceling] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const _default = localStorage.getItem(storageKeys.logSetting);
    setDelCount(_default ? parseFloat(_default) : 1000);
  }, []);

  useEffect(() => {
    events.on(
      "running-bot",
      ({ status, content }: { status: string; content: string }) => {
        if (textareaRef.current) {
          const value = textareaRef.current.value;
          //the space before the \n ensures it picks the next line and with the space before it
          const total = value.split(" \n").length;
          if (delCount > 0 && total > delCount) {
            textareaRef.current.value = `${value
              .split(" \n")
              .slice(delCount)
              .join("")} \n${status} ${content ? `\n${content}` : ""}`;
          } else {
            textareaRef.current.value = `${value} \n${status} ${
              content ? `\n${content}` : ""
            }`;
          }
          textareaRef.current.focus();
          textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
        }
      }
    );

    return () => events.off("running-bot");
  }, [delCount]);

  const handleChange = ({ target: { value } }: { target: any }) => {
    setDelCount(parseFloat(value));
    localStorage.setItem(storageKeys.logSetting, value);
  };

  const cancelOrders = async () => {
    if (formikRef.current.values.assetId) {
      setStatus("");
      try {
        setCanceling(true);
        await cancelAssetOrders(
          {
            address: walletAddr,
            mnemonic: mnemonic,
          },
          Number(formikRef.current.values.assetId),
          environment
        );
        // console.log({ res });
        setCanceling(false);
      } catch (error) {
        console.error(error);
        setStatus("Sorry, an error occurred");
        setCanceling(false);
      }
    } else {
      setStatus("Please enter valid assetId");
    }
  };

  return (
    <>
      <TextareaAutosize
        ref={textareaRef}
        style={{
          width: "100%",
          height: "85vh",
          overflow: "scroll",
        }}
        readOnly
      />
      <Box
        sx={{
          "@media(min-width:1426px)": {
            display: "flex",
            justifyContent: "space-between",
            gap: "20px",
          },
        }}
      >
        <Accordion
          sx={{ ...cardStyles, marginBlock: "20px !important", width: "100%" }}
        >
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
              Logs Settings
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography marginBottom={"20px"}>
              Auto Delete Logs after {delCount} Messages
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
                <Slider
                  name="delCount"
                  id="delCount"
                  value={delCount}
                  onChange={handleChange}
                  max={10000}
                  valueLabelDisplay="auto"
                  color="primary"
                  sx={{
                    color: "secondary.dark",
                  }}
                />
                <Typography
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "13px",
                  }}
                >
                  <span>0</span>
                  <span>10,000</span>
                </Typography>
              </Grid>
              <Grid item md={2} marginLeft={"auto"}>
                <TextField
                  type="number"
                  value={delCount}
                  name="delCount"
                  id="delCount"
                  onChange={handleChange}
                  InputProps={{ inputProps: { min: 0, max: 10000 } }}
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
        <Box
          sx={{
            justifyContent: "end",
            display: "flex",
            columnGap: "10px",
            height: "fit-content",
          }}
        >
          <LoadingButton
            variant="outlined"
            disabled={canceling || loading}
            loading={canceling}
            sx={{
              marginBlock: "30px",
              whiteSpace: "nowrap",
              borderColor: "error.main",
              color: "error.main",
              "&:hover": {
                backgroundColor: "error.main",
              },
            }}
            onClick={cancelOrders}
          >
            CANCEL ALL ORDERS
          </LoadingButton>
          <Button
            variant="outlined"
            sx={{ marginBlock: "30px", whiteSpace: "nowrap" }}
            onClick={() => {
              if (textareaRef.current) {
                textareaRef.current.value = "";
              }
            }}
          >
            CLEAR LOGS
          </Button>
        </Box>
      </Box>
      {status && (
        <Typography
          sx={{
            color: "error.main",
            fontSize: "12px",
            display: "flex",
            alignItems: "center",
            columnGap: "5px",
            justifyContent: "end",
          }}
        >
          <InfoRoundedIcon
            sx={{
              fontSize: "12px",
            }}
          />
          {status}
        </Typography>
      )}
    </>
  );
};
