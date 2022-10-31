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
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

const CustomTextInput = ({
  field,
  form: { touched, errors },
  type,
  min,
  max,
  ...props
}: {
  className?: string;
  field: HTMLFormElement;
  type?:string;
  min?: number,
  max?: number,
  form: { touched: any; errors: any };
}) => {
  const hasError = touched[field.name] && errors[field.name];

  return (
    <Fragment>
      <TextField
        name={field.name}
        value={field.value}
        onChange={field.onChange}
        onBlur={field.onBlur}
        fullWidth
        type={type || 'text'}
        {...props}
        InputProps={type === 'number' ? { inputProps: { min, max } }:{}}
        />
      {hasError && (
        <Typography sx={{ pt: "5px", color: "error.main", fontSize: "12px" }}>
          {errors[field.name]}
        </Typography>
      )}
    </Fragment>
  );
};

export default CustomTextInput;
