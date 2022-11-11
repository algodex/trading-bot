import { PassPhrase } from "@/components/CustomPasswordInput";
import { getWallet } from "@/lib/storage";
import React, {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react";

export const AppContext: any = createContext(null);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [walletAddr, setWalletAddr] = useState<any>(null);
  const [mnemonic, setMnemonic] = useState("");
  const [openValidateModal, setOpenValidateModal] = useState(false);
  const [openMnemonic, setOpenMnemonic] = useState<string | null>(null);
  const [forgotPassphrase, setForgotPassphrase] = useState<boolean>(false);
  const [passphrase, setPassphrase] = useState<PassPhrase>({
    password: "",
    show: false,
  });

  const validateWallet = useCallback(() => {
    if (walletAddr && !mnemonic) {
      console.log("open here");
      setOpenValidateModal(true);
    }
  }, [walletAddr, mnemonic]);

  useEffect(() => {
    validateWallet();
    setWalletAddr(getWallet());
  }, [validateWallet]);

  const handleCloseValidate = useCallback((mnemonic?: string) => {
    setOpenValidateModal(false);
    if (mnemonic) {
      setMnemonic(mnemonic);
    }
  }, []);

  const clearPassphrase = () => {
    setForgotPassphrase(false);
    setPassphrase((prev: PassPhrase) => ({ ...prev, password: "" }));
  };

  return (
    <AppContext.Provider
      value={{
        mnemonic,
        setMnemonic,
        walletAddr,
        setWalletAddr,
        validateWallet,
        openValidateModal,
        setOpenValidateModal,
        openMnemonic,
        setOpenMnemonic,
        handleCloseValidate,
        passphrase,
        setPassphrase,
        clearPassphrase,
        forgotPassphrase,
        setForgotPassphrase,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
