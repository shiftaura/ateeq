import React, { useState, useEffect } from 'react';
import { Bell, CheckCheck, Filter } from 'lucide-react';
import notificationService from '../../services/notificationService';
import NotificationItem from '../../components/NotificationItem';
import Button from '../../components/Button';
import LoadingState from '../../components/LoadingState';
import EmptyState from '../../components/EmptyState';
import ErrorState from '../../components/ErrorState';
import { useToast } from '../../context/ToastContext';

const NotificationsPage = () => {
  const { showToast } = useToast();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All'); // 'All' | 'Appointments' | 'Health' | 'System'

  const fetchNotifications = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await notificationService.getNotifications();
      setNotifications(data);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError(err.message || 'Unable to retrieve notifications.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      showToast('Unable to update notification status.', 'error');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      showToast('All notifications marked as read.', 'success');
    } catch (err) {
      showToast('Unable to update notifications.', 'error');
    }
  };

  const filteredNotifications = notifications.filter((n) => {
    if (selectedCategory === 'All') return true;
    return n.category === selectedCategory;
  });

  const unreadTotal = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <span className="text-xs font-semibold text-primary uppercase tracking-wider block mb-1">
            Activity Alerts
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
            Notifications
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Stay updated with appointment schedules, guidance logs, and portal reminders.
          </p>
        </div>

        {unreadTotal > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleMarkAllAsRead}
            icon={CheckCheck}
          >
            Mark All as Read ({unreadTotal})
          </Button>
        )}
      </div>

      {/* Categories Bar */}
      <div className="flex flex-wrap items-center gap-2 border-b border-border pb-4">
        {['All', 'Appointments', 'Health', 'System'].map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                isSelected
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-white border border-border text-text-secondary hover:border-slate-300 hover:text-text-primary'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Notifications List */}
      <div>
        {loading ? (
          <LoadingState message="Loading your notifications..." description="Retrieving recent activity logs." />
        ) : error ? (
          <ErrorState message={error} onRetry={fetchNotifications} />
        ) : filteredNotifications.length === 0 ? (
          <EmptyState
            icon={Bell}
            title="No notifications"
            description={
              selectedCategory === 'All'
                ? 'You are completely caught up! No recent alerts found.'
                : `No notifications under the "${selectedCategory}" category.`
            }
          />
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map((notif) => (
              <NotificationItem
                key={notif.id}
                notification={notif}
                onMarkAsRead={handleMarkAsRead}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
