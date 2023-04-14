import { verifyMessage } from 'ethers/lib/utils';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useSignMessage } from 'wagmi';

import { login } from '@/api';
import { useAuth } from '@/context/auth';
import { useToast } from '@/context/Toast';
import { URLS } from '@/utils/urls';

import Button from '../Button';
import ErrorBox from '../form/ErrorBox';

export function SignMessage({
  setOpen,
  from,
  isRedirect = true,
}: {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isRedirect?: boolean;
  from?: string;
}) {
  const router = useRouter();
  const { userData, getUserData } = useAuth();
  const { toastError, toastSuccess } = useToast();
  const [loginError, setLoginError] = useState('');

  const { error, isLoading, signMessage } = useSignMessage({
    onSuccess(resData, variables) {
      const address = verifyMessage(variables.message, resData);

      if (address && resData) {
        setLoginError('');
        const reqObj = {
          wallet_address: address,
          message: variables.message as string,
          signedMessage: resData,
        };

        login(reqObj)
          .then(async (res) => {
            if (res.data?.access_token) {
              Cookies.set('access_token', res.data.access_token);
              toastSuccess(
                'Wallet Connected',
                `Wallet connected successfully: ${address}`
              );
              setOpen(false);
              await getUserData();

              if (isRedirect) {
                router.push({
                  pathname: userData?.is_signup_completed
                    ? URLS.DASHBOARD_HOME
                    : URLS.CREATE_PROFILE,
                  query: from
                    ? {
                        from,
                      }
                    : undefined,
                });
              } else if (typeof window !== undefined) window.location.reload();
            } else {
              toastError(
                'Login error',
                'Something went wrong! Please try again later.'
              );
              setLoginError('Something went wrong! Please try again later.');
            }
          })
          .catch((err) => {
            toastError('Login error', err.response.data.message);
            setLoginError(err.response.data.message);
          });
      }
    },
  });

  function handleSubmit() {
    signMessage({ message: 'Sign In' });
  }

  return (
    <div className="space-y-2">
      <Button
        type="submit"
        buttonType="primary"
        className="mt-6 w-full"
        disabled={isLoading}
        isLoading={isLoading}
        onClick={() => handleSubmit()}
      >
        Sign In
      </Button>
      {error && <ErrorBox error={error.message} />}
      {loginError && <ErrorBox error={loginError} />}
    </div>
  );
}
