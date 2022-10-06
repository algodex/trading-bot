import { Typography } from "@mui/material";
import Image from "next/image";
import React from "react";

// custom components
import Link from "./Nav/Link";

export const Logo = ({
  styles,
  isMobile,
}: {
  styles?: object;
  isMobile: boolean;
}) => {
  return (
    <div style={styles}>
      <Link
        href="/"
        sx={{
          display: "flex",
          alignItems: "baseline",
          textDecoration: "none",
          color: "#1A202C",
        }}
      >
        {isMobile ? (
          <Image
            src="/algodex-icon.svg"
            alt="Algodex Icon Logo"
            width="24"
            height="24"
          />
        ) : (
          <Image
            src="/algodex-logo.svg"
            alt="Algodex Logo"
            width="160"
            height="30"
          />
        )}
        <Typography fontWeight={700} fontSize={"18px"} marginLeft={"10px"}>
          Market Making Bot
        </Typography>
      </Link>
    </div>
  );
};
