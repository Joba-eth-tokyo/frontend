import Cookies from 'js-cookie';
import jwt_decode from 'jwt-decode';
import { useRouter } from 'next/router';
import type { Dispatch, ReactNode, SetStateAction } from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

import WalletConnectModal from '@/components/WalletConnectModal';

import { useAuth } from './auth';

type SignModalType = {
  openSignModal: boolean;
  setOpenSignModal: Dispatch<SetStateAction<boolean>>;
  isSignIn: boolean;
};

const SignMessageContext = createContext({} as SignModalType);

export const SignMessageModalProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [openSignModal, setOpenSignModal] = useState(false);
  const router = useRouter();
  const accessToken = Cookies.get('access_token');
  const { address } = useAccount();
  const { userData } = useAuth();
  const [isSignIn, setIsSignIn] = useState(true);

  useEffect(() => {
    if (accessToken) {
      const decodedToken = jwt_decode(accessToken) as any;
      const { wallet_address: walletAddress } = decodedToken;
      if (walletAddress && address && walletAddress !== address) {
        setOpenSignModal(true);
        setIsSignIn(false);
      }
    }
  }, [accessToken, address]);

  return (
    <SignMessageContext.Provider
      value={{
        openSignModal,
        setOpenSignModal,
        isSignIn,
      }}
    >
      {children}
      <WalletConnectModal
        open={openSignModal}
        setOpen={setOpenSignModal}
        isRedirect={!userData?.is_signup_completed}
        from={router.asPath}
        showConnectors={false}
      />
    </SignMessageContext.Provider>
  );
};

export const useSignMessageModal = () => useContext(SignMessageContext);
