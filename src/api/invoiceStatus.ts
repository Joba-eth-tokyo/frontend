import httpCommon from '@/services/httpCommon';

export const getAllInvoiceStatus = async () => {
  return httpCommon.get(`/invoice-status`);
};
