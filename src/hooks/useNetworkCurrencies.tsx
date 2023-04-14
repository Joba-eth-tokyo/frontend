import { useMemo } from 'react';
import { chainInfos, useCurrency } from 'request-shared';

const useNetworkCurrencies = () => {
  const { currencyList } = useCurrency();
  const allowedNetworkType = ['ERC20'];
  const allowedNetwork = ['mainnet', 'goerli', 'matic'];

  return useMemo(() => {
    if (!currencyList?.length) return [];

    return currencyList
      .filter(
        (currency: any) =>
          allowedNetwork.includes(currency.network) &&
          allowedNetworkType.includes(currency.type)
      )
      .map((curr: any) => ({
        ...curr,
        chainId: chainInfos[curr.network]?.chainId,
      }));
  }, [currencyList]);
};

export default useNetworkCurrencies;
