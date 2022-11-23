import { PassPhrase } from "@/components/Form/CustomPasswordInput";
import { getWallet } from "@/lib/storage";
import { Environment } from "@/lib/types/config";
import React, {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

export const AppContext: any = createContext(null);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [walletAddr, setWalletAddr] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const formikRef = useRef<any>();
  const [mnemonic, setMnemonic] = useState("");
  const [openValidateModal, setOpenValidateModal] = useState(false);
  const [openMnemonic, setOpenMnemonic] = useState<string | null>(null);
  const [forgotPassphrase, setForgotPassphrase] = useState<boolean>(false);
  const [environment, setEnvironment] = useState<any | Environment>(
    process.env.NEXT_PUBLIC_ENVIRONMENT || "testnet"
  );
  const [passphrase, setPassphrase] = useState<PassPhrase>({
    password: "",
    show: false,
  });

  const validateWallet = useCallback(() => {
    if (walletAddr && !mnemonic) {
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
        environment,
        setEnvironment,
        formikRef,
        loading,
        setLoading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
