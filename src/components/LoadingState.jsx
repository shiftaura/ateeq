import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingState = ({
  message = 'Loading details...',
  description = 'Please wait while we retrieve the latest healthcare records.',
  className = ''
}) => {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex flex-col items-center justify-center py-16 px-4 text-center ${className}`}
    >
      <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center mb-4 text-primary shadow-subtle">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
      <h3 className="text-base font-semibold text-text-primary mb-1">
        {message}
      </h3>
      {description && (
        <p className="text-xs sm:text-sm text-text-secondary max-w-sm">
          {description}
        </p>
      )}
    </div>
  );
};

export default LoadingState;
