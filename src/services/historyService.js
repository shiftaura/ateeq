import api, { isMockMode } from './api';
import { mockMedicalHistory } from '../mock/medicalHistory';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const getStoredHistory = () => {
  const stored = localStorage.getItem('mediconsult_medical_history');
  if (!stored) {
    localStorage.setItem('mediconsult_medical_history', JSON.stringify(mockMedicalHistory));
    return mockMedicalHistory;
  }
  return JSON.parse(stored);
};

export const historyService = {
  getMedicalHistory: async (params = {}) => {
    if (isMockMode) {
      await delay(250);
      let list = getStoredHistory();

      if (params.search) {
        const query = params.search.toLowerCase();
        list = list.filter(
          (h) =>
            h.title.toLowerCase().includes(query) ||
            h.symptoms.some((s) => s.toLowerCase().includes(query)) ||
            (h.doctorConsultation && h.doctorConsultation.toLowerCase().includes(query))
        );
      }

      if (params.urgency && params.urgency !== 'All') {
        list = list.filter((h) => h.urgency === params.urgency);
      }

      return list;
    }

    const response = await api.get('/medical-history', { params });
    return response.data;
  },

  getHistoryDetail: async (id) => {
    if (isMockMode) {
      await delay(200);
      const list = getStoredHistory();
      const record = list.find((h) => h.id === id);
      if (!record) throw new Error('Medical history record not found');
      return record;
    }

    const response = await api.get(`/medical-history/${id}`);
    return response.data;
  },

  addRecord: async (recordData) => {
    if (isMockMode) {
      await delay(300);
      const newRecord = {
        id: 'hist_' + Date.now(),
        date: new Date().toISOString().split('T')[0],
        ...recordData
      };
      const current = getStoredHistory();
      const updated = [newRecord, ...current];
      localStorage.setItem('mediconsult_medical_history', JSON.stringify(updated));
      return newRecord;
    }
    const response = await api.post('/medical-history', recordData);
    return response.data;
  }
};

export default historyService;
