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

import React, { useEffect, useState } from "react";

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
  verification: {
    reputation: string;
  };
  destroyed: boolean;
  name: string;
  id: number;
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

  const fetchData = () => {
    clearTimeout(timer);
    const newTimer = setTimeout(async () => {
      setAssetValue(null);
      setLoading(true);
      const res: any = await searchAlgoAssets(query.trim(), environment);
      setLoading(false);
      if (res.data?.assets) {
        const assets: AssetSchema[] = res.data.assets;
        const list = [...assets].filter((asset) => !asset.destroyed);
        if (list.length == 1) {
          setFieldValue(name, list[0].id);
          setAssetValue(list[0]);
        }
        setSuggestedAssets(
          list.map((asset) => {
            return { ...asset, name: `${asset.id} - ${asset.name}` };
          })
        );
      }
    }, 500);
    setTimer(newTimer);
  };

  const VerifyIcon = ({ reputation }: { reputation: string }) => {
    return (
      <>
        {reputation == "Verified" ? (
          <VerifiedUserIcon
            sx={{ marginLeft: 2, color: "info.main", fontSize: "10px" }}
          />
        ) : reputation == "Notable" ? (
          <CheckCircleIcon
            sx={{
              marginLeft: 2,
              color: "info.success",
              opacity: "0.8",
              fontSize: "10px",
            }}
          />
        ) : reputation == "Neutral" ? (
          <CheckCircleIcon
            sx={{
              marginLeft: 2,
              color: "info.success",
              opacity: "0.3",
              fontSize: "10px",
            }}
          />
        ) : null}
      </>
    );
  };

  useEffect(() => {
    if (query.split("").length > 2) {
      fetchData();
    }
  }, [query]);

  useEffect(() => {
    setQuery("");
    setAssetValue(null);
  }, [environment]);

  return (
    <>
      <Autocomplete
        disablePortal
        getOptionLabel={(option) => option.name}
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
            {option.name}
            {option.verification && (
              <VerifyIcon reputation={option.verification.reputation} />
            )}
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
                    <VerifyIcon
                      reputation={
                        (assetValue as AssetSchema)?.verification?.reputation
                      }
                    />
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
