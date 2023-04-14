import httpCommon from '@/services/httpCommon';
import type { InvoiceData } from '@/types';

export const createInvoice = (data: InvoiceData) => {
  return httpCommon.post('/invoice', data);
};

export const getInvoices = () => {
  return httpCommon.get('/invoice');
};

export const updateInvoiceStatus = (data: { id: string; status: string }) => {
  return httpCommon.post('/invoice/update-status', data);
};
