"use strict";
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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const React = __importStar(require("react"));
const prop_types_1 = __importDefault(require("prop-types"));
const clsx_1 = __importDefault(require("clsx"));
// Next Components
const link_1 = __importDefault(require("next/link"));
const router_1 = require("next/router");
// MUI Components
const styles_1 = require("@mui/material/styles");
const Link_1 = __importDefault(require("@mui/material/Link"));
// Add support for the sx prop for consistency with the other branches.
const Anchor = (0, styles_1.styled)("a")({});
const NextLinkComposed = React.forwardRef(function NextLinkComposed(props, ref) {
    // eslint-disable-next-line no-unused-vars
    const { to, linkAs, replace, scroll, shallow, prefetch, locale, ...other } = props;
    return (<link_1.default href={to} prefetch={prefetch} as={linkAs} replace={replace} scroll={scroll} shallow={shallow} passHref locale={locale}>
      <Anchor ref={ref} {...other}/>
    </link_1.default>);
});
/**
 * Link
 *
 * A styled version of the Next.js Link component
 *
 * @see https://nextjs.org/docs/api-reference/next/link
 * @component
 * @example
 * render(
 *   <Link href="/" color="secondary">
 *     Go to the home page
 *   </Link>
 * )
 */
const Link = React.forwardRef(function Link(props, ref) {
    const { activeClassName = "active", as: linkAs, className: classNameProps, href, noLinkStyle, 
    // eslint-disable-next-line no-unused-vars
    role, // Link don't have roles.
    ...other } = props;
    const router = (0, router_1.useRouter)();
    const pathname = typeof href === "string" ? href : href.pathname;
    const className = (0, clsx_1.default)(classNameProps, {
        [activeClassName]: router.pathname === pathname && activeClassName,
    });
    const isExternal = typeof href === "string" &&
        (href.indexOf("http") === 0 || href.indexOf("mailto:") === 0);
    if (isExternal) {
        if (noLinkStyle) {
            return <Anchor className={className} href={href} ref={ref} {...other}/>;
        }
        return <Link_1.default className={className} href={href} ref={ref} {...other}/>;
    }
    if (noLinkStyle) {
        return (<NextLinkComposed className={className} ref={ref} to={href} {...other}/>);
    }
    return (<Link_1.default component={NextLinkComposed} linkAs={linkAs} className={className} ref={ref} to={href} {...other}/>);
});
Link.propTypes = {
    locale: prop_types_1.default.any,
    /**
     * Active Classname
     */
    activeClassName: prop_types_1.default.string,
    /**
     * As component
     */
    as: prop_types_1.default.oneOfType([prop_types_1.default.object, prop_types_1.default.string]),
    /**
     * Class name to apply
     */
    className: prop_types_1.default.string,
    /**
     * Href location
     */
    href: prop_types_1.default.any,
    /**
     * Link as Component
     */
    linkAs: prop_types_1.default.oneOfType([prop_types_1.default.object, prop_types_1.default.string]),
    /**
     * Remove link style
     */
    noLinkStyle: prop_types_1.default.bool,
    /**
     * Element role
     */
    role: prop_types_1.default.string,
};
exports.default = Link;
