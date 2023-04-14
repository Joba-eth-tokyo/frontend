import 'react-phone-input-2/lib/style.css';

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { useAccount } from 'wagmi';

import Button from '@/components/Button';
import Header from '@/components/Header';
import { LoaderIcon } from '@/components/icons';
import { useAuth } from '@/context/auth';
import { Meta } from '@/layouts/Meta';
import CreateProfileForm from '@/layouts/profile/CreateProfileForm';
import { Main } from '@/templates/Main';
import { ProfileType } from '@/utils/enums';
import { URLS } from '@/utils/urls';

const CreateProfile = () => {
  const router = useRouter();
  const { from } = router.query;
  const { userData, loading } = useAuth();
  const { address, isConnecting } = useAccount();
  const [pageLoading, setpageLoading] = useState<boolean>(true);
  const [isCreateProfileForm, setIsCreateProfileForm] =
    useState<boolean>(false);
  const [profileType, setProfileType] = useState<ProfileType | null>(null);

  useEffect(() => {
    if (address) {
      if (!loading) {
        if (userData && userData.is_signup_completed) {
          if (from) {
            router.replace(`${from}`);
          } else {
            router.replace(URLS.DASHBOARD_HOME);
          }
        } else {
          setpageLoading(false);
        }
      }
    } else {
      router.replace(URLS.ROOT);
    }
  }, [address, userData, loading]);

  const onProceedHandler = () => {
    setIsCreateProfileForm(true);
  };

  if (pageLoading || loading || isConnecting) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoaderIcon className="animate-spin stroke-base-100" />
      </div>
    );
  }

  return (
    <Main
      meta={<Meta title="JOBA" description="JOBA" />}
      wrapperClassName="flex flex-col flex-1"
    >
      <Header className="!bg-white" />
      <div className="flex h-full w-full flex-1 flex-col items-center justify-start bg-brandWhite-200 px-6">
        <h1 className="my-11 text-4xl font-bold text-brandBlack-300">
          Create Profile
        </h1>

        {!isCreateProfileForm ? (
          <div className="pb-11">
            <div className="grid h-full w-full grid-cols-1 gap-4 md:grid-cols-2">
              <div
                role="presentation"
                onClick={() => setProfileType(ProfileType.ANONYMOUS)}
                className={twMerge(
                  'flex h-56 w-72 cursor-pointer flex-col items-center justify-center rounded-lg border border-gray-25 bg-white transition-all duration-300 hover:-translate-y-1',
                  profileType === 'anonymous' && 'border-brandPurple-100'
                )}
              >
                <img
                  src="/assets/images/profile-anonymous-icon.svg"
                  alt="anonymous"
                />
                <h2 className="mt-3 text-center text-base font-bold text-primary-500">
                  I wish to be <br /> Pseudo-anonymous
                </h2>
              </div>
              <div
                role="presentation"
                onClick={() => setProfileType(ProfileType.CONTACTABLE)}
                className={twMerge(
                  'flex h-56 w-72 cursor-pointer flex-col items-center justify-center rounded-lg border border-gray-25 bg-white transition-all duration-300 hover:-translate-y-1',
                  profileType === 'contactable' && 'border-brandPurple-100'
                )}
              >
                <img
                  src="/assets/images/profile-contactable-icon.svg"
                  alt="contactable"
                />
                <h2 className="mt-3 text-center text-base font-bold text-primary-500">
                  I wish to be contactable <br /> by potential clients
                </h2>
              </div>
            </div>

            <div className="mt-10 flex w-full items-center justify-center">
              <Button
                type="button"
                disabled={!profileType}
                onClick={() => onProceedHandler()}
                buttonType="primary"
              >
                Proceed
              </Button>
            </div>
          </div>
        ) : (
          <CreateProfileForm
            profileType={profileType as ProfileType}
            setIsCreateProfileForm={setIsCreateProfileForm}
          />
        )}
      </div>
    </Main>
  );
};

export default CreateProfile;
