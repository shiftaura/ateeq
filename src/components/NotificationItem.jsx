import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, HeartPulse, Bell, Check, ExternalLink } from 'lucide-react';

const NotificationItem = ({ notification, onMarkAsRead, className = '' }) => {
  if (!notification) return null;

  const categoryIcons = {
    Appointments: { icon: Calendar, color: 'text-primary bg-blue-50 border-blue-100' },
    Health: { icon: HeartPulse, color: 'text-teal bg-teal-50 border-teal-100' },
    System: { icon: Bell, color: 'text-amber-600 bg-amber-50 border-amber-100' },
  };

  const currentCategory = categoryIcons[notification.category] || categoryIcons.System;
  const Icon = currentCategory.icon;

  return (
    <div
      className={`p-4 sm:p-5 rounded-xl border transition-all duration-150 flex items-start gap-4 ${
        notification.isRead
          ? 'bg-white border-border'
          : 'bg-blue-50/40 border-blue-200 shadow-subtle'
      } ${className}`}
    >
      <div className={`p-2.5 rounded-xl border flex-shrink-0 ${currentCategory.color}`}>
        <Icon className="w-5 h-5" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold text-text-primary">
              {notification.title}
            </h4>
            {!notification.isRead && (
              <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" title="Unread" />
            )}
          </div>
          <span className="text-xs text-text-muted whitespace-nowrap">
            {notification.timeAgo}
          </span>
        </div>

        <p className="text-xs sm:text-sm text-text-secondary leading-relaxed mb-3">
          {notification.message}
        </p>

        <div className="flex items-center gap-3">
          {notification.link && (
            <Link
              to={notification.link}
              className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary-dark transition-colors"
            >
              <span>View Details</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          )}

          {!notification.isRead && onMarkAsRead && (
            <button
              onClick={() => onMarkAsRead(notification.id)}
              className="inline-flex items-center gap-1 text-xs text-text-muted hover:text-text-primary transition-colors cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Mark as read</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;
