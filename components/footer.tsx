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

import React from "react";

//MUI components
import Box from "@mui/material/Box";
import GitHubIcon from "@mui/icons-material/GitHub";
import RedditIcon from "@mui/icons-material/Reddit";
import TelegramIcon from "@mui/icons-material/Telegram";
import TwitterIcon from "@mui/icons-material/Twitter";

//Algodex
import Link from "./Nav/Link";
import Image from "next/image";

export const Footer = () => {
  return (
    <Box
      sx={{
        backgroundColor: "primary.main",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "16px 17px",
        position: "absolute",
        bottom: 0,
        right: 0,
        width: "100%",
        flexWrap: "wrap",
        // "@media(max-width:600px)": {
        //   flexDirection: "column-reverse",
        //   alignItems: "end",
        // },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "13px",
        }}
      >
        <Link
          href="http://t.me/algodex"
          target="_blank"
          rel="noreferrer"
          sx={{
            color: "secondary.contrastText",
            fontWeight: 600,
            fontSize: "14px",
          }}
        >
          © Algonaut Capital 2022
        </Link>
        {/* <Link
          href="http://t.me/algodex"
          target="_blank"
          rel="noreferrer"
          sx={{
            color: "secondary.contrastText",
            fontWeight: 600,
            fontSize: "14px",
          }}
        >
          Disclosures
        </Link>
        <Link
          href="http://t.me/algodex"
          target="_blank"
          rel="noreferrer"
          sx={{
            color: "secondary.contrastText",
            fontWeight: 600,
            fontSize: "14px",
          }}
        >
          Privacy Policy
        </Link> */}
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "13px",
          lineHeight: 0,
        }}
      >
        <Link href="http://t.me/algodex" target="_blank" rel="noreferrer">
          <TelegramIcon sx={{ fontSize: "1.5rem", color: "secondary.dark" }} />
        </Link>

        <Link
          href="https://discord.gg/qS3Q7AqwF6"
          target="_blank"
          rel="noreferrer"
        >
          <Image src="/discord.svg" alt="Discord Logo" width="17" height="17" />
        </Link>
        <Link
          href="https://github.com/algodex/trading-bot/issues"
          target="_blank"
          rel="noreferrer"
        >
          <GitHubIcon sx={{ fontSize: "1.3rem", color: "secondary.dark" }} />
        </Link>
        <Link
          href="https://www.reddit.com/r/Algodex/"
          target="_blank"
          rel="noreferrer"
        >
          <RedditIcon sx={{ fontSize: "1.6rem", color: "secondary.dark" }} />
        </Link>
        <Link
          href="https://twitter.com/AlgodexOfficial"
          target="_blank"
          rel="noreferrer"
        >
          <TwitterIcon sx={{ fontSize: "1.4rem", color: "secondary.dark" }} />
        </Link>
      </Box>
    </Box>
  );
};
