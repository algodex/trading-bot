import React, { Fragment } from "react";

//MUI Components
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";

const RangeSlider = ({
  className,
  field,
  form: { touched, errors },
  ...props
}: {
  className?: string,
  field: HTMLFormElement,
  form: { touched: any, errors: any },
}) => {
  const hasError = touched[field.name] && errors[field.name];

  return (
    <Fragment>
      <TextField
        name={field.name}
        label={field.name}
        value={field.value}
        onChange={field.onChange}
        onBlur={field.onBlur}
        placeholder="Description"
        fullWidth
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

export default RangeSlider;
