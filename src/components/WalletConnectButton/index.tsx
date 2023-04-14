import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useAccount, useEnsName } from 'wagmi';

import { useAuth } from '@/context/auth';
import { truncateString } from '@/utils/truncateString';
import { URLS } from '@/utils/urls';

import Button from '../Button';
import WalletConnectModal from '../WalletConnectModal';

const WalletConnectButton = ({
  isRedirect = true,
}: {
  isRedirect?: boolean;
}) => {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const {
    accessToken,
    userData,
    loading,
    handleLogout,
    isDisconnectedSuccess,
    isDisconnecting,
  } = useAuth();
  const { data: ensName } = useEnsName({ address });

  const [openModal, setOpenModal] = useState<boolean>(false);
  const [isDisconnectBtn, setIsDisconnectBtn] = useState<boolean>(false);

  useEffect(() => {
    if (isDisconnectedSuccess) {
      setIsDisconnectBtn(false);
    }
  }, [isDisconnectedSuccess]);

  useEffect(() => {
    if (!isDisconnecting && !loading && isConnected && !accessToken) {
      setOpenModal(true);
    }
  }, [accessToken, isConnected, isDisconnecting, loading]);

  return (
    <div>
      <WalletConnectModal
        isRedirect={isRedirect}
        open={openModal}
        setOpen={setOpenModal}
      />
      {!isConnected ? (
        <Button
          buttonType="outlined"
          size="small"
          className="sm:px-[42px] sm:py-[13px]"
          onClick={() => {
            setOpenModal(!openModal);
          }}
        >
          Connect wallet
        </Button>
      ) : (
        <div
          onMouseEnter={() => {
            setIsDisconnectBtn(true);
          }}
          onMouseLeave={() => {
            setIsDisconnectBtn(false);
          }}
          className="relative"
        >
          <Button
            buttonType="dark"
            size="small"
            className="sm:px-[42px] sm:py-[13px]"
            onClick={() => {
              if (isRedirect) {
                router.push(
                  address && userData && userData.is_signup_completed
                    ? URLS.DASHBOARD_HOME
                    : URLS.CREATE_PROFILE
                );
              }
            }}
          >
            {address && (
              <>
                <span className="hidden md:block">
                  {ensName ||
                    `(${truncateString({
                      string: address,
                    })})`}
                </span>
                <span className=" md:hidden">
                  {ensName ||
                    `(${truncateString({
                      string: address,
                      afterDotsStringLength: 3,
                    })})`}
                </span>
              </>
            )}
          </Button>
          {isDisconnectBtn && (
            <div className="absolute bottom-[-105%] right-0 flex w-full animate-fade-in-down flex-col items-center justify-center rounded-lg border border-brandGray-100 bg-white shadow duration-150">
              <button
                type="button"
                onClick={() => {
                  handleLogout();
                }}
                className="w-full rounded-lg py-3 text-base font-semibold hover:bg-brandWhite-200"
              >
                Disconnect
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WalletConnectButton;
