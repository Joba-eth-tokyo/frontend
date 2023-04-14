import { useModal } from 'connectkit';
import Cookies from 'js-cookie';
import type { Dispatch, ReactNode, SetStateAction } from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import { useAccount, useDisconnect, useNetwork } from 'wagmi';

import { getProfile } from '@/api';
import { getAllInvoiceStatus } from '@/api/invoiceStatus';
import type { InvoiceStatusType, UserData } from '@/types';

import { useToast } from './Toast';

type AuthType = {
  accessToken?: string;
  userData: UserData | null;
  setUserData: Dispatch<SetStateAction<UserData | null>>;
  getUserData: () => void;
  handleLogout: () => void;
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
  invoiceStatusList: InvoiceStatusType[];
  isDisconnectedSuccess: boolean;
  isDisconnecting: boolean;
};

const AuthContext = createContext({} as AuthType);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { address, isConnecting } = useAccount();
  const {
    disconnect,
    isSuccess: isDisconnectedSuccess,
    isError,
    error,
    isLoading: isDisconnecting,
  } = useDisconnect();

  const { toastError, toastSuccess } = useToast();

  const [invoiceStatusList, setInvoiceStatusList] = useState<
    InvoiceStatusType[]
  >([]);

  const { setOpen } = useModal();
  const { chain, chains } = useNetwork();

  useEffect(() => {
    if (isError && error && error.message) {
      toastError(error.name, error.message);
    }

    if (isDisconnectedSuccess) {
      toastSuccess('Wallet Disconnect', `Wallet disconnected successfully`);
    }
  }, [isDisconnectedSuccess, isError, error]);

  useEffect(() => {
    if (chains && chain && chains.length > 0) {
      const isValidNetwork = chains.find((ntw) => ntw.id === chain?.id);
      if (isValidNetwork) {
        setOpen(false);
      }
    }
  }, [chain, chains]);

  const accessToken = Cookies.get('access_token');

  const resetUserData = () => {
    setUserData(null);
    setLoading(false);
  };

  const handleLogout = () => {
    disconnect();
    Cookies.remove('access_token');
    resetUserData();
  };

  const getUserData = async () => {
    if (!address) return;
    if (!loading) setLoading(true);

    try {
      const res = await getProfile(address);
      if (res.data) {
        setUserData(res.data);
      } else {
        setUserData(null);
      }
      setLoading(false);
    } catch (err) {
      resetUserData();
    }
  };

  useEffect(() => {
    if (address && !isConnecting) {
      getUserData();
    } else {
      resetUserData();
      Cookies.remove('access_token');
    }
  }, [address, isConnecting]);

  const fetchAllInvoiceStatus = async () => {
    try {
      const response = await getAllInvoiceStatus();
      if (response.data.length) {
        setInvoiceStatusList(response.data);
      }
    } catch (err: any) {
      if (err.response?.data?.message)
        toastError('Error', err.response.data.message);
    }
  };

  useEffect(() => {
    fetchAllInvoiceStatus();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        userData,
        setUserData,
        getUserData,
        handleLogout,
        loading,
        setLoading,
        invoiceStatusList,
        isDisconnectedSuccess,
        isDisconnecting,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
