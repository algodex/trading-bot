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

import React, { useCallback, useEffect, useState } from "react";

//mui files
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

//Lib files
import { searchAlgoAssets } from "@/lib/helper";
import { Environment } from "@/lib/types/config";

interface AssetSchema {
  destroyed: boolean;
  assetId: number;
  assetName: string;
  decimals: number;
  formattedASALiquidity: string;
  formattedAlgoLiquidity: string;
  formattedPrice: string;
  hasOrders: boolean;
  isTraded: boolean;
  price: string;
  priceChg24Pct: number;
  total: number;
  unitName: string;
  "unit-name": string;
  verified: boolean;
}

export const AssetSearchInput = ({
  setFieldValue,
  name,
  environment,
}: {
  setFieldValue: any;
  name: string;
  environment: Environment;
}) => {
  const [query, setQuery] = useState("");
  const [suggestedAssets, setSuggestedAssets] = useState<any[]>([]);
  const [timer, setTimer] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [assetValue, setAssetValue] = useState<AssetSchema | null>(null);

  const searchASAs = useCallback(() => {
    clearTimeout(timer);
    const newTimer = setTimeout(async () => {
      setAssetValue(null);
      setLoading(true);
      const res: any = await searchAlgoAssets(query.trim(), environment);
      setLoading(false);
      if (res.data) {
        const assets: AssetSchema[] = res.data;
        const list = [...assets].filter((asset) => !asset.destroyed);
        if (list.length == 1) {
          setFieldValue(name, list[0].assetId);
          setAssetValue(list[0]);
        }
        setSuggestedAssets(
          list.map((asset) => {
            return {
              ...asset,
              assetName: `${asset.assetId} - ${
                asset.assetName || asset["unit-name"] || asset.unitName || ""
              }`,
            };
          })
        );
      } else {
        setSuggestedAssets([]);
      }
    }, 500);
    setTimer(newTimer);
  }, [environment, query]);

  const VerifyIcon = ({ verified }: { verified: boolean }) => {
    return (
      <>
        {verified ? (
          <VerifiedUserIcon
            sx={{ marginLeft: 2, color: "info.main", fontSize: "10px" }}
          />
        ) : null}
      </>
    );
  };

  useEffect(() => {
    searchASAs();
  }, [query, searchASAs, environment]);

  useEffect(() => {
    setQuery("");
    setAssetValue(null);
  }, [environment]);

  return (
    <>
      <Autocomplete
        disablePortal
        getOptionLabel={(option) => option.assetName}
        options={suggestedAssets}
        loading={loading}
        filterOptions={(x) => x}
        value={suggestedAssets.length == 1 ? suggestedAssets[0] : assetValue}
        onChange={(event, value) => {
          setFieldValue(name, value?.id || "");
          setAssetValue(value);
        }}
        renderOption={(props, option) => (
          <Box
            component="li"
            sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
            {...props}
          >
            {option.assetName}
            {option.verified && <VerifyIcon verified={option.verified} />}
          </Box>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading ? (
                    <CircularProgress color="primary" size={20} />
                  ) : (
                    <VerifyIcon verified={assetValue?.verified || false} />
                  )}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
            placeholder="Asset ID"
            value={query.trim()}
            onChange={({ target: { value } }) => {
              setQuery(value);
            }}
          />
        )}
      />
    </>
  );
};
