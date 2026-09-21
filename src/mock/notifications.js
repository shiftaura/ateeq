// Mock Notifications Data for Demo Mode
export const mockNotifications = [
  {
    id: 'notif_001',
    category: 'Appointments', // 'Appointments' | 'Health' | 'System'
    title: 'Upcoming Consultation Reminder',
    message: 'Your appointment with Dr. Michael Chen is scheduled for Sep 24, 2026 at 10:30 AM.',
    timeAgo: '2 hours ago',
    timestamp: '2026-09-21T08:30:00Z',
    isRead: false,
    link: '/appointments/apt_101'
  },
  {
    id: 'notif_002',
    category: 'Health',
    title: 'Symptom Assessment Saved',
    message: 'Your recent check for Fever & Sore throat was saved to your medical history.',
    timeAgo: '5 hours ago',
    timestamp: '2026-09-21T05:30:00Z',
    isRead: false,
    link: '/medical-history/hist_001'
  },
  {
    id: 'notif_003',
    category: 'Appointments',
    title: 'Appointment Confirmed',
    message: 'Dr. Elena Rostova confirmed your appointment on Sep 28, 2026 at 02:30 PM.',
    timeAgo: '1 day ago',
    timestamp: '2026-09-20T11:25:00Z',
    isRead: true,
    link: '/appointments/apt_102'
  },
  {
    id: 'notif_004',
    category: 'System',
    title: 'Account Security Notice',
    message: 'Your profile details were updated successfully.',
    timeAgo: '3 days ago',
    timestamp: '2026-09-18T09:15:00Z',
    isRead: true,
    link: '/profile'
  }
];
