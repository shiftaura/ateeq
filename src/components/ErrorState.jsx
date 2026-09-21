import React from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from './Button';

const ErrorState = ({
  title = 'Service Currently Unavailable',
  message = 'We are unable to connect to the healthcare service at this moment. Please verify your connection or try again shortly.',
  onRetry,
  showHomeLink = true,
  className = ''
}) => {
  return (
    <div
      role="alert"
      className={`flex flex-col items-center justify-center py-14 px-4 text-center bg-white rounded-2xl border border-red-200/80 p-8 ${className}`}
    >
      <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center mb-4 text-danger">
        <AlertCircle className="w-7 h-7" />
      </div>

      <h3 className="text-base font-semibold text-text-primary mb-1.5">
        {title}
      </h3>

      <p className="text-xs sm:text-sm text-text-secondary max-w-md mb-6 leading-relaxed">
        {message}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        {onRetry && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            icon={RefreshCw}
          >
            Try Again
          </Button>
        )}

        {showHomeLink && (
          <Link to="/dashboard">
            <Button variant="secondary" size="sm" icon={Home}>
              Return to Dashboard
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default ErrorState;
