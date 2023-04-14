import { useToast } from '@/context/Toast';

interface UseCopy {
  handleCopy: (url: string, successMessage?: string) => void;
}

const useCopy = (): UseCopy => {
  const { toastSuccess } = useToast();

  const handleCopy = (url: string, successMessage?: string) => {
    if (navigator && url) {
      navigator.clipboard.writeText(url);
      toastSuccess('Success', successMessage ?? 'Link copied!');
    }
  };

  return { handleCopy };
};

export default useCopy;
