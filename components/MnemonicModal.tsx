import React from "react";

//MUI Components
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";

export const MnemonicModal = ({
  open,
  handleClose,
}: {
  open: boolean;
  handleClose: any;
}) => {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={{
          position: "absolute" as "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 900,
          maxWidth: "100%",
          bgcolor: "accent.contrastText",
          boxShadow: 2,
          borderRadius: "6px",
          padding: "20px 20px",
          maxHeight: "100%",
          overflow: "scroll",
        }}
      >
        <Typography
          sx={{
            fontSize: "18px",
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
            width: "fit-content",
            marginBottom: "25px",
          }}
          onClick={handleClose}
        >
          <ChevronLeftIcon sx={{ fontSize: "30px" }} />
          CANCEL
        </Typography>
        <Box
          sx={{
            paddingInline: "1rem",
            "@media(min-width:800px)": {
              paddingInline: "4rem",
            },
          }}
        >
          <Box
            sx={{
              marginBottom: "30px",
              display: "flex",
              columnGap: "10px",
              "@media(min-width:800px)": {
                paddingLeft: "4rem",
              },
            }}
          >
            <FormatListBulletedIcon
              sx={{
                fontSize: "40px",
                marginTop: "10px",
                "@media (max-width: 330px)": {
                  display: "none",
                },
              }}
            />
            <Box>
              <Typography
                sx={{
                  fontSize: "22px",
                  fontWeight: 700,
                }}
              >
                Import Wallet with Mnemonic Phrase
              </Typography>

              <Typography
                sx={{
                  fontSize: "16px",
                  fontWeight: 500,
                  marginBottom: "10px",
                  color: "primary.dark",
                }}
              >
                Enter the 25 word seed phrase to connect your wallet.
              </Typography>
              <Typography
                sx={{
                  fontSize: "12px",
                  fontStyle: "italic",
                }}
              >
                The entered mnemonic is encrypted only stored locally on this
                device. Algodex cannot access your mnemonic phrase and is not
                responsible for any lost funds if you lose your wallet mnemonic.
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))",
              gridRowGap: "30px",
              gridColumnGap: "30px",
              "@media (max-width: 501px)": {
                gridTemplateColumns: "repeat(auto-fit, minmax(60px, 1fr))",
              },
            }}
          >
            {[...Array(25)].map((item, index) => (
              <Box
                key={index}
                sx={{
                  background: "transparent",
                  border: "1px solid",
                  borderRadius: "3px",
                  overflow: "hidden",
                  borderColor: "grey.200",
                  display: "flex",
                  padding: "2px 4px",
                  input: {
                    width: "100%",
                    border: "none",
                    fontSize: "16px",
                    "&:focus": {
                      outline: "none",
                    },
                  },
                }}
              >
                {index + 1}.
                <input type="text" />
              </Box>
            ))}
          </Box>
          <Box sx={{ textAlign: "center", marginBlock: "40px" }}>
            <Button variant="outlined">IMPORT WALLET</Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};
