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
