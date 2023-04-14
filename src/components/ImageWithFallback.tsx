import * as React from 'react';
import { twMerge } from 'tailwind-merge';

export interface ImageWithFallbackProps {
  className?: string;
  src?: string;
  fallbackSrc?: string;
  alt: string;
}

export function ImageWithFallback({
  className,
  src,
  fallbackSrc = '/assets/images/user.png',
  alt,
  ...rest
}: React.HTMLAttributes<HTMLImageElement> & ImageWithFallbackProps) {
  const [currentSrc, setCurrentSrc] = React.useState(src);
  const onError = ({ currentTarget }: React.SyntheticEvent) => {
    // eslint-disable-next-line no-param-reassign
    (currentTarget as HTMLImageElement).onerror = null;
    setCurrentSrc(fallbackSrc);
  };

  return (
    <img
      className={twMerge(`object-cover ${className}`)}
      src={currentSrc}
      onError={onError}
      alt={alt}
      {...rest}
    />
  );
}
