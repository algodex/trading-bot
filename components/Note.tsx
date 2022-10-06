import React from "react";

// Material UI components
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import Link from "./Nav/Link";

interface NoteSchema {
  link?: { url: string; title: string };
  icon?: any;
  note: string;
  styles?: object;
}

export const Note = ({
  link,
  icon: IconComponent,
  note,
  styles,
}: NoteSchema) => {
  return (
    <Box
      sx={{
        backgroundColor: "primary.main",
        color: "primary.contrastText",
        borderRadius: "3px",
        padding: "7px 12px",
        display: "flex",
        fontSize: "13px",
        alignItems: "flex-start",
        ...styles,
      }}
    >
      {IconComponent == "Empty" ? (
        <></>
      ) : IconComponent ? (
        <IconComponent />
      ) : (
        <CheckCircleOutlineRoundedIcon
          sx={{ marginRight: "5px", fontSize: "15px", marginTop:'3px' }}
        />
      )}
      <Box>
        {note && (
          <Typography fontSize={"14px"} fontWeight={700} fontStyle="italic">
            {note}{" "}
            {link && (
              <Link
                href={link.url}
                target={"_blanc"}
                sx={{
                  color: "accent.dark",
                }}
              >
                {link.title}
              </Link>
            )}
          </Typography>
        )}
      </Box>
    </Box>
  );
};
