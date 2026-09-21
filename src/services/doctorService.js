import api, { isMockMode } from './api';
import { mockDoctors } from '../mock/doctors';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const doctorService = {
  getDoctors: async (params = {}) => {
    if (isMockMode) {
      await delay(300);
      let list = [...mockDoctors];

      if (params.search) {
        const query = params.search.toLowerCase();
        list = list.filter(
          (d) =>
            d.name.toLowerCase().includes(query) ||
            d.specialization.toLowerCase().includes(query) ||
            d.hospital.toLowerCase().includes(query)
        );
      }

      if (params.specialization && params.specialization !== 'All') {
        list = list.filter(
          (d) => d.specialization.toLowerCase() === params.specialization.toLowerCase()
        );
      }

      if (params.availability && params.availability !== 'All') {
        list = list.filter((d) =>
          d.availability.toLowerCase().includes(params.availability.toLowerCase())
        );
      }

      return list;
    }

    const response = await api.get('/doctors', { params });
    return response.data;
  },

  getDoctorById: async (id) => {
    if (isMockMode) {
      await delay(250);
      const doctor = mockDoctors.find((d) => d.id === id);
      if (!doctor) {
        throw new Error('Doctor not found');
      }
      return doctor;
    }

    const response = await api.get(`/doctors/${id}`);
    return response.data;
  },

  getDoctorSlots: async (id, date) => {
    if (isMockMode) {
      await delay(200);
      const doctor = mockDoctors.find((d) => d.id === id);
      if (!doctor) throw new Error('Doctor not found');
      return {
        date: date || doctor.availableDates[0],
        slots: doctor.timeSlots,
      };
    }

    const response = await api.get(`/doctors/${id}/slots`, { params: { date } });
    return response.data;
  }
};

export default doctorService;
