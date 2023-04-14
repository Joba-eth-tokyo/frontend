import type { CurrencyDefinition } from '@requestnetwork/currency';
import type { Types } from '@requestnetwork/request-client.js';
import { RequestNetwork } from '@requestnetwork/request-client.js';
import { useCurrency } from 'request-shared';

export const getRequestClient = (
  network: string,
  signatureProvider?: Types.SignatureProvider.ISignatureProvider,
  currencyList?: CurrencyDefinition[]
) => {
  const requestNetwork = new RequestNetwork({
    nodeConnectionConfig: {
      baseURL: `https://${network}.gateway.request.network/`,
    },
    signatureProvider,
    currencies: currencyList,
  });

  return requestNetwork;
};

export const useRequestClient = (
  network: string,
  signatureProvider?: Types.SignatureProvider.ISignatureProvider
) => {
  const { currencyList } = useCurrency();
  return getRequestClient(network, signatureProvider, currencyList);
};
