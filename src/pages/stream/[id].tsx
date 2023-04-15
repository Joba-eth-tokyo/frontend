import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

import { getInvoice } from '@/api/invoice';
import { LoaderIcon } from '@/components/icons';
import StreamAction from '@/components/Stream/StreamAction';
import { paymentStatus } from '@/utils/constant';
// import { useEagerConnect } from '@/hooks/useEagerConnect';

// const AutoConnect = () => {
//   return <></>;
// };

const Payment = () => {
  const [loaded, setLoaded] = React.useState(false);
  const [streamDetails, setStreamDetails] = React.useState({});
  const [payee, setPayee] = React.useState({});

  const { query } = useRouter();
  const { id } = query;

  const fetchAllInvoices = async () => {
    if (!id) {
      return;
    }
    try {
      const response = await getInvoice(id);
      console.log('response', response);
      if (response?.data && response?.data?.data) {
        const { data: storedStreamDetails } = response?.data;
        storedStreamDetails.flow_rate_per_second = JSON.parse(
          storedStreamDetails.flow_rate_per_second
        );
        console.log('stream deatils', storedStreamDetails);
        setStreamDetails({
          ...storedStreamDetails,
          flow_rate_per_second: storedStreamDetails.flow_rate_per_second,
        });
        setPayee(storedStreamDetails.user);
      }
      setLoaded(true);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAllInvoices();
  }, [id]);

  const invoicePaymentStatus =
    paymentStatus[streamDetails.invoice_status?.name] || 'pending';
  return (
    <>
      {loaded && id ? (
        <>
          <div className="flex flex-col items-center justify-center">
            <div className="mx-auto mt-20 w-full max-w-2xl overflow-hidden rounded-2xl border border-brandGray-200/50 bg-white text-left align-middle shadow-xl transition-all">
              <div className="p-6 text-center text-sm font-semibold text-primary-100">
                <div className="pb-10 pt-4 text-lg text-brandGray-500">
                  <p>Request for payment from</p>
                  <p className="font-normal">{payee.wallet_address}</p>
                </div>

                <div className="border-y border-brandGray-200 py-10">
                  <p className="pb-3 text-base font-normal text-brandGray-500">
                    Created on {streamDetails.created_at}
                  </p>
                  <div className="mx-auto mb-3 w-fit rounded-md bg-yellow-300 px-4 py-2 text-sm font-bold text-black">
                    {invoicePaymentStatus}
                  </div>
                  <p className="text-3xl font-bold text-black">
                    {streamDetails.amount} {streamDetails.currency}
                  </p>
                  {invoicePaymentStatus !== 'Paid' && (
                    <p className="text-xl font-bold text-black">
                      per {streamDetails.interval_duration}
                    </p>
                  )}

                  {streamDetails.due_date &&
                    invoicePaymentStatus !== 'Paid' && (
                      <p className="text-xl font-bold text-black">
                        until {streamDetails.due_date}
                      </p>
                    )}
                </div>
              </div>
            </div>
            {invoicePaymentStatus !== 'Paid' && (
              <div className="my-10">
                <StreamAction streamDetails={streamDetails} />
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="flex h-full min-h-screen w-full items-center justify-center">
          <LoaderIcon className="animate-spin stroke-brandGray-500" />
        </div>
      )}
    </>
  );
};

export default Payment;
