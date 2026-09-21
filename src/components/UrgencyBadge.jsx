import React from 'react';
import { AlertCircle, AlertTriangle, ShieldCheck } from 'lucide-react';

const UrgencyBadge = ({ level = 'MODERATE', size = 'md', className = '' }) => {
  const normalized = (level || 'MODERATE').toUpperCase();

  const configs = {
    LOW: {
      label: 'Low Urgency',
      bg: 'bg-green-50 border-green-200 text-green-800',
      icon: ShieldCheck,
      iconColor: 'text-success',
    },
    MODERATE: {
      label: 'Moderate Urgency',
      bg: 'bg-amber-50 border-amber-200 text-amber-900',
      icon: AlertTriangle,
      iconColor: 'text-warning',
    },
    HIGH: {
      label: 'Urgent Attention Needed',
      bg: 'bg-red-50 border-red-200 text-red-900',
      icon: AlertCircle,
      iconColor: 'text-danger',
    },
    URGENT: {
      label: 'Urgent Attention Needed',
      bg: 'bg-red-50 border-red-200 text-red-900',
      icon: AlertCircle,
      iconColor: 'text-danger',
    },
  };

  const current = configs[normalized] || configs.MODERATE;
  const Icon = current.icon;

  const sizeClasses = size === 'lg' 
    ? 'px-3.5 py-1.5 text-sm gap-2' 
    : 'px-2.5 py-1 text-xs gap-1.5';

  return (
    <span
      className={`inline-flex items-center font-semibold rounded-full border ${current.bg} ${sizeClasses} ${className}`}
      role="status"
      aria-label={`Urgency level: ${current.label}`}
    >
      <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${current.iconColor}`} />
      <span>{current.label}</span>
    </span>
  );
};

export default UrgencyBadge;
