import type { ReactNode } from 'react';
import { createContext, useCallback, useContext, useState } from 'react';

import type { Toast, TostMessageType } from '@/types';
import { uuidv4 } from '@/utils/helper';

const DEFAULT_INTERVAL = 5000;

type ToastType = {
  data: Array<Toast>;
  toastError(title: string, message: string, lifetime?: number): void;
  toastWarning(title: string, message: string, lifetime?: number): void;
  toastSuccess(title: string, message: string, lifetime?: number): void;
  toastInfo(title: string, message: string, lifetime?: number): void;
  toast(
    title: string,
    message: string,
    type: TostMessageType,
    lifetime?: number
  ): void;
  remove(id: string): void;
};

export const ToastContext = createContext({} as ToastType);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<Array<Toast>>([]);

  const Push = useCallback(
    (
      title: string,
      message: string,
      type: TostMessageType,
      lifetime?: number
    ) => {
      if (message) {
        const newItem: Toast = {
          id: uuidv4(),
          title,
          message,
          type,
          lifetime: lifetime || DEFAULT_INTERVAL,
        };

        setData((prevState) => [...prevState, newItem]);
      }
    },
    [setData, data]
  );

  const toastError = useCallback(
    (title: string, message: string, lifetime?: number) =>
      Push(title, message, 'Error', lifetime),
    [Push]
  );

  const toastWarning = useCallback(
    (title: string, message: string, lifetime?: number) =>
      Push(title, message, 'Warning', lifetime),
    [Push]
  );

  const toastSuccess = useCallback(
    (title: string, message: string, lifetime?: number) =>
      Push(title, message, 'Success', lifetime),
    [Push]
  );

  const toastInfo = useCallback(
    (title: string, message: string, lifetime?: number) =>
      Push(title, message, 'Info', lifetime),
    [Push]
  );

  const toast = useCallback(
    (
      title: string,
      message: string,
      type: TostMessageType,
      lifetime?: number
    ) => Push(title, message, type, lifetime),
    [Push]
  );

  const remove = (id: string) => {
    setData((prevState) => prevState.filter((e) => e.id !== id));
  };

  return (
    <ToastContext.Provider
      value={{
        data,
        toastError,
        toastWarning,
        toastSuccess,
        toastInfo,
        toast,
        remove,
      }}
    >
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
