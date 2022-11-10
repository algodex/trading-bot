import events from "@/lib/events";
import React, { useEffect, useRef, useState } from "react";

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

//Custom styles
import { cardStyles } from "./BotForm";
import { storageKeys } from "@/lib/storage";

export const LogOutput = () => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [delCount, setDelCount] = useState(0);

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
          const total = value.split("").length;
          if (delCount > 0 && total > delCount) {
            textareaRef.current.value = `${value
              .split("")
              .slice(delCount, total)
              .join("")} \n${status} \n ${content}`;
          } else {
            textareaRef.current.value = `${value} \n ${status} \n ${content}`;
          }
          textareaRef.current.focus();
          textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
        }
      }
    );

    return () => events.off("running-bot");
  }, [delCount]);

  const handleChange = ({ target: { value } }: { target: any }) => {
    setDelCount(value);
    localStorage.setItem(storageKeys.logSetting, value);
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
          "@media(min-width:1200px)": {
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
        <Box sx={{ textAlign: "end" }}>
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
    </>
  );
};
