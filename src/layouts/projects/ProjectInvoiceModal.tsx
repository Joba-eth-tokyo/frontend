import dynamic from 'next/dynamic';
import React from 'react';

import { ImageWithFallback } from '@/components/ImageWithFallback';
import ModalWrapper, { ModalVariant } from '@/components/ModalWrapper';
import { useAuth } from '@/context/auth';
import { truncateString } from '@/utils/truncateString';

const CreateInvoiceForm = dynamic(
  () => import('@/layouts/invoice/CreateInvoiceForm'),
  {
    ssr: false,
  }
);

interface ProjectInvoiceModalProps {
  showModal: boolean;
  totalInvoiceCount: number;
  setModal: (val: boolean) => void;
  handleCreateInvoiceResponse: (values: any) => void;
}

const ProjectInvoiceModal: React.FC<ProjectInvoiceModalProps> = ({
  showModal,
  totalInvoiceCount,
  setModal,
  handleCreateInvoiceResponse,
}) => {
  const { userData } = useAuth();
  return (
    <ModalWrapper
      variant={ModalVariant.X_LARGE}
      showModal={showModal}
      setModal={setModal}
      title="Create Invoice"
      maskClosable={false}
    >
      <>
        <div className="border-b border-gray-50 pb-4 text-sm font-semibold text-primary-100">
          <p className="dark:text-brandGray-200">From</p>

          <div className="mb-[14px] mt-4 flex items-center">
            <ImageWithFallback
              className="h-8 w-8 overflow-hidden rounded-full"
              src={userData?.profile_photo || ''}
              alt={userData?.display_name || 'user'}
            />

            <div className="ml-2 line-clamp-1 text-sm font-normal text-black dark:text-yellow-200">
              {userData?.display_name ??
                truncateString({
                  string: userData?.wallet_address as string,
                  afterDotsStringLength: 3,
                })}
            </div>
          </div>

          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-y-[6px] text-sm font-normal text-brandGray-400 dark:text-brandGray-200">
              <p>
                {userData?.residential_address?.street_address},
                {userData?.residential_address?.city}{' '}
                {userData?.residential_address?.province}
              </p>
              <p>{userData?.residential_address?.country}</p>
              {userData?.phone?.number && (
                <p>
                  {userData?.phone?.country_code && userData.phone.country_code}{' '}
                  {userData.phone.number}
                </p>
              )}
              {userData?.telegram_user_link && (
                <p>{userData?.telegram_user_link}</p>
              )}
            </div>

            <div className="text-right text-sm font-normal text-brandGray-600 dark:text-brandGray-200">
              <p>Invoice #{totalInvoiceCount + 1}</p>
              <p className="font-semibold text-brandGray-400 dark:text-brandGray-200">
                Issued on {new Date().toDateString()}
              </p>
            </div>
          </div>
        </div>
        <CreateInvoiceForm handleResponse={handleCreateInvoiceResponse} />
      </>
    </ModalWrapper>
  );
};

export default ProjectInvoiceModal;
