// Mock User Configuration for Demo / Development Mode
export const DEMO_CREDENTIALS = {
  email: 'demo@mediconsult.com',
  password: 'Demo@123'
};

export const defaultMockUsers = [
  {
    id: 'usr_demo_001',
    name: 'Sarah Jenkins',
    email: 'demo@mediconsult.com',
    password: 'Demo@123',
    dateOfBirth: '1996-05-14',
    gender: 'Female',
    phone: '+1 (555) 234-5678',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=256',
    bloodGroup: 'O+',
    emergencyContact: '+1 (555) 987-6543'
  }
];

// Helper to access and persist mock users store
export const getStoredMockUsers = () => {
  const stored = localStorage.getItem('mediconsult_mock_users');
  if (!stored) {
    localStorage.setItem('mediconsult_mock_users', JSON.stringify(defaultMockUsers));
    return defaultMockUsers;
  }
  try {
    const parsed = JSON.parse(stored);
    // Ensure demo user is always present
    if (!parsed.some(u => u.email.toLowerCase() === DEMO_CREDENTIALS.email.toLowerCase())) {
      parsed.push(defaultMockUsers[0]);
      localStorage.setItem('mediconsult_mock_users', JSON.stringify(parsed));
    }
    return parsed;
  } catch (e) {
    return defaultMockUsers;
  }
};

// Helper to save a newly registered mock user
export const saveMockUser = (newUser) => {
  const current = getStoredMockUsers();
  const updated = [...current, newUser];
  localStorage.setItem('mediconsult_mock_users', JSON.stringify(updated));
  return newUser;
};
