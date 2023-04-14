import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { twMerge } from 'tailwind-merge';

interface NavLinkProps {
  path: string;
  title: string;
  Icon: any;
}

const NavLink: React.FC<NavLinkProps> = ({ path, title, Icon }) => {
  const router = useRouter();
  const isActiveTab = router.pathname === path;
  return (
    <Link
      href={path}
      className={twMerge(
        'flex items-center group gap-4 rounded-lg font-medium text-gray-50 hover:bg-brandBlack-100 hover:text-yellow-200 transition-all duration-300  ease-in-out px-5 py-3',
        isActiveTab ? 'bg-brandBlack-100 text-yellow-200' : ''
      )}
    >
      <Icon
        className={twMerge(
          'transition-all duration-300  ease-in-out stroke-gray-50 group-hover:stroke-yellow-200',
          isActiveTab ? 'stroke-yellow-200' : ''
        )}
      />
      <p className="text-sm leading-4 text-inherit">{title}</p>
    </Link>
  );
};

export default NavLink;
