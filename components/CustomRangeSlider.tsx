import React, { Fragment } from "react";

//MUI Components
import Typography from "@mui/material/Typography";
import Slider from "@mui/material/Slider";

const CustomRangeSlider = ({
  className,
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
