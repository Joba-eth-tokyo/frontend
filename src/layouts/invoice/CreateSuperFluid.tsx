/* eslint-disable @typescript-eslint/no-use-before-define */
import 'react-datepicker/dist/react-datepicker.css';

import { Listbox, Switch, Transition } from '@headlessui/react';
import clsx from 'clsx';
import { ethers } from 'ethers';
import type { FormikValues } from 'formik';
import { useFormik } from 'formik';
import React, { Fragment, useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import { isCancelError } from 'request-shared/dist';
import { useAccount, useNetwork, useSignMessage } from 'wagmi';
import * as Yup from 'yup';

import { createInvoice } from '@/api/invoice';
import { getAllInvoiceStatus } from '@/api/invoiceStatus';
import Button from '@/components/Button';
import ErrorBox from '@/components/form/ErrorBox';
import { DownArrow } from '@/components/icons';
import { useToast } from '@/context/Toast';
import type { InvoiceStatusType } from '@/types';
import { INVOICE_STATUS_TYPE } from '@/utils/constant';

const validationSchema = Yup.object({
  invoiceCurrency: Yup.mixed().required().label('Invoice Currency'),
  amount: Yup.number()
    .typeError('Amount must be a number.')
    .positive('Please enter a positive number.')
    .required('Amount is required.'),
  endDate: Yup.date().label('Due Date'),
});

interface CreateCreateSuperFluidFormProps {
  handleResponse?: (values: any) => void;
  payer_wallet?: string;
}

const CreateSuperFluidForm: React.FC<CreateInvoiceFormProps> = ({
  handleResponse,
  payer_wallet,
}) => {
  console.log('payer_wallet', payer_wallet);
  const currencyList = [
    {
      address: '0x5d8b4c2554aeb7e86f387b4d6c00ac33499ed01f',
      chainId: 137,
      decimals: 6,
      hash: '0x5d8b4c2554aeb7e86f387b4d6c00ac33499ed01f',
      id: 'xDAI',
      meta: undefined,
      network: 'matic',
      symbol: 'xDAI',
      type: 'ERC20',
    },
  ];
  const { address } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const { chain } = useNetwork();
  const { toastSuccess, toastError } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [invoiceStatusList, setInvoiceStatusList] = useState<
    InvoiceStatusType[]
  >([]);

  const filteredCurrencyListByChain = currencyList;

  const fetchAllInvoiceStatus = async () => {
    try {
      const response = await getAllInvoiceStatus();
      if (response.data.length) {
        setInvoiceStatusList(response.data);
      }
    } catch (error: any) {
      if (error.response?.data?.message)
        toastError('Error', error.response.data.message);
    }
  };

  useEffect(() => {
    fetchAllInvoiceStatus();
  }, []);

  const {
    handleSubmit,
    handleChange,
    handleBlur,
    values,
    errors,
    touched,
    setValues,
    setErrors,
    resetForm,
  } = useFormik({
    initialValues: {
      description: '',
      invoiceCurrency: filteredCurrencyListByChain.at(0),
      amount: '',
      intervalDuration: 'month',
      flowRatePerSecond: ethers.BigNumber.from(0),
      endDate: undefined, // new Date(),
    },
    validationSchema,
    onSubmit: (data: FormikValues) => {
      handleSubmitForm(data);
    },
  });

  // 10 eth per second
  function calculateFlowRatePs(amount = 0, durationInterval = 'seconds') {
    let flowRateMultiplier = 1;
    switch (durationInterval) {
      case 'month':
        flowRateMultiplier = 3600 * 24 * 30;
        break;
      case 'week':
        flowRateMultiplier = (3600 * 24 * 30) / 7;
        break;
      case 'day':
        flowRateMultiplier = 3600 * 24;
        break;
      case 'hourly':
        flowRateMultiplier = 3600;
        break;
      case 'seconds':
      default:
        break;
    }
    const amountInEth = ethers.BigNumber.from(amount || 0);
    const amountInWei = ethers.utils.parseEther(amountInEth.toString());
    const calculatedFlowRatePerSecond = amountInWei.div(
      flowRateMultiplier.toFixed(0)
    );
    // const amontInEth = ethers.utils.formatEther(amountInWei.toString());
    // const calculatedFlowRatePerSecond = Number(amontInEth) / flowRateMultiplier;
    return calculatedFlowRatePerSecond;
  }

  useEffect(() => {
    setValues((prev) => ({
      ...prev,
      invoiceCurrency: filteredCurrencyListByChain.at(0),
    }));
  }, []);

  const handleSubmitForm = async (data: FormikValues) => {
    if (data.amount.includes('.')) {
      const [, fract] = data.amount.split('.');
      if (fract.length > data.invoiceCurrency.decimals) {
        setErrors({
          amount: `Maximum ${data.invoiceCurrency.decimals} decimal places are allowed.`,
        });
        return;
      }
    }

    if (!address || !chain?.id) {
      toastError('Error', 'Wallet not connected.');
      return;
    }

    const createdInvoiceStatus = invoiceStatusList.find(
      (invoiceStatus: InvoiceStatusType) =>
        invoiceStatus.name === INVOICE_STATUS_TYPE.CREATED
    );

    if (!createdInvoiceStatus) {
      toastError('Error', 'Invoice status error.');
      return;
    }

    setIsLoading(true);

    try {
      const invoiceDetails = {
        request_network_id: 0,
        request_network_url: '',
        amount: Number(data.amount),
        status: createdInvoiceStatus.id,
        currency: data.invoiceCurrency.id,
        due_date: data.endDate,
        interval_duration: data.intervalDuration,
        flow_rate_per_second: data.flowRatePerSecond.toString(),
        payer_wallet,
      };

      await signMessageAsync({
        message: JSON.stringify(invoiceDetails),
      });

      const createInvoiceResponse = await createInvoice(invoiceDetails);

      setIsLoading(false);

      toastSuccess('Success', 'Invoice created successfully');
      resetForm();
      if (handleResponse) {
        handleResponse(createInvoiceResponse.data.data);
      }
    } catch (e: any) {
      if (!isCancelError(e)) {
        toastError('Error', e.message);
      }
    }

    setIsLoading(false);
  };

  return (
    <form className="mx-auto max-w-md pt-6" onSubmit={handleSubmit}>
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <label
            className="text-sm font-bold text-brandGray-500 dark:text-yellow-200"
            htmlFor="walletAddress"
          >
            Receiving Wallet address
          </label>
        </div>
        <p className="mt-1 text-base leading-6 dark:text-brandGray-200 ">
          {address}
        </p>
      </div>

      <div className="mb-6">
        <label
          className="text-sm font-bold text-brandGray-500 dark:text-yellow-200"
          htmlFor="description"
        >
          Description
        </label>
        <textarea
          rows={4}
          id="description"
          name="description"
          placeholder="Enter description"
          className="mt-2 h-36 w-full rounded-md border border-brandGray-200 p-3 text-sm text-brandGray-500 placeholder:text-brandGray-200 focus:outline-none focus:ring-0 dark:border-brandGray-300 dark:bg-brandGray-300 dark:text-brandGray-200 dark:placeholder:text-brandGray-200/40"
          value={values.description}
          autoComplete="off"
          onChange={handleChange}
          onBlur={handleBlur}
        />
      </div>

      {/* Start regular request network invoice submission */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:gap-x-2 md:gap-x-4">
        <div className="mb-6 w-full md:w-1/2">
          <label
            className="text-sm font-bold text-brandGray-500 dark:text-yellow-200"
            htmlFor="amount"
          >
            Amount (Reccuring) *
          </label>
          <input
            id="amount"
            name="amount"
            placeholder="200"
            className="mt-2 h-12 w-full rounded-md border border-brandGray-200 p-3 text-sm text-brandGray-500 placeholder:text-brandGray-200 focus:outline-none focus:ring-0 dark:border-brandGray-300 dark:bg-brandGray-300 dark:text-brandGray-200 dark:placeholder:text-brandGray-200/40 dark:active:bg-brandGray-300"
            autoComplete="off"
            value={values.amount}
            onChange={(e) => {
              const { value } = e.target;
              if (Number.isNaN(value)) {
                return;
              }
              setValues((prev) => ({
                ...prev,
                amount: value,
              }));
              // calculate flow rate.
              const flowRatePerSecond = calculateFlowRatePs(
                value,
                values.intervalDuration
              );
              setValues((prev) => ({
                ...prev,
                amount: value,
                flowRatePerSecond,
              }));
            }}
            onBlur={handleBlur}
          />

          {errors.amount && touched.amount && (
            <ErrorBox error={errors.amount} />
          )}
          {/* Start Weekly or monthly or whatever */}
          <div className="mt-1 text-xs font-medium text-brandGray-600 dark:text-brandGray-200/60">
            <Listbox
              disabled={!values.amount}
              value={values.intervalDuration}
              onChange={(value) => {
                setValues((prev) => ({
                  ...prev,
                  intervalDuration: value,
                }));
                // calculate flow rate.
                const flowRatePerSecond = calculateFlowRatePs(
                  Number(values.amount) || 0,
                  value
                );
                setValues((prev) => ({
                  ...prev,
                  intervalDuration: value,
                  flowRatePerSecond,
                }));
              }}
            >
              <div className="relative">
                <Listbox.Button className="flex h-12 w-full items-center justify-between rounded-md border border-brandGray-200 p-3 text-left text-sm text-brandGray-500 placeholder:text-brandGray-200 focus:outline-none focus:ring-0 dark:border-brandGray-300  dark:bg-brandGray-300 dark:text-brandGray-200">
                  <span>Per {values.intervalDuration}</span>
                  <DownArrow className="stroke-brandGray-500" />
                </Listbox.Button>
                <Transition
                  as={Fragment}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Listbox.Options className="no-scrollbar absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none dark:bg-primary-200 sm:text-sm">
                    <Listbox.Option
                      className={({ active }) =>
                        clsx(
                          'relative cursor-pointer select-none px-4 py-2 text-base  font-medium hover:bg-brandWhite-200 dark:border-brandGray-300 dark:text-brandGray-200  dark:hover:bg-brandGray-300',
                          {
                            'bg-brandWhite-300 dark:bg-brandGray-300': active,
                          }
                        )
                      }
                      value="month"
                    >
                      Per month
                    </Listbox.Option>
                    <Listbox.Option
                      className={({ active }) =>
                        clsx(
                          'relative cursor-pointer select-none px-4 py-2 text-base  font-medium hover:bg-brandWhite-200 dark:border-brandGray-300 dark:text-brandGray-200  dark:hover:bg-brandGray-300',
                          {
                            'bg-brandWhite-300 dark:bg-brandGray-300': active,
                          }
                        )
                      }
                      value="week"
                    >
                      Per week
                    </Listbox.Option>
                    <Listbox.Option
                      className={({ active }) =>
                        clsx(
                          'relative cursor-pointer select-none px-4 py-2 text-base  font-medium hover:bg-brandWhite-200 dark:border-brandGray-300 dark:text-brandGray-200  dark:hover:bg-brandGray-300',
                          {
                            'bg-brandWhite-300 dark:bg-brandGray-300': active,
                          }
                        )
                      }
                      value="day"
                    >
                      Per day
                    </Listbox.Option>
                    <Listbox.Option
                      className={({ active }) =>
                        clsx(
                          'relative cursor-pointer select-none px-4 py-2 text-base  font-medium hover:bg-brandWhite-200 dark:border-brandGray-300 dark:text-brandGray-200  dark:hover:bg-brandGray-300',
                          {
                            'bg-brandWhite-300 dark:bg-brandGray-300': active,
                          }
                        )
                      }
                      value="hour"
                    >
                      Per hour
                    </Listbox.Option>
                    <Listbox.Option
                      className={({ active }) =>
                        clsx(
                          'relative cursor-pointer select-none px-4 py-2 text-base  font-medium hover:bg-brandWhite-200 dark:border-brandGray-300 dark:text-brandGray-200  dark:hover:bg-brandGray-300',
                          {
                            'bg-brandWhite-300 dark:bg-brandGray-300': active,
                          }
                        )
                      }
                      value="second"
                    >
                      Per second
                    </Listbox.Option>
                  </Listbox.Options>
                </Transition>
              </div>
            </Listbox>
          </div>
        </div>
        <div className="relative mb-6 w-full space-y-2 md:w-1/2">
          <label
            className="text-sm font-bold text-brandGray-500 dark:text-yellow-200"
            htmlFor="invoiceCurrency"
          >
            Invoice currency *
          </label>

          <Listbox
            value={values.invoiceCurrency}
            onChange={(value) => {
              setValues((prev) => ({
                ...prev,
                invoiceCurrency: value,
              }));
            }}
          >
            <div className="relative">
              <Listbox.Button className="flex h-12 w-full items-center justify-between rounded-md border border-brandGray-200 p-3 text-left text-sm text-brandGray-500 placeholder:text-brandGray-200 focus:outline-none focus:ring-0 dark:border-brandGray-300  dark:bg-brandGray-300 dark:text-brandGray-200">
                <span>{values.invoiceCurrency?.symbol}</span>
                <DownArrow className="stroke-brandGray-500" />
              </Listbox.Button>
              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="no-scrollbar absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none dark:bg-primary-200 sm:text-sm">
                  {filteredCurrencyListByChain.map((currency) => (
                    <Listbox.Option
                      key={currency.id}
                      className={({ active }) =>
                        clsx(
                          'relative cursor-pointer select-none px-4 py-2 text-base  font-medium hover:bg-brandWhite-200 dark:border-brandGray-300 dark:text-brandGray-200  dark:hover:bg-brandGray-300',
                          {
                            'bg-brandWhite-300 dark:bg-brandGray-300': active,
                          }
                        )
                      }
                      value={currency}
                    >
                      {currency.symbol}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </Listbox>

          {chain && (
            <p className="text-xs font-medium text-brandGray-600 dark:text-brandGray-200/60">
              Only showing currencies for the currently connected network (
              {chain?.name})
            </p>
          )}

          {errors.invoiceCurrency && touched.invoiceCurrency && (
            <ErrorBox error={errors.invoiceCurrency as string} />
          )}
        </div>
      </div>

      <div className="mb-6">
        <label
          className="text-sm font-bold text-brandGray-500 dark:text-yellow-200"
          htmlFor="endDate"
        >
          End date *
        </label>
        <p className="text-xs font-medium text-brandGray-600 dark:text-brandGray-200/60">
          <Switch
            checked={values.endDate}
            onChange={() => {
              setValues((prev) => ({
                ...prev,
                endDate: prev.endDate ? undefined : new Date(),
              }));
            }}
            className={`${
              values.endDate ? 'bg-blue-600' : 'bg-gray-200'
            } relative inline-flex h-6 w-11 items-center rounded-full`}
          >
            <span
              className={`${
                values.endDate ? 'translate-x-6' : 'translate-x-1'
              } inline-block h-4 w-4 rounded-full bg-white transition`}
            />
          </Switch>
        </p>
        <>
          <DatePicker
            selected={values.endDate}
            minDate={new Date()}
            className="mt-2 h-12 w-full rounded-md border border-brandGray-200 p-3 text-sm text-brandGray-500 placeholder:text-brandGray-200 focus:outline-none focus:ring-0 dark:border-brandGray-300 dark:bg-brandGray-300 dark:text-brandGray-200 dark:placeholder:text-brandGray-200/40"
            onChange={(date: Date) =>
              setValues((prev) => ({
                ...prev,
                endDate: new Date(date),
              }))
            }
          />
          {errors.endDate && touched.endDate && (
            <ErrorBox error={errors.endDate as string} />
          )}
          You will receive {ethers.utils.formatEther(values.flowRatePerSecond)}{' '}
          xDAI Per second.
        </>
      </div>

      <div className="pt-6">
        <Button
          disabled={isLoading}
          isLoading={isLoading}
          className="w-full"
          buttonType="primary"
          type="submit"
        >
          Create invoice
        </Button>
      </div>
    </form>
  );
};

export default CreateSuperFluidForm;
