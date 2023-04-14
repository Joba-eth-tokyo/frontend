import type { toastMessageVariants } from '@/utils/constant';

export interface NetworkCardProps {
  backgroundColor: string;
  title: string;
  description: string;
  linkLabel: string;
  href: string;
  members?: {
    id: string | number;
    image: string;
    name: string;
  }[];
}

export interface CollapseProps {
  id: any;
  title: string;
  description: string;
}

export interface FAQ {
  id: number | string;
  question: string;
  answer: string;
}

// toast props
export type TostMessageType = 'Info' | 'Success' | 'Warning' | 'Error';

export type Toast = {
  id: string;
  lifetime: number;
  message: string;
  title: string;
  type?: TostMessageType;
  header?: string;
};

export type ToastMessage = {
  id: string;
  lifetime?: number;
  variant?: keyof typeof toastMessageVariants | undefined;
  onRemove?: (id: string) => void;
} & Toast;

export type ToastMessageProps = {
  id: string;
  lifetime?: number;
  variant?: keyof typeof toastMessageVariants | undefined;
  onRemove?: (id: string) => void;
} & Toast;

export interface UserData {
  id?: string;
  email?: string;
  wallet_address: string;
  display_name?: string;
  profile_photo?: string;
  telegram_user_link?: string;
  phone?: any;
  residential_address?: any;
  is_signup_completed?: boolean;
}

export interface InvoiceData {
  id?: string;
  request_network_id: number;
  request_network_url: string;
  status: string;
  amount: number;
  currency: string;
  due_date?: string;
  invoice_status?: { id: string; name: string };
}
export interface ProjectData {
  id?: string;
  name: string;
  description: string;
  invoice: string;
  role: string;
  status: string;
  worker?: string;
  client?: string;
  due_date?: string;
  client_rating?: number;
  worker_rating?: number;
  project_invoice?: InvoiceData;
  worker_user?: UserData;
  client_user?: UserData;
}

export interface InvoiceStatusType {
  id: string;
  name: string;
}

export interface LoginUser {
  wallet_address: string;
  message: string;
  signedMessage: string;
}
