import { pdf } from '@react-pdf/renderer';
import type { CurrencyDefinition } from '@requestnetwork/currency';
import { getBtcPaymentUrl } from '@requestnetwork/payment-processor';
import { Types } from '@requestnetwork/request-client.js';
import dynamic from 'next/dynamic';
import React, { useEffect } from 'react';
import type { IParsedRequest } from 'request-shared';
import { getEtherscanUrl } from 'request-shared';
import { useAccount, useConnect } from 'wagmi';

import { updateInvoiceStatus } from '@/api/invoice';
import { useAuth } from '@/context/auth';
import {
  NotEnoughForGasError,
  NotEnoughForRequestError,
  RequiresApprovalError,
  usePayment,
} from '@/context/PaymentContext';
import { useRequest } from '@/context/RequestContext';
import { useToast } from '@/context/Toast';
import type { InvoiceData, InvoiceStatusType } from '@/types';
import { INVOICE_STATUS_TYPE } from '@/utils/constant';
import { ProjectStatus } from '@/utils/enums';

import Button from '../Button';
import { PdfReceipt } from '../Pdf/PdfReceipt';

const WalletConnectButton = dynamic(
  () => import('@/components/WalletConnectButton'),
  {
    ssr: false,
  }
);

interface IProps {
  request: IParsedRequest;
  counterCurrency: CurrencyDefinition;
  counterValue?: string;
}

const downloadFile = (() => {
  if (typeof window !== 'undefined') {
    const a = window?.document?.createElement('a');
    window?.document?.body?.appendChild(a);
    (a as any).style = 'display: none';
    return (blob: Blob, fileName: string) => {
      const url = window.URL.createObjectURL(blob);
      a.href = url;
      a.download = fileName;
      a.click();
      window.URL.revokeObjectURL(url);
    };
  }
  return null;
})();

export const downloadPdf = async (props: IProps) => {
  const transactionUrl = props.request?.txHash
    ? `${getEtherscanUrl(props.request)}/tx/${props.request.txHash}`
    : '';

  const blob = await pdf(
    <PdfReceipt transactionUrl={transactionUrl} {...props} />
  ).toBlob();

  const date = new Date().toISOString();
  if (downloadFile) {
    downloadFile(blob, `${date} RequestReceipt.pdf`);
  }
};

export const ReceiptLink = (props: IProps) => {
  return (
    <Button onClick={() => downloadPdf(props)}>Download PDF receipt</Button>
  );
};

const PayAction = ({
  disabled,
  pay,
  paying,
}: {
  broadcasting: boolean;
  paying: boolean;
  disabled: boolean;
  pay: () => void;
}) => {
  return (
    <Button
      onClick={() => {
        pay();
      }}
      disabled={disabled || paying}
      isLoading={paying}
    >
      Pay now
    </Button>
  );
};

const ApproveAction = ({
  approve,
  disabled,
  approving,
}: {
  approve: () => void;
  disabled: boolean;
  approving: boolean;
}) => {
  return (
    <>
      <Button
        onClick={() => {
          approve();
        }}
        disabled={disabled}
        isLoading={approving}
        buttonType={disabled ? 'outlined' : 'primary'}
      >
        {disabled ? 'Approved' : 'Approve'}
      </Button>
    </>
  );
};

const BtcPay = ({ url }: { url: string }) => {
  return (
    <div>
      <p>Pay with a mobile wallet {url}</p>
    </div>
  );
};

const PaymentActions = ({
  invoiceData,
  updateStatus,
}: {
  invoiceData?: InvoiceData;
  updateStatus?: (status: ProjectStatus) => void;
}) => {
  const { toastError, toastSuccess } = useToast();
  const { invoiceStatusList } = useAuth();

  const { request, counterValue, counterCurrency } = useRequest();

  const { isConnected } = useAccount();
  const { error } = useConnect();
  const {
    error: paymentError,
    pay,
    ready: paymentReady,
    approve,
    approving,
    paying,
    broadcasting,
  } = usePayment();

  useEffect(() => {
    const paidInvoiceStatus = invoiceStatusList.find(
      (invoiceStatus: InvoiceStatusType) =>
        invoiceStatus.name === INVOICE_STATUS_TYPE.PAID
    );
    if (request?.status === 'paid') {
      // datatable update api
      if (!paidInvoiceStatus) {
        toastError('Error', 'Invoice status error.');
      }
      if (invoiceData?.id && paidInvoiceStatus?.id) {
        if (invoiceData.status !== paidInvoiceStatus.id) {
          updateInvoiceStatus({
            id: invoiceData.id,
            status: paidInvoiceStatus.id,
          })
            .then(async () => {
              if (updateStatus) {
                await updateStatus(ProjectStatus.COMPLETE);
              }
              toastSuccess(
                'Invoice payment success',
                'Invoice payment successfully.'
              );
            })
            .catch((err) => {
              toastSuccess('Invoice payment error', err.response.data.msg);
            });
        }
      }
    }
  }, [request, request?.status]);

  useEffect(() => {
    if (paymentError && !(paymentError instanceof NotEnoughForRequestError)) {
      if (!(paymentError instanceof NotEnoughForGasError)) {
        toastError(paymentError.name, paymentError.message);
      }
    }
  }, [paymentError]);

  if (!request) {
    return <></>;
  }

  if (
    request.status === 'canceled' ||
    (request.status === 'pending' && !paying)
  ) {
    return <>canceled Or panding Or paying</>;
  }

  if (request.status === 'paid' || request.status === 'overpaid') {
    return (
      <div className="flex flex-col items-center justify-center">
        <ReceiptLink
          request={request}
          counterCurrency={counterCurrency}
          counterValue={counterValue}
        />
      </div>
    );
  }

  if (request.currencyType === Types.RequestLogic.CURRENCY.BTC) {
    return <BtcPay url={getBtcPaymentUrl(request.raw as any)} />;
  }

  if (request.currencyType === Types.RequestLogic.CURRENCY.ISO4217) {
    return <>ISO4217</>;
  }

  if (!isConnected && !error) {
    return <WalletConnectButton isRedirect={false} />;
  }

  return (
    <div className="flex flex-col items-center justify-center gap-6">
      {(paymentError instanceof NotEnoughForRequestError ||
        paymentError instanceof NotEnoughForGasError) && (
        <div className="flex w-full flex-row rounded-md border border-red-500/40 bg-brandRed-50 px-10 py-4 text-brandRed-200 shadow-lg">
          {paymentError.message}
        </div>
      )}

      <div className="flex items-center justify-center">
        <ApproveAction
          disabled={!(paymentError instanceof RequiresApprovalError)}
          approve={approve}
          approving={approving}
        />
        <div className="mx-4 w-10 border"></div>
        <PayAction
          pay={pay}
          paying={paying}
          broadcasting={broadcasting}
          disabled={
            !paymentReady ||
            !!error ||
            !!paymentError ||
            request.status === 'waiting'
          }
        />
      </div>
    </div>
  );
};

export default PaymentActions;
