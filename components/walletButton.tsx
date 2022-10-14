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

import React, { useMemo, useState } from "react";

//MUI Components
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

// Custom components
import { MnemonicModal } from "./MnemonicModal";
import { shortenAddress } from "@/lib/helper";
import { getWallet } from "@/lib/storage";
import { DisconnectWallet } from "./disconnectWallet";

export const WalletButton = () => {
  const [openModal, setOpenModal] = useState<string | null>(null);
  const handleOpenModal = () => {
    if (getWallet()) {
      setOpenModal("disconnect");
    } else {
      setOpenModal("mnemonic");
    }
  };
  const handleCloseModal = () => setOpenModal(null);

  const walletAddr = useMemo(() => {
    return getWallet();
  }, [openModal]);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          columnGap: "9px",
          justifyContent: "end",
          flexWrap: "wrap",
          "@media(max-width:900px)": {
            justifyContent: "start",
          },
        }}
      >
        <Typography sx={{ fontWeight: 600, fontSize: "17px" }}>
          Connected Wallet:
        </Typography>
        <Button variant="outlined" onClick={handleOpenModal}>
          {getWallet() ? shortenAddress(walletAddr || '') : "Input Mnemonic"}
        </Button>
      </Box>
      <MnemonicModal
        open={openModal === "mnemonic"}
        handleClose={handleCloseModal}
      />
      <DisconnectWallet
        open={openModal === "disconnect"}
        handleClose={handleCloseModal}
      />
    </>
  );
};
