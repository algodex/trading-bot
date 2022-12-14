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

import React, { Fragment } from "react";

//MUI Components
import Typography from "@mui/material/Typography";
import Slider from "@mui/material/Slider";

const CustomRangeSlider = ({
  field,
  form: { touched, errors },
  ...props
}: {
  className?: string;
  field: HTMLFormElement;
  form: { touched: any; errors: any };
}) => {
  const hasError = touched[field.name] && errors[field.name];

  return (
    <Fragment>
      <Slider
        name={field.name}
        value={field.value}
        onChange={field.onChange}
        onBlur={field.onBlur}
        valueLabelDisplay="auto"
        color="primary"
        sx={{
          "color": "secondary.dark",
        }}
        {...props}
      />
      {hasError && (
        <Typography sx={{ pt: "5px", color: "error.main", fontSize: "12px" }}>
          {errors[field.name]}
        </Typography>
      )}
    </Fragment>
  );
};

export default CustomRangeSlider;
