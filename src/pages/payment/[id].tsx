import { useWeb3React } from '@web3-react/core';
import React, { useEffect } from 'react';

import { LoaderIcon } from '@/components/icons';
import PaymentActions from '@/components/Payment/PaymentAction';
import { useConnector } from '@/context/ConnectorContext';
import { RequiresApprovalError, usePayment } from '@/context/PaymentContext';
import { useRequest } from '@/context/RequestContext';
import { useEagerConnect } from '@/hooks/useEagerConnect';
import { paymentStatus } from '@/utils/constant';

const AutoConnect = () => {
  const { request } = useRequest();
  useEagerConnect(request);

  return <></>;
};

const Payment = () => {
  const [loaded, setLoaded] = React.useState(false);

  const { ready: connectorReady, connectorName } = useConnector();

  const {
    loading: requestLoading,
    request,
    // counterCurrency,
    // counterValue,
  } = useRequest();

  const {
    // paying,
    approving,
    error,
    ready: paymentReady,
    // txHash,
  } = usePayment();

  const { active, error: web3Error } = useWeb3React();

  useEffect(() => {
    // this hook is to avoid flashing elements on screen.
    // handles only first load
    if (loaded) return;
    // request must be loaded
    if (requestLoading) return;
    // connector must be ready
    if (!connectorReady) return;
    // if connector is active, check if payment is ready
    if (active && paymentReady) setLoaded(true);
  }, [requestLoading, connectorReady, active, paymentReady, loaded]);

  const requiresApproval =
    request?.status === 'open' && error instanceof RequiresApprovalError;
  const activating = !active && !!connectorName;
  const showSpinner =
    (approving || activating) && ((!web3Error && !error) || requiresApproval);

  return (
    <>
      <AutoConnect />
      {request ? (
        <div className="flex flex-col items-center justify-center">
          <div className="mx-auto mt-20 w-full max-w-2xl overflow-hidden rounded-2xl border border-brandGray-200/50 bg-white text-left align-middle shadow-xl transition-all">
            <div className="p-6 text-center text-sm font-semibold text-primary-100">
              <div className="pb-10 pt-4 text-lg text-brandGray-500">
                <p>Request for payment from</p>
                <p className="font-normal">{request?.payee}</p>
              </div>

              <div className="border-y border-brandGray-200 py-10">
                <p className="pb-3 text-base font-normal text-brandGray-500">
                  Created on {request?.createdDate.toDateString()}
                </p>
                <div className="mx-auto mb-3 w-fit rounded-md bg-yellow-300 px-4 py-2 text-sm font-bold text-black">
                  {paymentStatus[request.status]}
                </div>
                <p className="text-3xl font-bold text-black">
                  {request?.amount} {request?.currencySymbol}
                </p>
              </div>

              {request?.reason && (
                <div className="flex flex-col items-center justify-center py-10 text-lg font-normal text-brandGray-500">
                  <svg
                    className="mb-2 h-6 w-6"
                    focusable="false"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18zM18 14H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"></path>
                  </svg>
                  {request.reason}
                </div>
              )}
            </div>
          </div>
          <div className="my-10">{!showSpinner && <PaymentActions />}</div>
        </div>
      ) : (
        <div className="flex h-full min-h-screen w-full items-center justify-center">
          <LoaderIcon className="animate-spin stroke-brandGray-500" />
        </div>
      )}
    </>
  );
};

export default Payment;
