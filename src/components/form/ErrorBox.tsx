import React from 'react';

const ErrorBox = ({ error }: { error: string }) => {
  return (
    <div className="mt-1 text-sm font-medium text-brandRed-200">{error}</div>
  );
};

export default ErrorBox;
