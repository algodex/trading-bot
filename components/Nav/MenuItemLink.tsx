import React, { forwardRef, MouseEventHandler, ReactNode, useMemo } from "react";
import { useRouter } from "next/router";
import PropTypes from "prop-types";

// MUI Components
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";

// Custom Components
import CustomLink from "@/components/Nav/Link";

/**
 * ListItemLink
 *
 * @param icon
 * @param primary
 * @param to
 * @returns {JSX.Element}
 * @see https://mui.com/guides/routing/#list
 * @constructor
 */
function MenuItemLink({
  locale,
  icon,
  primary,
  to,
}: {
  locale: string;
  icon: ReactNode;
  primary: string;
  to: string;
}) {
  const router = useRouter();
  const activeNav = router.asPath;

  const renderLink = useMemo(
    () =>
      forwardRef(function Link(itemProps, ref) {
        return (
          <CustomLink
            locale={locale}
            href={to}
            ref={ref}
            {...itemProps}
            role={undefined}
          />
        );
      }),
    [to]
  );

  return (
    <MenuItem
      component={renderLink}
      selected={activeNav === to}
    >
      {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
      <ListItemText primary={primary} />
    </MenuItem>
  );
}

export default MenuItemLink;
