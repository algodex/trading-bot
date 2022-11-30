import React from "react";
import Tooltip, { tooltipClasses, TooltipProps } from "@mui/material/Tooltip";
import styled from "@emotion/styled";

export const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }}></Tooltip>
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: (theme as any).palette.secondary.dark,
  },
}));
