import React from 'react';
import { Link } from 'react-router-dom';
import { Inbox } from 'lucide-react';
import Button from './Button';

const EmptyState = ({
  icon: Icon = Inbox,
  title = 'No records found',
  description = 'There are no entries available for your current selection.',
  actionLabel,
  actionLink,
  onAction,
  className = ''
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center py-14 px-4 text-center bg-white rounded-2xl border border-border/80 p-8 ${className}`}
    >
      <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center mb-4 text-text-muted">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-base font-semibold text-text-primary mb-1.5">
        {title}
      </h3>
      <p className="text-xs sm:text-sm text-text-secondary max-w-sm mb-6 leading-relaxed">
        {description}
      </p>

      {actionLabel && (
        actionLink ? (
          <Link to={actionLink}>
            <Button variant="primary" size="sm">
              {actionLabel}
            </Button>
          </Link>
        ) : (
          <Button variant="primary" size="sm" onClick={onAction}>
            {actionLabel}
          </Button>
        )
      )}
    </div>
  );
};

export default EmptyState;
