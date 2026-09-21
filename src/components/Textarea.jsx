import React, { forwardRef } from 'react';

const Textarea = forwardRef(({
  label,
  id,
  rows = 4,
  error,
  helperText,
  className = '',
  required = false,
  ...props
}, ref) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-text-primary mb-1.5"
        >
          {label}
          {required && <span className="text-danger ml-1" aria-hidden="true">*</span>}
        </label>
      )}

      <textarea
        ref={ref}
        id={inputId}
        rows={rows}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
        className={`w-full text-sm rounded-lg border transition-colors duration-150 p-3 
          ${error
            ? 'border-danger focus:border-danger focus:ring-1 focus:ring-danger text-text-primary'
            : 'border-border hover:border-slate-300 focus:border-primary focus:ring-1 focus:ring-primary text-text-primary'
          }
          bg-white placeholder:text-slate-400 focus:outline-none disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed
          ${className}
        `}
        {...props}
      />

      {error && (
        <p id={`${inputId}-error`} className="mt-1 text-xs text-danger font-medium">
          {error}
        </p>
      )}

      {helperText && !error && (
        <p id={`${inputId}-helper`} className="mt-1 text-xs text-text-secondary">
          {helperText}
        </p>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';

export default Textarea;
