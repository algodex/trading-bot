import { PassPhrase } from "@/components/Form/CustomPasswordInput";
import { getWallet } from "@/lib/storage";
import { Environment } from "@/lib/types/config";
import { useRouter } from "next/router";
import React, {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react";

export const AppContext: any = createContext(null);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const [walletAddr, setWalletAddr] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState({});
  const [mnemonic, setMnemonic] = useState("");
  const [openValidateModal, setOpenValidateModal] = useState(false);
  const [openMnemonic, setOpenMnemonic] = useState<string | null>(null);
  const [forgotPassphrase, setForgotPassphrase] = useState<boolean>(false);
  const [environment, setEnvironment] = useState<any | Environment>();
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

  useEffect(() => {
    const currentPath = router.asPath.split("/")[1];
    if (!environment) {
      setEnvironment(router.asPath.split("/")[1]);
    } else if (currentPath !== environment) {
      router.push(`/${router.locale}/${environment}`);
    }
  }, [router, environment]);

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
        loading,
        setLoading,
        formValues,
        setFormValues,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
