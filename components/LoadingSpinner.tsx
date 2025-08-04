
import React from 'react';

interface LoadingSpinnerProps {
    large?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ large = false }) => {
  const sizeClasses = large ? 'h-10 w-10' : 'h-5 w-5';
  return (
    <div className="flex justify-center items-center">
      <div className={`${sizeClasses} animate-spin rounded-full border-4 border-solid border-purple-400 border-t-transparent`}></div>
      {large && <span className="ml-4 text-xl text-purple-300">Connecting with the cosmos...</span>}
    </div>
  );
};

export default LoadingSpinner;
