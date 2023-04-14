import '../styles/global.css';

import { Web3ReactProvider } from '@web3-react/core';
import { providers } from 'ethers';
import Cookies from 'js-cookie';
import type { AppProps } from 'next/app';
import { CurrencyProvider, getCurrencies } from 'request-shared';

import ToastContainer from '@/components/Toast/ToastContainer';
import { AuthProvider } from '@/context/auth';
import { ConnectorProvider } from '@/context/ConnectorContext';
import { PaymentProvider } from '@/context/PaymentContext';
import { RequestProvider } from '@/context/RequestContext';
import { SignMessageModalProvider } from '@/context/signMessageContext';
import { isTheme, ThemeProvider } from '@/context/ThemeProvider';
import { ToastProvider } from '@/context/Toast';
import WagmiProvider from '@/hoc/Wagmi';

const MyApp = ({ Component, pageProps }: AppProps) => {
  const theme = Cookies.get('theme');
  const specifiedTheme = isTheme(theme) ? theme : null;
  return (
    <ToastProvider>
      <WagmiProvider>
        <AuthProvider>
          <SignMessageModalProvider>
            <CurrencyProvider currencies={getCurrencies()}>
              <RequestProvider>
                <Web3ReactProvider
                  getLibrary={(provider) =>
                    new providers.Web3Provider(provider)
                  }
                >
                  <ConnectorProvider>
                    <PaymentProvider>
                      <ToastContainer variant="topRight" />
                      <ThemeProvider specifiedTheme={specifiedTheme}>
                        <Component {...pageProps} />
                      </ThemeProvider>
                    </PaymentProvider>
                  </ConnectorProvider>
                </Web3ReactProvider>
              </RequestProvider>
            </CurrencyProvider>
          </SignMessageModalProvider>
        </AuthProvider>
      </WagmiProvider>
    </ToastProvider>
  );
};

export default MyApp;
