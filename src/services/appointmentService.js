import api, { isMockMode } from './api';
import { mockAppointments } from '../mock/appointments';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const getStoredAppointments = () => {
  const stored = localStorage.getItem('mediconsult_appointments');
  if (!stored) {
    localStorage.setItem('mediconsult_appointments', JSON.stringify(mockAppointments));
    return mockAppointments;
  }
  return JSON.parse(stored);
};

export const appointmentService = {
  getAppointments: async (statusFilter) => {
    if (isMockMode) {
      await delay(300);
      let list = getStoredAppointments();
      if (statusFilter && statusFilter !== 'all') {
        list = list.filter((a) => a.status === statusFilter);
      }
      return list;
    }

    const response = await api.get('/appointments', { params: { status: statusFilter } });
    return response.data;
  },

  getAppointmentById: async (id) => {
    if (isMockMode) {
      await delay(200);
      const list = getStoredAppointments();
      const appointment = list.find((a) => a.id === id);
      if (!appointment) throw new Error('Appointment not found');
      return appointment;
    }

    const response = await api.get(`/appointments/${id}`);
    return response.data;
  },

  bookAppointment: async (bookingData) => {
    if (isMockMode) {
      await delay(450);
      const newApt = {
        id: 'apt_' + Date.now(),
        doctorId: bookingData.doctorId,
        doctorName: bookingData.doctorName,
        doctorAvatar: bookingData.doctorAvatar || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=256',
        specialization: bookingData.specialization,
        date: bookingData.date,
        time: bookingData.time,
        status: 'upcoming',
        patientName: bookingData.patientName,
        patientEmail: bookingData.patientEmail,
        patientPhone: bookingData.patientPhone || '',
        reason: bookingData.reason,
        hospital: bookingData.hospital || 'Medical Consultation Center',
        clinicAddress: bookingData.clinicAddress || 'Healthcare District Plaza',
        fee: bookingData.fee || '$60',
        createdAt: new Date().toISOString()
      };

      const current = getStoredAppointments();
      const updated = [newApt, ...current];
      localStorage.setItem('mediconsult_appointments', JSON.stringify(updated));
      return newApt;
    }

    const response = await api.post('/appointments', bookingData);
    return response.data;
  },

  cancelAppointment: async (id, cancellationReason = 'Cancelled by patient') => {
    if (isMockMode) {
      await delay(300);
      const current = getStoredAppointments();
      const index = current.findIndex((a) => a.id === id);
      if (index === -1) throw new Error('Appointment not found');

      current[index] = {
        ...current[index],
        status: 'cancelled',
        cancellationReason
      };
      localStorage.setItem('mediconsult_appointments', JSON.stringify(current));
      return current[index];
    }

    const response = await api.patch(`/appointments/${id}/cancel`, { cancellationReason });
    return response.data;
  },

  rescheduleAppointment: async (id, { date, time }) => {
    if (isMockMode) {
      await delay(300);
      const current = getStoredAppointments();
      const index = current.findIndex((a) => a.id === id);
      if (index === -1) throw new Error('Appointment not found');

      current[index] = {
        ...current[index],
        date,
        time,
        status: 'upcoming'
      };
      localStorage.setItem('mediconsult_appointments', JSON.stringify(current));
      return current[index];
    }

    const response = await api.patch(`/appointments/${id}/reschedule`, { date, time });
    return response.data;
  }
};

export default appointmentService;
