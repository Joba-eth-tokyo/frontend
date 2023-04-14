import type { AbstractConnector } from '@web3-react/abstract-connector';
import { useWeb3React } from '@web3-react/core';
import { useEffect, useState } from 'react';
import type { IParsedRequest } from 'request-shared';

import { getConnectors } from '@/utils/connectors';

const isAuthorized = async () => {
  if (!window.ethereum) {
    return false;
  }

  try {
    if (typeof window !== 'undefined') {
      const result = await new Promise<any>((resolve, reject) =>
        // eslint-disable-next-line no-promise-executor-return
        (window.ethereum as any)!.sendAsync(
          { method: 'eth_accounts' },
          (err: any, results: any) => {
            if (err) {
              reject(err);
            } else {
              resolve(results);
            }
          }
        )
      );
      if (result?.result?.length > 0) {
        return true;
      }
      return false;
    }
    return false;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export function useEagerConnect(request?: IParsedRequest) {
  const [connector, setConnector] = useState<AbstractConnector>();
  const { activate, active, error, setError } = useWeb3React();

  const [tried, setTried] = useState(false);

  useEffect(() => {
    if (request) {
      setConnector(getConnectors(request).injected);
    }
  }, [request]);

  useEffect(() => {
    if (connector) {
      isAuthorized().then((authorized) => {
        if (authorized) {
          activate(connector, undefined, true).catch((e) => {
            setError(e);
            setTried(true);
          });
        } else {
          setTried(true);
        }
      });
    }
  }, [connector, activate, setError]); // intentionally only running on mount (make sure it's only mounted once :))

  // if the connection worked, wait until we get confirmation of that to flip the flag
  useEffect(() => {
    if (!tried && active) {
      setTried(true);
    }
  }, [tried, active]);

  useEffect((): any => {
    if (!connector) return;
    const { ethereum } = window as any;

    if (ethereum && ethereum.on) {
      const handleConnect = () => {
        activate(connector);
        setError(null as any);
      };
      const handleChainChanged = () => {
        activate(connector);
        setError(null as any);
      };
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length > 0) {
          activate(connector);
          setError(null as any);
        }
      };

      ethereum.on('connect', handleConnect);
      ethereum.on('chainChanged', handleChainChanged);
      ethereum.on('accountsChanged', handleAccountsChanged);
    }
  }, [active, error, tried, activate, setError, connector]);
}
