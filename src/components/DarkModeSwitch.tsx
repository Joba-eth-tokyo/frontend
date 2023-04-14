import React from 'react';

import { Theme, useTheme } from '@/context/ThemeProvider';

import { LoaderIcon, SunIcon } from './icons';

const DarkModeSwitch = () => {
  const { theme, handleUpdateTheme } = useTheme();

  return (
    <div
      className="cursor-pointer select-none"
      onClick={() =>
        handleUpdateTheme(theme === Theme.DARK ? Theme.LIGHT : Theme.DARK)
      }
    >
      {theme === Theme.DARK ? (
        <SunIcon className="stroke-white" />
      ) : (
        <LoaderIcon className="stroke-white md:stroke-base-100" />
      )}
    </div>
  );
};

export default DarkModeSwitch;
