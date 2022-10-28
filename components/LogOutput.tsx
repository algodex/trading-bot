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
          textareaRef.current.scrollTop = textareaRef.current.scrollHeight + 200;
        }
      }
    );

    return () => events.off("running-bot");
  }, []);

  return (
    <>
      <TextareaAutosize
        ref={textareaRef}
        value={logs}
        style={{ width: "100%", height:'85vh', overflow:'scroll' }}
        readOnly
      />
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
