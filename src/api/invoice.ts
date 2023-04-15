import httpCommon from '@/services/httpCommon';
import type { InvoiceData } from '@/types';

export const createInvoice = (data: InvoiceData) => {
  return httpCommon.post('/invoice', data);
};

export const getInvoices = () => {
  return httpCommon.get('/invoice');
};

export const getInvoice = (id: string) => {
  console.log('getting invoice', id);
  return httpCommon.get(`/invoice/${id}`);
};

export const updateInvoiceStatus = (data: {
  id: string;
  status: string;
  amount?: string;
  interval_duration?: string;
}) => {
  console.log('posting ', data);
  return httpCommon.post('/invoice/update-status', data);
};
