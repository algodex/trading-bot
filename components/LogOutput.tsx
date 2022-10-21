import events from "@/lib/events";
import React, { useEffect, useRef, useState } from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import TextareaAutosize from "@mui/material/TextareaAutosize";

export const LogOutput = () => {
  const [logs, setLogs] = useState<string>("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    events.on(
      "running-bot",
      ({ status, content }: { status: string; content: string }) => {
        setLogs((prev) => `${prev} \n ${status} \n ${content}`);
        if (textareaRef.current) {
          textareaRef.current.focus();
          textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
        }
      }
    );

    return () => events.off("running-bot");
  }, []);

  return (
    <>
      <TextareaAutosize
        ref={textareaRef}
        minRows={30}
        maxRows={30}
        value={logs}
        style={{ width: "100%" }}
        readOnly
      />

      {/* <textarea
        ref={textareaRef}
        //         multiline
        rows={20}
        value={logs}
        // maxRows={20}
        //         fullWidth
        //         focused
      ></textarea> */}
      <Box sx={{ textAlign: "end" }}>
        <Button
          variant="outlined"
          sx={{ marginTop: "10px" }}
          onClick={() => {
            setLogs("");
          }}
        >
          CLEAR LOGS
        </Button>
      </Box>
    </>
  );
};
