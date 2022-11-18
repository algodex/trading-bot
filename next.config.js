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

const withPWA = require("next-pwa")({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
});
const { i18n } = require("./next-i18next.config");
/** @type {import('next').NextConfig} */

const rewrites = () => {
  return [
    {
      source: "/algodex-mainnet/:path*",
      destination: "https://app.algodex.com/api/v2/:path*",
    },
    {
      source: "/algodex-testnet/:path*",
      destination: "https://testnet.algodex.com/api/v2/:path*",
    },
  ];
};

const nextConfig = {
  reactStrictMode: true,
  i18n,
  rewrites,
  swcMinify: true,
};

module.exports = withPWA(nextConfig);
