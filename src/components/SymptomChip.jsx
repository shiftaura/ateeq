import React from 'react';
import { Check, Plus } from 'lucide-react';

const SymptomChip = ({
  label,
  selected = false,
  onToggle,
  disabled = false,
  className = ''
}) => {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={selected}
      disabled={disabled}
      onClick={() => onToggle && onToggle(label)}
      className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-150 border cursor-pointer select-none
        ${selected
          ? 'bg-blue-50 border-primary text-primary shadow-subtle ring-1 ring-primary'
          : 'bg-white border-border text-text-secondary hover:border-slate-300 hover:text-text-primary hover:bg-slate-50'
        }
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
    >
      {selected ? (
        <Check className="w-3.5 h-3.5 text-primary flex-shrink-0" />
      ) : (
        <Plus className="w-3.5 h-3.5 text-text-muted flex-shrink-0" />
      )}
      <span>{label}</span>
    </button>
  );
};

export default SymptomChip;
