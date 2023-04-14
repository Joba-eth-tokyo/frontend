import { RequestLogicTypes } from '@requestnetwork/types';
import type { AbstractConnector } from '@web3-react/abstract-connector';
import { InjectedConnector } from '@web3-react/injected-connector';
import type { IParsedRequest } from 'request-shared';
import { chainInfos } from 'request-shared';

/** Get available connectors based on request type and network. */
export const getConnectors = (
  request: IParsedRequest
): Record<string, AbstractConnector> => {
  if (
    !(
      request.currencyType === RequestLogicTypes.CURRENCY.ETH ||
      request.currencyType === RequestLogicTypes.CURRENCY.ERC20
    )
  ) {
    return {};
  }

  return {
    injected: new InjectedConnector({
      supportedChainIds: [
        chainInfos[request.currencyNetwork || '']?.chainId,
      ] as any,
    }),
  };
};
