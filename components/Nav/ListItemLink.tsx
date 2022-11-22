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

import React, { forwardRef, ReactNode, useMemo } from "react";

// MUI Components
import ListItem from "@mui/material/ListItem";
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
 * @param rest
 * @returns {JSX.Element}
 * @see https://mui.com/guides/routing/#list
 * @constructor
 */
function ListItemLink({
  icon,
  primary,
  to,
  ...rest
}: {
  icon: ReactNode;
  primary: string;
  to: string;
  onClick: () => void;
}) {
  const renderLink = useMemo(
    () =>
      forwardRef(function Link(itemProps, ref) {
        return (
          <CustomLink
            href={to}
            ref={ref}
            {...itemProps}
            target="_blanc"
            role={undefined}
          />
        );
      }),
    [to]
  );

  return (
    <li>
      <ListItem button component={renderLink} {...rest}>
        {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
        <ListItemText primary={primary} />
      </ListItem>
    </li>
  );
}

export default ListItemLink;
