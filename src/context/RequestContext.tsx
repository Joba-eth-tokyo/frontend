/* eslint-disable no-param-reassign */
import type { CurrencyDefinition } from '@requestnetwork/currency';
import type { Request } from '@requestnetwork/request-client.js';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';
import type { IParsedRequest } from 'request-shared';
import {
  chainIdToName,
  parseRequest,
  useCurrency,
  useRate,
} from 'request-shared';

import { getRequestClient } from '@/helper/client';

interface IContext {
  /** true if first fetch is ongoing */
  loading: boolean;
  /** the fetched request */
  request?: IParsedRequest;
  /** the counter fiat currency, for display */
  counterCurrency: CurrencyDefinition;
  /** the request's expected amount in counter currency */
  counterValue?: string;
  /**
   * set the pending status for UX purposes
   * Pending means the payment is being processed and takes a long time.
   */
  setPending: (val: boolean) => void;
  update: () => Promise<void>;
  setId: React.Dispatch<React.SetStateAction<string | null>>;
}

/**
 * This context loads the request, based on ID in the URL.
 * It also handles rate conversion of the request's amount in a counter currency,
 * as well as the pending state, that exists for UX reasons.
 */
export const RequestContext = React.createContext<IContext | null>(null);

/** Gets a request from a gateway. Tries mainnet then goerli */
const loadRequest = async (
  requestId: string,
  network?: string | number
): Promise<{ network: string; request: Request } | null> => {
  if (!network) {
    return (
      (await loadRequest(requestId, 'xdai')) ||
      (await loadRequest(requestId, 'mainnet')) ||
      (await loadRequest(requestId, 'goerli'))
    );
  }
  network = chainIdToName(network);
  try {
    const rn = getRequestClient(network);
    return {
      network,
      request: await rn.fromRequestId(requestId),
    };
  } catch (error) {
    return null;
  }
};

/** Loads the request and converts the amount to counter currency */
export const RequestProvider = ({ children, chainId }: any) => {
  const { currencyManager } = useCurrency();

  const [id, setId] = useState<string | null>(null);

  const { query } = useRouter();
  // const { id } = query;

  useEffect(() => {
    if (query.id) {
      setId(query.id as string);
    }
  }, [query]);

  const [loading, setLoading] = useState(true);
  const [parsedRequest, setParsedRequest] = useState<IParsedRequest>();
  const counterCurrency = currencyManager.from('USD')!;
  const [counterValue, setCounterValue] = useState<string>('');
  const [pending, setPending] = useState(false);

  // gets counter currency rate
  const rate = useRate(parsedRequest?.currency, counterCurrency);

  useEffect(() => {
    setLoading(true);
    setParsedRequest(undefined);
  }, [chainId]);

  const fetchRequest = async (
    txId: string | undefined,
    txChainId: string | number | undefined,
    isPending: boolean
  ) => {
    if (!txId) {
      return;
    }
    const result = await loadRequest(txId, txChainId);
    if (result) {
      const parseResult = await parseRequest({
        requestId: result.request.requestId,
        data: result.request.getData() as any,
        network: result.network,
        pending: isPending,
        currencyManager,
      });
      parseResult.loaded = true;
      setParsedRequest(parseResult);
    }
  };

  // load request and handle pending state change.
  useEffect(() => {
    if (!pending) {
      setLoading(true);
    }
    fetchRequest(id as string, chainId, pending).finally(() =>
      setLoading(false)
    );
  }, [id, pending, chainId]);

  // handle rate conversion
  useEffect(() => {
    if (rate && parsedRequest?.amount)
      setCounterValue((rate * parsedRequest.amount).toFixed(2));
    else {
      setCounterValue('');
    }
  }, [rate, parsedRequest]);

  return (
    <RequestContext.Provider
      value={{
        loading,
        request: parsedRequest,
        counterCurrency,
        counterValue,
        setPending,
        update: useCallback(
          () => fetchRequest(id as string, chainId, pending),
          [id, chainId, pending]
        ),
        setId,
      }}
    >
      {children}
    </RequestContext.Provider>
  );
};

/** Utility to use the Request context */
export const useRequest = () => {
  const context = React.useContext(RequestContext);
  if (!context) {
    throw new Error('This hook must be used inside a RequestProvider');
  }
  return context;
};
