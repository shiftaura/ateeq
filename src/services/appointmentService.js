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

export const normalizeAppointment = (apt) => {
  if (!apt) return null;
  const id = apt._id ? apt._id.toString() : (apt.id || '');
  const doctor = typeof apt.doctor === 'object' && apt.doctor !== null ? apt.doctor : {};

  return {
    ...apt,
    id,
    _id: apt._id || id,
    doctorId: doctor._id ? doctor._id.toString() : (doctor.id || apt.doctorId || ''),
    doctorName: doctor.name || apt.doctorName || 'Doctor',
    doctorAvatar: doctor.profileImage || doctor.avatar || apt.doctorAvatar || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=256',
    specialization: doctor.specialization || apt.specialization || 'General Specialist',
    hospital: doctor.clinic?.name || apt.hospital || 'MediConsult Partner Clinic',
    clinicAddress: apt.clinicAddress || (doctor.clinic ? [doctor.clinic.address, doctor.clinic.city].filter(Boolean).join(', ') : 'Metropolis Health Center'),
    fee: apt.fee || '$60',
  };
};

export const appointmentService = {
  getAppointments: async (statusFilter) => {
    if (isMockMode) {
      await delay(300);
      let list = getStoredAppointments();
      if (statusFilter && statusFilter !== 'all') {
        list = list.filter((a) => a.status === statusFilter);
      }
      return list.map(normalizeAppointment);
    }

    const params = {};
    if (statusFilter && statusFilter !== 'all') {
      params.status = statusFilter;
    }

    const response = await api.get('/appointments', { params });
    console.log("[APPOINTMENTS API RESPONSE]", response.data);

    let rawList = [];
    if (response.data) {
      if (Array.isArray(response.data.data?.appointments)) {
        rawList = response.data.data.appointments;
      } else if (Array.isArray(response.data.data)) {
        rawList = response.data.data;
      } else if (Array.isArray(response.data.appointments)) {
        rawList = response.data.appointments;
      } else if (Array.isArray(response.data)) {
        rawList = response.data;
      }
    }

    return rawList.map(normalizeAppointment);
  },

  getAppointmentById: async (id) => {
    if (isMockMode) {
      await delay(200);
      const list = getStoredAppointments();
      const appointment = list.find((a) => a.id === id);
      if (!appointment) throw new Error('Appointment not found');
      return normalizeAppointment(appointment);
    }

    const response = await api.get(`/appointments/${id}`);
    console.log("[APPOINTMENT BY ID API RESPONSE]", response.data);

    const rawApt = response.data?.data || response.data?.appointment || response.data;
    if (!rawApt) throw new Error('Appointment not found');
    return normalizeAppointment(rawApt);
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
      return normalizeAppointment(newApt);
    }

    const response = await api.post('/appointments', bookingData);
    console.log("[BOOK APPOINTMENT API RESPONSE]", response.data);

    const created = response.data?.data || response.data?.appointment || response.data;
    return normalizeAppointment(created);
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
      return normalizeAppointment(current[index]);
    }

    const response = await api.patch(`/appointments/${id}/cancel`, { cancellationReason });
    const updated = response.data?.data || response.data?.appointment || response.data;
    return normalizeAppointment(updated);
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
      return normalizeAppointment(current[index]);
    }

    const response = await api.patch(`/appointments/${id}/reschedule`, { date, time });
    const updated = response.data?.data || response.data?.appointment || response.data;
    return normalizeAppointment(updated);
  }
};

export default appointmentService;
