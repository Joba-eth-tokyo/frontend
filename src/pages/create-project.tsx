import * as ethers from 'ethers';
import type { FormikValues } from 'formik';
import { useFormik } from 'formik';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import * as Yup from 'yup';

import { getInvoices } from '@/api/invoice';
import { createProject } from '@/api/project';
import Header from '@/components/Header';
import { LoaderIcon } from '@/components/icons';
import { ImageWithFallback } from '@/components/ImageWithFallback';
import { useAuth } from '@/context/auth';
import { useToast } from '@/context/Toast';
import InvoiceSuccessModal from '@/layouts/invoice/InvoiceSuccessModal';
import { Meta } from '@/layouts/Meta';
import CreateProjectForm from '@/layouts/projects/CreateProjectForm';
import ProjectInvoiceModal from '@/layouts/projects/ProjectInvoiceModal';
import ProjectSuccessModal from '@/layouts/projects/ProjectSuccessModal';
import { Main } from '@/templates/Main';
import type { InvoiceData, ProjectData } from '@/types';
import { truncateString } from '@/utils/truncateString';
import { URLS } from '@/utils/urls';

const initialValues = {
  projectName: '',
  projectOwner: '',
  projectInvoiceId: '',
  role: '',
  description: '',
  dueDate: new Date(),
};

const validationSchema = Yup.object({
  projectName: Yup.string().required('Project name is required.'),
  projectOwner: Yup.string()
    .required('Project owner is required.')
    .test(
      'is-valid-address',
      'Please enter a valid ENS or ETH address',
      (value: string) => !value || ethers.utils.isAddress(value)
    ),
  projectInvoiceId: Yup.string().required('Project invoice is required.'),
  role: Yup.string().required('Role is required.'),
  description: Yup.string().required('Description is required.'),
  dueDate: Yup.date().label('Due Date'),
});

const CreateProject = () => {
  const router = useRouter();
  const { userData, loading } = useAuth();
  const { toastError, toastSuccess } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [invoiceList, setInvoiceList] = useState<InvoiceData[]>([]);
  const [showCreateInvoiceModal, setShowCreateInvoiceModal] =
    useState<boolean>(false);
  const [showSuccessInvoiceModal, setShowSuccessInvoiceModal] =
    useState<boolean>(false);
  const [showSuccessProjectModal, setShowSuccessProjectModal] =
    useState<boolean>(false);
  const [newInvoiceDetails, setNewInvoiceDetails] =
    useState<InvoiceData | null>(null);
  const [newProjectDetails, setNewProjectDetails] =
    useState<ProjectData | null>(null);

  useEffect(() => {
    if (!loading && !userData) {
      router.replace(URLS.ROOT);
    }
  }, [userData, loading]);

  const fetchAllInvoices = async () => {
    try {
      const response = await getInvoices();
      setInvoiceList(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAllInvoices();
  }, []);

  const {
    handleSubmit,
    handleChange,
    handleBlur,
    setValues,
    resetForm,
    values,
    errors,
    touched,
  } = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (data: FormikValues) => {
      if (!userData) return;
      setIsLoading(true);
      try {
        const response = await createProject({
          name: data.projectName,
          description: data.description,
          invoice: data.projectInvoiceId,
          role: data.role,
          client: data.projectOwner,
          worker: userData.id,
          due_date: data.dueDate,
          client_rating: 0,
          worker_rating: 0,
          status: 'pending',
        });
        setNewProjectDetails(response.data.data);
        setIsLoading(false);
        toastSuccess('Success', 'Project created successfully');
        setShowSuccessProjectModal(true);
        resetForm();
      } catch (error: any) {
        toastError('Project Create Error!', error.response.data.msg);
        setIsLoading(false);
      }
    },
  });

  const handleCreateInvoiceResponse = (createdInvoice: InvoiceData) => {
    setShowCreateInvoiceModal(false);
    setNewInvoiceDetails(createdInvoice);
    setShowSuccessInvoiceModal(true);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoaderIcon className="animate-spin stroke-base-100" />
      </div>
    );
  }

  const handleRedirect = () => {
    router.push(URLS.DASHBOARD_HOME);
  };

  const handleUpdateInvoice = () => {
    if (newInvoiceDetails?.id) {
      setInvoiceList((prev) => [...prev, newInvoiceDetails]);
      setValues((prev) => ({
        ...prev,
        projectInvoiceId: newInvoiceDetails.id as string,
      }));
    }
    setShowSuccessInvoiceModal(false);
    setNewInvoiceDetails(null);
  };

  return (
    <Main
      meta={
        <Meta
          title="JOBA - Create Project"
          description="JOBA - Create Project"
        />
      }
    >
      <Header className="bg-white" />
      <div className=" bg-brandWhite-200 p-5 py-8 dark:bg-primary-200 md:p-11">
        <div className="mx-auto h-full max-w-7xl space-y-11">
          <h1 className="text-base font-bold leading-120 text-brandBlack-300 dark:text-yellow-200 md:text-4xl">
            Create project
          </h1>

          <div className="mx-auto w-full max-w-3xl rounded-lg bg-white p-4 dark:bg-brandBlack-100 md:p-11">
            <div className="space-y-4 border-b border-brandGray-200  pb-5">
              <p className="text-base font-medium dark:text-brandGray-200">
                From
              </p>
              <div className="flex items-center gap-2">
                <ImageWithFallback
                  className="h-10 w-10 overflow-hidden rounded-full"
                  src={userData?.profile_photo || ''}
                  alt={userData?.display_name || 'user'}
                />

                <p className="line-clamp-1 text-base font-medium dark:text-yellow-200">
                  {userData?.display_name ??
                    truncateString({
                      string: userData?.wallet_address as string,
                      afterDotsStringLength: 3,
                    })}
                </p>
              </div>
            </div>

            <div className="mx-auto max-w-md py-8  md:py-10">
              <CreateProjectForm
                values={values}
                touched={touched}
                errors={errors}
                isLoading={isLoading}
                invoiceList={invoiceList}
                handleChange={handleChange}
                handleBlur={handleBlur}
                handleSubmit={handleSubmit}
                setValues={setValues}
                setShowCreateInvoiceModal={setShowCreateInvoiceModal}
              />
            </div>
          </div>
        </div>
      </div>

      <ProjectInvoiceModal
        showModal={showCreateInvoiceModal}
        totalInvoiceCount={invoiceList.length}
        setModal={setShowCreateInvoiceModal}
        handleCreateInvoiceResponse={handleCreateInvoiceResponse}
        payer_wallet={values.projectOwner || ''}
      />

      <InvoiceSuccessModal
        showModal={showSuccessInvoiceModal}
        requestNetworkUrl={newInvoiceDetails?.request_network_url as string}
        invoiceId={newInvoiceDetails?.id as string}
        setModal={(val) => {
          setShowSuccessInvoiceModal(val);
          setNewInvoiceDetails(null);
        }}
        handleUpdateInvoice={handleUpdateInvoice}
      />

      <ProjectSuccessModal
        showModal={showSuccessProjectModal}
        newPorjectId={newProjectDetails?.id as string}
        setModal={setShowSuccessProjectModal}
        handleRedirect={handleRedirect}
      />
    </Main>
  );
};

export default CreateProject;
