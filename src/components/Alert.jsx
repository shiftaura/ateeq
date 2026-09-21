import React from 'react';
import { Info, CheckCircle2, AlertTriangle, AlertCircle, X } from 'lucide-react';

const Alert = ({
  type = 'info', // 'info' | 'success' | 'warning' | 'danger'
  title,
  children,
  onDismiss,
  className = ''
}) => {
  const styles = {
    info: {
      container: 'bg-blue-50 border-blue-200 text-blue-900',
      icon: <Info className="w-5 h-5 text-primary flex-shrink-0" />,
    },
    success: {
      container: 'bg-green-50 border-green-200 text-green-900',
      icon: <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />,
    },
    warning: {
      container: 'bg-amber-50 border-amber-200 text-amber-900',
      icon: <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0" />,
    },
    danger: {
      container: 'bg-red-50 border-red-200 text-red-900',
      icon: <AlertCircle className="w-5 h-5 text-danger flex-shrink-0" />,
    },
  };

  const current = styles[type] || styles.info;

  return (
    <div
      role="alert"
      className={`flex items-start gap-3 p-4 rounded-xl border ${current.container} ${className}`}
    >
      <div className="mt-0.5">{current.icon}</div>
      <div className="flex-1 text-sm">
        {title && <h4 className="font-semibold mb-0.5">{title}</h4>}
        <div className="leading-relaxed opacity-95">{children}</div>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-slate-400 hover:text-slate-600 p-1 rounded transition-colors"
          aria-label="Dismiss alert"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default Alert;
