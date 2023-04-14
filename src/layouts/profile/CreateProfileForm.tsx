/* eslint-disable @typescript-eslint/no-use-before-define */
import type { FormikValues } from 'formik';
import { useFormik } from 'formik';
import router from 'next/router';
import React, { useState } from 'react';
import PhoneInput from 'react-phone-input-2';
import { useAccount } from 'wagmi';
import * as Yup from 'yup';

import { createProfile } from '@/api';
import Button from '@/components/Button';
import ErrorBox from '@/components/form/ErrorBox';
import { useAuth } from '@/context/auth';
import { useToast } from '@/context/Toast';
import { ProfileType } from '@/utils/enums';
import { URLS } from '@/utils/urls';

const initialValues = {
  displayName: '',
  email: '',
  telegramUserLink: '',
  phone: '',
  phoneCode: '+1',
  streetAddress: '',
  city: '',
  country: '',
  province: '',
};

const profileValidationSchema = Yup.object({
  displayName: Yup.string().required('Display name is required.'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email address is required.'),
});

interface CreateProfileFormProps {
  profileType: ProfileType;
  setIsCreateProfileForm: (val: boolean) => void;
}

const CreateProfileForm: React.FC<CreateProfileFormProps> = ({
  profileType,
  setIsCreateProfileForm,
}) => {
  const { setUserData } = useAuth();
  const { address } = useAccount();
  const { toastSuccess, toastError } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmitForm = async (formValues: FormikValues) => {
    if (!address) {
      toastError('Wallet is not connected', 'Wallet Address can not found!');
      return;
    }
    setIsLoading(true);

    const phoneObj = {
      country_code: parseInt(formValues.phoneCode, 10),
      number: parseInt(formValues.phone.slice(formValues.phoneCode.length), 10),
    };

    const residentialAddress = {
      street_address: formValues.streetAddress,
      city: formValues.city,
      country: formValues.country,
      province: formValues.province,
    };

    const data = {
      email: formValues.email,
      wallet_address: address,
      display_name: formValues.displayName,
      telegram_user_link: formValues.telegramUserLink,
      phone: JSON.stringify(phoneObj),
      residential_address: JSON.stringify(residentialAddress),
      is_signup_completed: true,
    };
    try {
      const response = await createProfile(data);
      setUserData(response.data.data);
      setIsLoading(false);
      toastSuccess('Profile Created', response.data.msg);
      router.replace(URLS.DASHBOARD_HOME);
    } catch (err: any) {
      toastError('Profile Create Error!', err.response.data.msg);
      setIsLoading(false);
    }
  };

  const {
    handleSubmit,
    handleChange,
    handleBlur,
    values,
    errors,
    touched,
    setValues,
  } = useFormik({
    initialValues,
    validationSchema:
      profileType === ProfileType.CONTACTABLE ? profileValidationSchema : false,
    onSubmit: (formValues: FormikValues) => {
      handleSubmitForm(formValues);
    },
  });

  return (
    <div className="mb-14 flex w-full max-w-3xl items-center justify-center rounded-lg border border-gray-25 bg-white p-12">
      <form onSubmit={handleSubmit}>
        <div className="w-full max-w-md">
          <div className="mb-6">
            <label
              className="text-sm font-bold text-brandGray-500"
              htmlFor="displayName"
            >
              Display name {profileType === ProfileType.CONTACTABLE && '*'}
            </label>
            <input
              id="displayName"
              name="displayName"
              placeholder="Display name"
              className="mt-2 h-12 w-full rounded-md border border-brandGray-200 p-3 text-sm text-brandGray-500 placeholder:text-brandGray-200 focus:outline-none focus:ring-0"
              value={values.displayName}
              onChange={handleChange}
              onBlur={handleBlur}
            />

            {errors.displayName && touched.displayName && (
              <ErrorBox error={errors.displayName} />
            )}
          </div>

          <div className="mb-6">
            <label
              className="text-sm font-bold text-brandGray-500"
              htmlFor="email"
            >
              Email address {profileType === ProfileType.CONTACTABLE && '*'}
            </label>
            <input
              id="email"
              name="email"
              placeholder="Email address"
              className="mt-2 h-12 w-full rounded-md border border-brandGray-200 p-3 text-sm text-brandGray-500 placeholder:text-brandGray-200 focus:outline-none focus:ring-0"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
            />

            {errors.email && touched.email && <ErrorBox error={errors.email} />}
          </div>

          <div className="mb-6">
            <label
              className="text-sm font-bold text-brandGray-500"
              htmlFor="telegramUserLink"
            >
              Telegram user link
            </label>
            <input
              id="telegramUserLink"
              name="telegramUserLink"
              placeholder="Telegram user link"
              className="mt-2 h-12 w-full rounded-md border border-brandGray-200 p-3 text-sm text-brandGray-500 placeholder:text-brandGray-200 focus:outline-none focus:ring-0"
              value={values.telegramUserLink}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </div>

          <div className="mb-6">
            <label
              className="text-sm font-bold text-brandGray-500"
              htmlFor="phone"
            >
              Phone number
            </label>
            <div className="mt-2 flex items-center">
              <PhoneInput
                inputProps={{
                  id: 'phone',
                  name: 'phone',
                  placeholder: 'Phone number',
                }}
                country={'us'}
                inputClass="!h-12 !w-full !rounded-md !border !border-brandGray-200 !py-3 !pr-3 !text-sm !text-brandGray-500 !placeholder:text-brandGray-200 !focus:outline-none !focus:ring-0"
                value={values.phone}
                onChange={(p, d: any) => {
                  setValues((prev) => ({
                    ...prev,
                    phone: p,
                    phoneCode: d.dialCode || '1',
                  }));
                }}
                onBlur={handleBlur}
              />
            </div>
          </div>

          <div className="mb-6">
            <label
              className="text-sm font-bold text-brandGray-500"
              htmlFor="streetAddress"
            >
              Street address
            </label>
            <input
              id="streetAddress"
              name="streetAddress"
              placeholder="Street address"
              className="mt-2 h-12 w-full rounded-md border border-brandGray-200 p-3 text-sm text-brandGray-500 placeholder:text-brandGray-200 focus:outline-none focus:ring-0"
              value={values.streetAddress}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </div>
          <div className="flex items-center gap-x-8">
            <div className="mb-6">
              <label
                className="text-sm font-bold text-brandGray-500"
                htmlFor="city"
              >
                City
              </label>
              <input
                id="city"
                name="city"
                placeholder="City"
                className="mt-2 h-12 w-full rounded-md border border-brandGray-200 p-3 text-sm text-brandGray-500 placeholder:text-brandGray-200 focus:outline-none focus:ring-0"
                value={values.city}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </div>
            <div className="mb-6">
              <label
                className="text-sm font-bold text-brandGray-500"
                htmlFor="country"
              >
                Country
              </label>
              <input
                id="country"
                name="country"
                placeholder="Country"
                className="mt-2 h-12 w-full rounded-md border border-brandGray-200 p-3 text-sm text-brandGray-500 placeholder:text-brandGray-200 focus:outline-none focus:ring-0"
                value={values.country}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </div>
          </div>
          <div className="mb-6">
            <label
              className="text-sm font-bold text-brandGray-500"
              htmlFor="province"
            >
              Province
            </label>
            <input
              id="province"
              name="province"
              placeholder="Province"
              className="mt-2 h-12 w-full rounded-md border border-brandGray-200 p-3 text-sm text-brandGray-500 placeholder:text-brandGray-200 focus:outline-none focus:ring-0"
              value={values.province}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </div>

          <div className="py-6">
            <Button
              disabled={isLoading}
              isLoading={isLoading}
              className="w-full"
              buttonType="primary"
              type="submit"
            >
              Create Profile
            </Button>

            <div className="mt-4 flex items-center justify-center">
              <button
                type="button"
                onClick={() => setIsCreateProfileForm(false)}
                className="text-base font-bold text-brandBlack-200 hover:text-primary-100"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateProfileForm;
