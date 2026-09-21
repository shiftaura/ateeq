import api, { isMockMode } from './api';
import { mockNotifications } from '../mock/notifications';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const getStoredNotifications = () => {
  const stored = localStorage.getItem('mediconsult_notifications');
  if (!stored) {
    localStorage.setItem('mediconsult_notifications', JSON.stringify(mockNotifications));
    return mockNotifications;
  }
  return JSON.parse(stored);
};

export const notificationService = {
  getNotifications: async () => {
    if (isMockMode) {
      await delay(200);
      return getStoredNotifications();
    }

    const response = await api.get('/notifications');
    return response.data;
  },

  markAsRead: async (id) => {
    if (isMockMode) {
      await delay(150);
      const list = getStoredNotifications();
      const updated = list.map((n) => (n.id === id ? { ...n, isRead: true } : n));
      localStorage.setItem('mediconsult_notifications', JSON.stringify(updated));
      return { success: true };
    }

    const response = await api.patch(`/notifications/${id}/read`);
    return response.data;
  },

  markAllAsRead: async () => {
    if (isMockMode) {
      await delay(200);
      const list = getStoredNotifications();
      const updated = list.map((n) => ({ ...n, isRead: true }));
      localStorage.setItem('mediconsult_notifications', JSON.stringify(updated));
      return { success: true };
    }

    const response = await api.patch('/notifications/read-all');
    return response.data;
  }
};

export default notificationService;
