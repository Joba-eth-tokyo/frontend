import { Framework } from '@superfluid-finance/sdk-core';
import { ethers } from 'ethers';
import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';
import { useNetwork, useProvider, useSigner } from 'wagmi';

import { updateInvoiceStatus } from '@/api/invoice';
import { useAuth } from '@/context/auth';
import { useToast } from '@/context/Toast';
import type { InvoiceStatusType } from '@/types';
import { INVOICE_STATUS_TYPE } from '@/utils/constant';

import Button from '../Button';
import { LoaderIcon } from '../icons';

const WalletConnectButton = dynamic(
  () => import('src/components/WalletConnectButton/'),
  {
    ssr: false,
  }
);

const StreamAction = ({ streamDetails }: any) => {
  const {
    flow_rate_per_second,
    user: { wallet_address },
  } = streamDetails;

  const flowRatePerSecond = ethers.BigNumber.from(
    flow_rate_per_second.toString()
  );
  const [loading, setLoading] = useState(true);
  const [totalPaidout, setTotalPaidOut] = useState('');
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [token, setToken] = useState(null);
  const [superSigner, setSuperSigner] = useState(null);
  const [flow, setFlow] = useState(0);
  const [flowStarted, setFlowStarted] = useState(0);
  const { toastError, toastSuccess } = useToast();

  const provider = useProvider();
  const { data: signer } = useSigner();
  const { chain } = useNetwork();

  const { invoiceStatusList } = useAuth();

  // load superfluid framework

  function CreateButton({ isLoading, children, ...props }) {
    console.log('isButtonLoading', isButtonLoading);
    return (
      <Button className="mx-auto" {...props}>
        {isButtonLoading ? (
          <LoaderIcon className="animate-spin stroke-brandGray-500" />
        ) : (
          children
        )}
      </Button>
    );
  }

  useEffect(() => {
    if (flowStarted) {
      window.setInterval(() => {
        let totalAmountStreamed;
        if (flowStarted) {
          const secondsElapsed = (new Date() - new Date(flowStarted)) / 1000;
          totalAmountStreamed = ethers.BigNumber.from(flow).mul(
            ethers.BigNumber.from(Math.ceil(secondsElapsed))
          );
          setTotalPaidOut(ethers.utils.formatEther(totalAmountStreamed));
        }
      }, 1000);
    }
  }, [flowStarted]);

  useEffect(() => {
    const loadSuperFluid = async () => {
      const sf = await Framework.create({
        chainId: Number(chain?.id),
        provider,
      });
      if (signer) {
        setLoading(true);
        const sfSigner = sf.createSigner({ signer });
        const daix = await sf.loadSuperToken('fDAIx');
        setToken(daix);
        setSuperSigner(sfSigner);

        // see if existing stream exists
        const existingFlow = await daix.getFlow({
          receiver: wallet_address,
          sender: streamDetails.payer_wallet,
          providerOrSigner: provider,
        });
        if (existingFlow.flowRate && Number(existingFlow.flowRate)) {
          console.log('setting flow', existingFlow);
          setFlow(existingFlow.flowRate);
          setFlowStarted(Number(existingFlow.timestamp));
        }
      }
      setLoading(false);
    };
    loadSuperFluid();
  }, [signer]);

  // where the Superfluid logic takes place
  async function createNewFlow(recipient, flowRate) {
    if (!token || !superSigner) {
      setIsButtonLoading(false);
      return;
    }
    try {
      const createFlowOperation = token.createFlow({
        sender: await superSigner.getAddress(),
        receiver: recipient,
        flowRate: flowRate.toString(),
      });
      await createFlowOperation.exec(superSigner);
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
    setIsButtonLoading(false);
  }

  async function stopNewFlow(recipient) {
    const paidInvoiceStatus = invoiceStatusList.find(
      (invoiceStatus: InvoiceStatusType) =>
        invoiceStatus.name === INVOICE_STATUS_TYPE.PAID
    );

    console.log('stopping new flow');
    if (!token || !superSigner) {
      console.log('no token or super signer');
      return;
    }
    try {
      const deleteFlowOperation = token.deleteFlow({
        sender: await superSigner.getAddress(),
        receiver: recipient,
      });
      await deleteFlowOperation.exec(superSigner);

      await updateInvoiceStatus({
        id: streamDetails.id,
        status: paidInvoiceStatus.id,
        amount: totalPaidout,
        interval_duration: '',
      });

      setFlow(0);
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
    setIsButtonLoading(false);
  }

  async function handleButtonClick() {
    console.log('pressed button');
    setIsButtonLoading(true);
    if (flow) {
      await stopNewFlow(wallet_address, flowRatePerSecond);
    } else {
      await createNewFlow(wallet_address, flowRatePerSecond);
    }
  }

  return (
    <div className="mx-auto">
      {loading ? (
        <div className="flex h-full min-h-screen w-full justify-center">
          <LoaderIcon className="animate-spin stroke-brandGray-500" />
        </div>
      ) : (
        <>
          {totalPaidout && (
            <div className="my-10 pb-10 pt-4 text-lg text-brandGray-500">
              <p className="text-center">Amount Paid:</p>
              <p className="text-center text-xl">
                {`${Number(totalPaidout).toFixed(6)} ${streamDetails.currency}`}
              </p>
            </div>
          )}
          {signer && (
            <CreateButton onClick={handleButtonClick}>
              {flow ? 'Stop Payment' : 'Initiate Payment'}
            </CreateButton>
          )}

          <div className="description">
            <div className="calculation" style={{ textAlign: 'center' }}>
              <p>Your flow {flow ? 'is' : 'will be'} equal to:</p>
              <p>
                <b>
                  $
                  {Number(
                    ethers.utils.formatEther(flowRatePerSecond.toString())
                  ).toFixed(4) || 0}
                </b>{' '}
                DAIx / second
              </p>
            </div>
          </div>
          <WalletConnectButton isRedirect={false} />
        </>
      )}
    </div>
  );
};
export default StreamAction;
