import dynamic from 'next/dynamic';
import Link from 'next/link';
import React from 'react';
import { twMerge } from 'tailwind-merge';

import Logo from '@/components/Logo';

import Container from './Container';
// import WalletConnectButton from './WalletConnectButton';

const WalletConnectButton = dynamic(() => import('./WalletConnectButton'), {
  ssr: false,
});

interface IHeader {
  className?: string;
}

const Header: React.FC<IHeader> = ({ className = '' }) => {
  return (
    <header
      className={twMerge(
        'flex h-20 items-center bg-yellow-50 md:h-[90px] dark:bg-primary-500',
        className
      )}
    >
      <Container>
        <div className="flex items-center justify-between gap-2">
          <Link href="/" passHref>
            <Logo unqiueId="home_logo" className="dark:fill-white" />
          </Link>

          <WalletConnectButton />
        </div>
      </Container>
    </header>
  );
};

export default Header;
