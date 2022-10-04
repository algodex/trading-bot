import { Typography } from "@mui/material";
import Image from "next/image";
import React from "react";
import Link from "./Nav/Link";

// custom components
// import Link from "./Nav/Link";

export const Logo = ({ styles }: { styles?: object }) => {
  return (
    <div style={styles}>
      <Link
        href="/"
        sx={{ display: "flex", alignItems: "baseline", textDecoration: "none" }}
      >
        <Image
          src="/algodex-logo.svg"
          alt="Algodex Logo"
          width="188"
          height="30"
        />
        <Typography fontWeight={700} fontSize={"1.2rem"} marginLeft={"8px"}>
          Market Making Bot
        </Typography>
      </Link>
    </div>
  );
};
