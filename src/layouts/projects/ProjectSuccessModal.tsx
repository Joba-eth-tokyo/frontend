import React from 'react';

import Button from '@/components/Button';
import { CopyIcon, MailIcon, MessengerIcon } from '@/components/icons';
import ModalWrapper from '@/components/ModalWrapper';
import useCopy from '@/hooks/useCopy';
import { URLS } from '@/utils/urls';

interface ProjectSuccessModalProps {
  showModal: boolean;
  newPorjectId: string;
  setModal: (val: boolean) => void;
  handleRedirect: () => void;
}

const ProjectSuccessModal: React.FC<ProjectSuccessModalProps> = ({
  showModal,
  newPorjectId,
  setModal,
  handleRedirect,
}) => {
  const { handleCopy } = useCopy();

  const projectUrl =
    `${window.location.origin}${URLS.VIEW_PROJECT}${newPorjectId}` as string;
  return (
    <ModalWrapper
      showModal={showModal}
      setModal={(val) => {
        setModal(val);
      }}
      title="Project created"
      maskClosable={false}
    >
      <div className="space-y-8 pt-10 md:pt-20">
        <div className="space-y-2">
          <p className="text-base text-primary-100  dark:text-yellow-200">
            Get shareable link
          </p>
          <div className="flex items-center gap-4">
            <input
              className="h-12 flex-1 rounded-md border border-brandGray-200 bg-brandWhite-200 p-4 outline-none placeholder:text-base-100 dark:bg-brandBlack-100 dark:text-brandGray-200 dark:placeholder:text-white"
              value={projectUrl}
              readOnly={true}
            />

            <div
              className="cursor-pointer"
              onClick={() => handleCopy(projectUrl)}
            >
              <CopyIcon className="fill-primary-100 dark:fill-yellow-200" />
            </div>
          </div>
          <div className="mt-2 flex items-center gap-3">
            <div className="flex items-center gap-2">
              <p className="text-sm leading-none dark:text-brandGray-200">
                Share via mail
              </p>
              <MailIcon className="w-3.5 fill-primary-100 dark:fill-yellow-200" />
            </div>
            <div className="flex items-center gap-2">
              <p className="text-sm leading-none dark:text-brandGray-200">
                Share via telegram
              </p>
              <MessengerIcon className="w-3.5 fill-primary-100 dark:fill-yellow-200" />
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <Button
            buttonType="primary"
            type="button"
            className="h-12 w-full"
            onClick={() => handleRedirect()}
          >
            Continue to dashboard
          </Button>
          <Button
            buttonType="outlined"
            type="button"
            className="h-12 w-full"
            onClick={() => setModal(false)}
          >
            Create New Project
          </Button>
        </div>
      </div>
    </ModalWrapper>
  );
};

export default ProjectSuccessModal;
