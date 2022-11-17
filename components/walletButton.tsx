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

import React, { useContext, useEffect, useState } from "react";

//MUI Components
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

// Custom components
import { MnemonicModal } from "./Modals/MnemonicModal";
import { shortenAddress } from "@/lib/helper";
import { ExportWallet } from "./Modals/exportWallet";
import { AppContext } from "@/context/appContext";

export const WalletButton = ({ loading }: { loading: boolean }) => {
  const [openModal, setOpenModal] = useState<string | null>(null);
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("Must be inside of a App Provider");
  }
  const {
    mnemonic,
    walletAddr,
    validateWallet,
    openMnemonic,
    setOpenMnemonic,
  }: any = context;

  const handleOpenModal = () => {
    if (walletAddr && !mnemonic) {
      validateWallet();
    } else if (walletAddr) {
      setOpenModal("export");
    } else {
      setOpenModal("mnemonic");
    }
  };
  const handleCloseModal = () => setOpenModal(null);

  useEffect(() => {
    setOpenMnemonic(openModal);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openModal]);

  useEffect(() => {
    setOpenModal(openMnemonic);
  }, [openMnemonic]);

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
        <Button variant="outlined" onClick={handleOpenModal} disabled={loading}>
          {walletAddr ? shortenAddress(walletAddr || "") : "Input Mnemonic"}
        </Button>
      </Box>
      <MnemonicModal
        open={openModal === "mnemonic"}
        handleClose={handleCloseModal}
      />
      <ExportWallet
        open={openModal === "export"}
        handleClose={handleCloseModal}
      />
    </>
  );
};
