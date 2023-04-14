import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment, useEffect } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';

import { useAuth } from '@/context/auth';
import { useToast } from '@/context/Toast';

import { CrossIcon } from '../icons';
import { SignMessage } from '../SignMessage';

interface IConnectorsList {
  [key: string]: string;
}

const connectorsList: IConnectorsList = {
  metaMask: 'metamask-img.png',
  walletConnect: 'walletconnect-img.png',
  coinbaseWallet: 'coinbase-wallet-img.png',
};

const WalletConnectModal = ({
  open,
  setOpen,
  from,
  isRedirect = true,
  showConnectors = true,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isRedirect?: boolean;
  from?: string;
  showConnectors?: boolean;
}) => {
  const { toastError } = useToast();

  const { connect, connectors, error, isLoading, pendingConnector, isError } =
    useConnect();
  const { isConnected } = useAccount();
  const { handleLogout } = useAuth();

  const { isError: disConnectIsError, error: disConnectError } =
    useDisconnect();

  useEffect(() => {
    if (isError && error?.message) {
      toastError(error.name, error.message);
    }

    if (disConnectIsError && disConnectError?.message) {
      toastError(disConnectError.name, disConnectError.message);
    }
  }, [error, isError, disConnectIsError, disConnectError]);

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-20" onClose={() => {}}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25 dark:bg-brandBlack-200/25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className=" mx-auto my-6 w-auto max-w-3xl">
                <div className=" flex w-full flex-col rounded-lg border-0 bg-white p-8 shadow-lg outline-none focus:outline-none dark:bg-brandBlack-100">
                  <div className="flex items-start justify-between gap-6 rounded-t pb-6">
                    <h3 className="text-3xl font-semibold leading-8 dark:text-yellow-200">
                      Connect your wallet
                    </h3>
                    <button
                      className="ml-auto p-1 outline-none focus:outline-none"
                      onClick={() => {
                        if (isConnected) {
                          handleLogout();
                        }
                        setOpen(false);
                      }}
                    >
                      <CrossIcon className="w-5 stroke-brandBlack-100 dark:stroke-brandGray-200" />
                    </button>
                  </div>

                  {isConnected ? (
                    <div className=" space-y-3">
                      <p className="text-center text-sm font-medium text-brandGray-600 dark:text-brandGray-200">
                        This wallet has not been connected recently.
                        <br /> Please Sign In to authorize.
                      </p>
                      <div className="flex w-full items-center justify-center">
                        <SignMessage
                          isRedirect={isRedirect}
                          setOpen={setOpen}
                          from={from}
                        />
                      </div>
                    </div>
                  ) : (
                    showConnectors && (
                      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                        {connectors.length > 0 &&
                          connectors?.map((connector) => (
                            <button
                              key={connector.id}
                              type="button"
                              disabled={
                                (isLoading &&
                                  connector.id === pendingConnector?.id) ||
                                !connector.ready
                              }
                              onClick={() => {
                                connect({ connector });
                              }}
                              className="flex h-40 w-full min-w-[160px] cursor-pointer flex-col items-center justify-center rounded-lg bg-brandWhite-200 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-primary-200"
                            >
                              {connectorsList[
                                connector.id as keyof IConnectorsList
                              ] && (
                                <img
                                  className="h-16 w-16"
                                  src={`/assets/images/${
                                    connectorsList[connector.id]
                                  }`}
                                  alt={connector.id}
                                />
                              )}

                              <span className="mt-3 text-base text-brandPurple-200 dark:text-yellow-200">
                                <span>
                                  {connector.id === 'walletConnectLegacy'
                                    ? 'WalletConnect'
                                    : connector.name}
                                </span>
                                <span className="text-base font-bold text-black">
                                  {!connector.ready && ' (unsupported)'}
                                </span>
                              </span>

                              <span className="text-base font-bold text-black dark:text-brandGray-200">
                                {isLoading &&
                                  connector.id === pendingConnector?.id &&
                                  'connecting...'}
                              </span>
                            </button>
                          ))}
                      </div>
                    )
                  )}
                </div>
              </div>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default WalletConnectModal;
