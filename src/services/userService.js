import api, { isMockMode } from './api';
import { mockAppointments } from '../mock/appointments';
import { mockSymptomResults } from '../mock/symptoms';
import { mockNotifications } from '../mock/notifications';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const userService = {
  getProfile: async () => {
    if (isMockMode) {
      await delay(250);
      const stored = localStorage.getItem('mediconsult_user');
      if (!stored) {
        throw new Error('User not authenticated');
      }
      return JSON.parse(stored);
    }
    const response = await api.get('/users/profile');
    return response.data?.data || response.data;
  },

  updateProfile: async (profileData) => {
    if (isMockMode) {
      await delay(350);
      const stored = localStorage.getItem('mediconsult_user');
      if (!stored) {
        throw new Error('User not authenticated');
      }
      const current = JSON.parse(stored);
      const updated = { ...current, ...profileData };
      localStorage.setItem('mediconsult_user', JSON.stringify(updated));
      return updated;
    }
    const response = await api.put('/users/profile', profileData);
    return response.data?.data || response.data;
  },

  getDashboardData: async () => {
    if (isMockMode) {
      await delay(300);
      const upcomingApt = mockAppointments.find((a) => a.status === 'upcoming');
      const recentSymptomCheck = mockSymptomResults[0] || null;
      const unreadNotificationsCount = mockNotifications.filter((n) => !n.isRead).length;

      return {
        upcomingAppointment: upcomingApt || null,
        recentSymptomCheck: recentSymptomCheck,
        unreadNotificationsCount,
        stats: {
          totalConsultations: 3,
          symptomAssessments: 2,
          activeReminders: 1
        }
      };
    }
    const response = await api.get('/users/dashboard');
    return response.data?.data || response.data;
  }
};

export default userService;
