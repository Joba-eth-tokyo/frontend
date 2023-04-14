import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

import { getProjectById, updateProjectStatus } from '@/api/project';
import Button from '@/components/Button';
import { CopyIcon, LoaderIcon } from '@/components/icons';
import { ImageWithFallback } from '@/components/ImageWithFallback';
import ModalWrapper, { ModalVariant } from '@/components/ModalWrapper';
import WalletConnectModal from '@/components/WalletConnectModal';
import { useAuth } from '@/context/auth';
import { useRequest } from '@/context/RequestContext';
import { useSignMessageModal } from '@/context/signMessageContext';
import { useToast } from '@/context/Toast';
import Header from '@/layouts/dashboardHome/Header';
import NoProjects from '@/layouts/dashboardHome/ProjectCard/components/NoProjects';
import Payment from '@/layouts/payment';
import Dashboard from '@/templates/Dashboard';
import type { ProjectData } from '@/types';
import { ProjectStatus } from '@/utils/enums';
import { truncateString } from '@/utils/truncateString';
import { URLS } from '@/utils/urls';

const Project = () => {
  const router = useRouter();
  const { slug } = router.query;
  const { toastError, toastSuccess } = useToast();
  const { userData, loading: authLoading, accessToken } = useAuth();
  const { setId } = useRequest();
  const [loading, setLoading] = useState<boolean>(true);
  const [apiLoading, setApiLoading] = useState<boolean>(false);
  const [projectDetails, setProjectDetails] = useState<ProjectData | null>(
    null
  );
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [openwalletConnectModal, setOpenWalletConnectModal] =
    useState<boolean>(false);
  const [errors, setErrors] = useState('');

  const { isConnected, isConnecting } = useAccount();

  const { isSignIn } = useSignMessageModal();

  const fetchAllProject = async (id: string) => {
    if (!id) {
      setLoading(false);
      return;
    }
    try {
      const response = await getProjectById(id);
      if (response.data.data?.error) {
        setErrors(response.data.data.error);
      } else {
        setProjectDetails(response.data.data);
      }
      setLoading(false);
    } catch (error: any) {
      toastError('No Project Found!', error.response.data.msg);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && !userData && !isConnecting && !isConnected) {
      // router.replace(URLS.ROOT);
      setOpenWalletConnectModal(true);
    }
  }, [userData, authLoading, isConnected, isConnecting]);

  useEffect(() => {
    if (slug && accessToken) {
      fetchAllProject(slug as string);
    }
  }, [slug, accessToken]);

  const handleCopy = (url: string, isProjectLink: boolean) => {
    if (navigator) {
      navigator.clipboard.writeText(url);
      toastSuccess(
        'Success',
        `${isProjectLink ? 'Project' : 'Invoice'} Link copied!`
      );
    }
  };

  async function handleUpdateProjectStatus(status: ProjectStatus) {
    if (!projectDetails) return;
    setApiLoading(true);
    try {
      await updateProjectStatus({
        id: projectDetails.id as string,
        status,
      });
      fetchAllProject(slug as string);
      toastSuccess('Success', `Project status updated successfully.`);
      setApiLoading(false);
    } catch (error: any) {
      toastSuccess(
        'Project status error',
        error.response?.data?.msg ?? 'Failed'
      );
      setApiLoading(false);
    }
  }

  useEffect(() => {
    if (!isSignIn) {
      setProjectDetails(null);
    }
  }, [isSignIn]);

  if (authLoading || isConnecting) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoaderIcon className="animate-spin stroke-base-100" />
      </div>
    );
  }

  return (
    <>
      {isConnected && (
        <>
          <Dashboard>
            <div className="space-y-6 md:space-y-0">
              <Header title="Project Overview" />
              <div className="space-y-4 rounded-xl bg-white px-5 py-4 dark:bg-brandBlack-100 md:p-8">
                {loading ? (
                  <p className="line-clamp-1 flex-1 text-sm font-medium leading-4 dark:text-yellow-200">
                    Loading
                  </p>
                ) : (
                  <>
                    {projectDetails ? (
                      <div className="space-y-8">
                        <div className="space-y-6">
                          <div className="flex items-start gap-4">
                            <div className="flex-1 space-y-3">
                              <p className="text-lg  font-medium text-primary-200 dark:text-yellow-200 md:text-xl md:leading-7 2xl:text-2xl">
                                {projectDetails.name}
                              </p>
                              <div className="py-5">
                                <div className="flex gap-3 pb-3">
                                  <ImageWithFallback
                                    className="h-11 w-11 overflow-hidden rounded-full"
                                    src={
                                      projectDetails.worker_user
                                        ?.profile_photo || ''
                                    }
                                    alt={
                                      projectDetails.worker_user
                                        ?.display_name || 'user'
                                    }
                                  />
                                  <div>
                                    <p className="truncate pb-2 text-sm font-medium  leading-4 text-brandGray-400 dark:text-brandGray-200">
                                      {projectDetails.worker_user?.email}
                                    </p>
                                    <p className="truncate text-sm font-medium leading-4  text-brandGray-400 dark:text-brandGray-200">
                                      {
                                        projectDetails.worker_user
                                          ?.wallet_address
                                      }
                                    </p>
                                  </div>
                                </div>
                                <p className="inline-block rounded-full bg-brandWhite-200  px-3 py-2  text-sm font-medium capitalize text-brandGray-400 dark:bg-primary-200  dark:text-yellow-200">
                                  {projectDetails.role}
                                </p>
                              </div>
                            </div>
                            <Button
                              buttonType="outlined"
                              size="small"
                              className="sm:px-4"
                              leftSideIcon={
                                <CopyIcon className=" w-5 fill-inherit" />
                              }
                              onClick={() =>
                                handleCopy(
                                  `${window.location.origin}${URLS.VIEW_PROJECT}${projectDetails.id}`,
                                  true
                                )
                              }
                              title="copy project link"
                            >
                              Get Shareable Link
                            </Button>
                          </div>

                          <p className="text-sm font-normal text-brandGray-400 dark:text-brandGray-200 md:text-base  ">
                            {projectDetails.description}
                          </p>

                          <div className="flex items-start gap-4">
                            <p className="text-sm font-normal capitalize leading-4 text-brandGray-400  dark:text-brandGray-200">
                              {projectDetails.status},
                            </p>
                            <p className="text-sm font-normal capitalize leading-4 text-brandGray-400 dark:text-brandGray-200">
                              {projectDetails.due_date}
                            </p>
                          </div>
                          {userData?.id === projectDetails.client &&
                            projectDetails.status === ProjectStatus.PENDING && (
                              <div className="flex items-center gap-4">
                                <Button
                                  buttonType="primary"
                                  type="button"
                                  className="h-12"
                                  onClick={() =>
                                    handleUpdateProjectStatus(
                                      ProjectStatus.IN_PROGRESS
                                    )
                                  }
                                  disabled={apiLoading}
                                >
                                  Accept
                                </Button>
                                <Button
                                  buttonType="outlined"
                                  type="button"
                                  className="h-12"
                                  onClick={() =>
                                    handleUpdateProjectStatus(
                                      ProjectStatus.REJECTED
                                    )
                                  }
                                  disabled={apiLoading}
                                >
                                  Decline
                                </Button>
                              </div>
                            )}
                        </div>

                        <div className="space-y-4">
                          <div className="flex items-start gap-4">
                            <p className="flex-1 text-lg text-primary-200 dark:text-yellow-200 md:text-xl">
                              Invoice Details
                            </p>
                            <Button
                              buttonType="outlined"
                              size="small"
                              className="sm:px-4"
                              leftSideIcon={
                                <CopyIcon className=" w-5 fill-inherit" />
                              }
                              onClick={() =>
                                handleCopy(
                                  `${window.location.origin}${URLS.PAYMENT}${projectDetails.project_invoice?.request_network_url}`,
                                  false
                                )
                              }
                              title="copy invoice link"
                            >
                              Get Shareable Link
                            </Button>
                          </div>

                          <div className="grid grid-cols-1 gap-2 pb-4 md:grid-cols-2 md:gap-4 xl:grid-cols-3 xl:gap-6">
                            <div className="space-y-1">
                              <p className="text-base leading-none text-brandGray-400 dark:text-gray-500">
                                Invoice Id
                              </p>
                              <p className="text-base text-brandGray-400 dark:text-brandGray-200">
                                {projectDetails.project_invoice?.id}
                              </p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-base leading-none text-brandGray-400 dark:text-gray-500">
                                Invoice Amount
                              </p>
                              <p className="text-base text-brandGray-400 dark:text-brandGray-200">
                                {projectDetails.project_invoice?.amount}{' '}
                                {projectDetails.project_invoice?.currency}
                              </p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-base leading-none text-brandGray-400 dark:text-gray-500">
                                Invoice Status
                              </p>
                              <p className="text-base capitalize text-brandGray-400 dark:text-brandGray-200">
                                {
                                  projectDetails.project_invoice?.invoice_status
                                    ?.name
                                }{' '}
                              </p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-base leading-none text-brandGray-400 dark:text-gray-500">
                                Due Date
                              </p>
                              <p className="text-base text-brandGray-400 dark:text-brandGray-200">
                                {projectDetails.project_invoice?.due_date}{' '}
                              </p>
                            </div>
                          </div>
                          {projectDetails.status !== ProjectStatus.REJECTED && (
                            <Button
                              onClick={() => {
                                if (
                                  userData?.id === projectDetails.worker ||
                                  (userData?.id === projectDetails.client &&
                                    projectDetails.status ===
                                      ProjectStatus.PENDING)
                                ) {
                                  return;
                                }
                                if (
                                  projectDetails.project_invoice
                                    ?.request_network_url
                                ) {
                                  setId(
                                    projectDetails.project_invoice
                                      .request_network_url
                                  );
                                  setOpenModal(true);
                                }
                              }}
                              type="button"
                              buttonType={
                                projectDetails.status === ProjectStatus.PENDING
                                  ? 'outlined'
                                  : 'primary'
                              }
                              size="small"
                              disabled={
                                userData?.id === projectDetails.worker ||
                                (userData?.id === projectDetails.client &&
                                  projectDetails.status ===
                                    ProjectStatus.PENDING)
                              }
                            >
                              Pay Now
                            </Button>
                          )}
                        </div>
                      </div>
                    ) : (
                      <>
                        {errors ? (
                          <NoProjects title={errors} isRedirectButton />
                        ) : (
                          <NoProjects title="No Project Found!" />
                        )}
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          </Dashboard>

          <ModalWrapper
            variant={ModalVariant.X_LARGE}
            showModal={openModal}
            setModal={setOpenModal}
            title="Payment"
            maskClosable={false}
          >
            <div className="border-b border-gray-50 pb-4 text-sm font-semibold text-primary-100 dark:text-white">
              <p>From</p>

              <div className="mb-[14px] mt-4 flex items-center">
                {projectDetails?.worker_user?.display_name && (
                  <ImageWithFallback
                    className="h-8 w-8 overflow-hidden rounded-full"
                    src={projectDetails?.worker_user?.profile_photo || ''}
                    alt={projectDetails.worker_user.display_name || ''}
                  />
                )}

                <div className="ml-2 line-clamp-1 text-sm font-normal text-black dark:text-brandGray-200">
                  {projectDetails?.worker_user?.display_name ??
                    truncateString({
                      string: projectDetails?.worker_user
                        ?.wallet_address as string,
                      afterDotsStringLength: 3,
                    })}
                </div>
              </div>

              <div className="flex items-start justify-between gap-4">
                <div className="flex flex-col gap-y-[6px] text-sm font-normal text-brandGray-400 dark:text-brandGray-200">
                  <p>
                    {projectDetails?.worker_user?.residential_address
                      ?.street_address &&
                      `${projectDetails.worker_user.residential_address.street_address}, `}
                    {projectDetails?.worker_user?.residential_address?.city &&
                      `${projectDetails.worker_user.residential_address.city} `}
                    {projectDetails?.worker_user?.residential_address
                      ?.province &&
                      projectDetails.worker_user.residential_address.province}
                  </p>
                  {projectDetails?.worker_user?.residential_address
                    ?.country && (
                    <p>
                      {projectDetails.worker_user.residential_address.country}
                    </p>
                  )}
                  {projectDetails?.worker_user?.phone?.number && (
                    <p>
                      {projectDetails?.worker_user?.phone?.country_code &&
                        projectDetails?.worker_user.phone.country_code}{' '}
                      {projectDetails?.worker_user.phone.number}
                    </p>
                  )}
                  {projectDetails?.worker_user?.telegram_user_link && (
                    <p>{projectDetails?.worker_user?.telegram_user_link}</p>
                  )}
                </div>

                <div className="text-right text-sm font-normal text-brandGray-600 dark:text-brandGray-200">
                  <p>Invoice #</p>
                  {projectDetails?.project_invoice?.due_date && (
                    <p className="font-semibold text-brandGray-400 dark:text-brandGray-200">
                      Due date{' '}
                      {new Date(
                        projectDetails.project_invoice.due_date
                      ).toDateString()}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="w-full">
              <Payment
                invoiceData={projectDetails?.project_invoice}
                updateStatus={handleUpdateProjectStatus}
              />
            </div>
          </ModalWrapper>
        </>
      )}

      <WalletConnectModal
        open={openwalletConnectModal}
        setOpen={setOpenWalletConnectModal}
        isRedirect={!userData?.is_signup_completed}
        from={router.asPath}
      />
    </>
  );
};

export default Project;
