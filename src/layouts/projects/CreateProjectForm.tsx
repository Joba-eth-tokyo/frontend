import 'react-datepicker/dist/react-datepicker.css';

import type { FormikTouched, FormikValues } from 'formik';
import React from 'react';
import DatePicker from 'react-datepicker';

import Button from '@/components/Button';
import ErrorBox from '@/components/form/ErrorBox';
import { DocumentIcon } from '@/components/icons';
import type { InvoiceData } from '@/types';
import { ROLE_LIST } from '@/utils/constant';

interface CreateProjectFormProps {
  values: FormikValues;
  touched: FormikTouched<FormikValues>;
  isLoading: boolean;
  errors: any;
  invoiceList: InvoiceData[];
  setShowCreateInvoiceModal: (val: boolean) => void;
  handleSubmit: (e?: React.FormEvent<HTMLFormElement> | undefined) => void;
  handleChange: (e: React.ChangeEvent<any>) => void;
  handleBlur: (e: React.FocusEvent<any>) => void;
  setValues: any;
}

const CreateProjectForm: React.FC<CreateProjectFormProps> = ({
  values,
  touched,
  isLoading,
  errors,
  invoiceList,
  setShowCreateInvoiceModal,
  handleSubmit,
  handleChange,
  handleBlur,
  setValues,
}) => {
  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-6">
        <label
          className="text-sm font-bold text-brandGray-500 dark:text-yellow-200"
          htmlFor="displayName"
        >
          Project Name *
        </label>
        <input
          id="projectName"
          name="projectName"
          className="mt-2 h-12 w-full rounded-md border border-brandGray-200 p-3 text-sm text-brandGray-500 placeholder:text-brandGray-200 focus:outline-none focus:ring-0 dark:border-brandGray-300 dark:bg-brandGray-300 dark:text-brandGray-200 dark:placeholder:text-brandGray-200/40"
          autoComplete="off"
          value={values.projectName}
          onChange={handleChange}
          onBlur={handleBlur}
        />

        {errors.projectName && touched.projectName && (
          <ErrorBox error={errors.projectName} />
        )}
      </div>

      <div className="mb-6">
        <label
          className="text-sm font-bold text-brandGray-500 dark:text-yellow-200"
          htmlFor="projectOwner"
        >
          Project owner (Client wallet address) *
        </label>
        <input
          id="projectOwner"
          name="projectOwner"
          className="mt-2 h-12 w-full rounded-md border border-brandGray-200 p-3 text-sm text-brandGray-500 placeholder:text-brandGray-200 focus:outline-none focus:ring-0 dark:border-brandGray-300 dark:bg-brandGray-300 dark:text-brandGray-200 dark:placeholder:text-brandGray-200/40"
          autoComplete="off"
          value={values.projectOwner}
          onChange={handleChange}
          onBlur={handleBlur}
        />

        {errors.projectOwner && touched.projectOwner && (
          <ErrorBox error={errors.projectOwner} />
        )}
      </div>

      <div className="mb-6">
        <label
          className="text-sm font-bold text-brandGray-500 dark:text-yellow-200"
          htmlFor="projectInvoiceId"
        >
          Project invoice *
        </label>
        <div className="mt-2 flex items-center gap-2 ">
          <div className="flex-1">
            <select
              id="projectInvoiceId"
              name="projectInvoiceId"
              value={values.projectInvoiceId}
              onChange={handleChange}
              onBlur={handleBlur}
              className="h-12 w-full rounded-md border border-brandGray-200 p-3 text-sm text-brandGray-500 placeholder:text-brandGray-200 focus:outline-none focus:ring-0 dark:border-brandGray-300 dark:bg-brandGray-300 dark:text-brandGray-200 dark:placeholder:text-brandGray-200/40"
            >
              <option value="" label="Select invoice">
                Select invoice *
              </option>
              {invoiceList.map((invoice: InvoiceData, index: number) => (
                <option key={invoice.id} value={invoice.id}>
                  Invoice No. {index + 1} - {invoice.amount} {invoice.currency}
                </option>
              ))}
            </select>
          </div>

          <Button
            className="!p-3 text-white"
            buttonType="secondary"
            leftSideIcon={
              <DocumentIcon className="stroke-white group-hover:stroke-yellow-200" />
            }
            type="button"
            onClick={() => setShowCreateInvoiceModal(true)}
          >
            Create invoice
          </Button>
        </div>

        {errors.projectInvoiceId && touched.projectInvoiceId && (
          <ErrorBox error={errors.projectInvoiceId} />
        )}
      </div>
      <div className="mb-6">
        <label
          className="text-sm font-bold text-brandGray-500 dark:text-yellow-200"
          htmlFor="telegramUserLink"
        >
          Role *
        </label>
        <select
          id="role"
          name="role"
          value={values.role}
          onChange={handleChange}
          onBlur={handleBlur}
          className="mt-2 h-12 w-full rounded-md border border-brandGray-200 p-3 text-sm text-brandGray-500 placeholder:text-brandGray-200 focus:outline-none focus:ring-0 dark:border-brandGray-300 dark:bg-brandGray-300 dark:text-brandGray-200 dark:placeholder:text-brandGray-200/40"
        >
          <option value="">Select a Role </option>
          {ROLE_LIST.map((role: string) => (
            <option value={role} key={role}>
              {role}
            </option>
          ))}
        </select>
        {errors.role && touched.role && <ErrorBox error={errors.role} />}
      </div>

      <div className="mb-6">
        <label
          className="text-sm font-bold text-brandGray-500 dark:text-yellow-200"
          htmlFor="description"
        >
          Description *
        </label>
        <textarea
          id="description"
          autoComplete="off"
          name="description"
          placeholder="Enter description"
          className="mt-2 w-full resize-none rounded-md border border-brandGray-200 p-3 text-sm text-brandGray-500 placeholder:text-brandGray-200 focus:outline-none focus:ring-0 dark:border-brandGray-300 dark:bg-brandGray-300 dark:text-brandGray-200 dark:placeholder:text-brandGray-200/40"
          value={values.description}
          rows={8}
          onChange={handleChange}
          onBlur={handleBlur}
        />

        {errors.description && touched.description && (
          <ErrorBox error={errors.description} />
        )}
      </div>

      <div className="mb-6">
        <label
          className="text-sm font-bold text-brandGray-500 dark:text-yellow-200"
          htmlFor="dueDate"
        >
          Due date *
        </label>

        <DatePicker
          selected={values.dueDate}
          minDate={new Date()}
          className="mt-2 h-12 w-full rounded-md border border-brandGray-200 p-3 text-sm text-brandGray-500 placeholder:text-brandGray-200 focus:outline-none focus:ring-0 dark:border-brandGray-300 dark:bg-brandGray-300 dark:text-brandGray-200  dark:placeholder:text-brandGray-200/40"
          onChange={(date: Date) =>
            setValues((prev: any) => ({
              ...prev,
              dueDate: new Date(date),
            }))
          }
        />

        {errors.dueDate && touched.dueDate && (
          <ErrorBox error={errors.dueDate as string} />
        )}
      </div>

      <Button
        disabled={isLoading}
        isLoading={isLoading}
        className="w-full !py-3.5"
        buttonType="primary"
        type="submit"
        leftSideIcon
      >
        Create Project
      </Button>
    </form>
  );
};

export default CreateProjectForm;
