import api, { isMockMode } from './api';
import { mockDoctors } from '../mock/doctors';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Normalizes a doctor object to guarantee consistent attributes across
 * backend MongoDB documents and demo mock objects.
 */
export const normalizeDoctor = (doc) => {
  if (!doc) return null;

  const id = doc._id ? doc._id.toString() : (doc.id || '');
  const name = doc.name || 'Medical Specialist';
  const specialization = doc.specialization || 'General Physician';
  const qualification = doc.qualification || 'MBBS';

  // Format experience: backend provides a number (e.g. 12), UI expects '12 years experience'
  let experience = '5+ years experience';
  if (typeof doc.experience === 'number') {
    experience = `${doc.experience} years experience`;
  } else if (typeof doc.experience === 'string' && doc.experience.trim()) {
    experience = doc.experience.toLowerCase().includes('year')
      ? doc.experience
      : `${doc.experience} years experience`;
  }

  // Clinic / Hospital
  const hospital = doc.clinic?.name || doc.hospital || 'MediConsult Partner Clinic';
  const clinicAddress = doc.clinicAddress || (
    doc.clinic
      ? [doc.clinic.address, doc.clinic.city].filter(Boolean).join(', ')
      : 'Medical Center Plaza'
  );

  // Avatar / Profile image
  const avatar = doc.profileImage || doc.avatar || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=256';

  // Ratings & reviews
  const rating = typeof doc.rating === 'number' ? doc.rating : 4.9;
  const reviewCount = typeof doc.reviewCount === 'number' ? doc.reviewCount : 150;

  // Consultation Fee
  let consultationFee = '$60';
  if (doc.consultationFee !== undefined && doc.consultationFee !== null && doc.consultationFee !== '') {
    const feeStr = String(doc.consultationFee).trim();
    consultationFee = feeStr.startsWith('$') ? feeStr : `$${feeStr}`;
  } else if (doc.fee) {
    const feeStr = String(doc.fee).trim();
    consultationFee = feeStr.startsWith('$') ? feeStr : `$${feeStr}`;
  }

  // Availability text pill
  let availability = 'Available Today';
  if (doc.isAvailable === false) {
    availability = 'Currently Unavailable';
  } else if (typeof doc.availability === 'string' && doc.availability.trim()) {
    availability = doc.availability;
  } else if (Array.isArray(doc.availability) && doc.availability.length > 0) {
    availability = 'Available Today';
  }

  // Available dates for booking
  let availableDates = [];
  if (Array.isArray(doc.availableDates) && doc.availableDates.length > 0) {
    availableDates = doc.availableDates;
  } else if (Array.isArray(doc.availability) && doc.availability.length > 0) {
    availableDates = doc.availability
      .map((d) => (typeof d === 'string' ? d : d?.date))
      .filter(Boolean);
  }
  if (availableDates.length === 0) {
    const today = new Date();
    for (let i = 0; i < 5; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      availableDates.push(d.toISOString().split('T')[0]);
    }
  }

  // Available time slots
  let timeSlots = [];
  if (Array.isArray(doc.timeSlots) && doc.timeSlots.length > 0) {
    timeSlots = doc.timeSlots;
  } else if (Array.isArray(doc.availability) && doc.availability.length > 0) {
    const firstDay = doc.availability[0];
    if (firstDay && Array.isArray(firstDay.slots)) {
      timeSlots = firstDay.slots
        .filter((s) => !s.isBooked)
        .map((s) => (typeof s === 'string' ? s : s.time));
    }
  }
  if (timeSlots.length === 0) {
    timeSlots = ['09:00 AM', '10:00 AM', '11:30 AM', '02:00 PM', '03:30 PM', '04:30 PM'];
  }

  const about = doc.about || `${name} is a dedicated ${specialization} with ${experience} providing comprehensive clinical evaluations, diagnostics, and patient consultations.`;

  return {
    ...doc,
    id,
    _id: doc._id || id,
    name,
    specialization,
    qualification,
    experience,
    hospital,
    clinicAddress,
    avatar,
    profileImage: avatar,
    rating,
    reviewCount,
    consultationFee,
    fee: consultationFee,
    isAvailable: doc.isAvailable !== false,
    availability,
    availableDates,
    timeSlots,
    about,
  };
};

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

      return list.map(normalizeDoctor);
    }

    // Build backend-compatible query parameters
    const queryParams = {};
    if (params.search && params.search.trim()) {
      queryParams.search = params.search.trim();
    }
    if (params.specialization && params.specialization !== 'All') {
      queryParams.specialization = params.specialization.trim();
    }
    if (params.available !== undefined && params.available !== '' && params.available !== 'All') {
      queryParams.available = params.available;
    } else if (params.availability && params.availability !== 'All') {
      queryParams.available = 'true';
    }
    queryParams.limit = params.limit || 50;
    if (params.page) {
      queryParams.page = params.page;
    }

    const response = await api.get('/doctors', { params: queryParams });
    console.log("[DOCTORS API RESPONSE]", response.data);

    let rawDoctors = [];
    if (response.data) {
      if (Array.isArray(response.data.data?.doctors)) {
        rawDoctors = response.data.data.doctors;
      } else if (Array.isArray(response.data.data)) {
        rawDoctors = response.data.data;
      } else if (Array.isArray(response.data.doctors)) {
        rawDoctors = response.data.doctors;
      } else if (Array.isArray(response.data)) {
        rawDoctors = response.data;
      }
    }

    return rawDoctors.map(normalizeDoctor);
  },

  getDoctorById: async (id) => {
    if (isMockMode) {
      await delay(250);
      const doctor = mockDoctors.find((d) => d.id === id);
      if (!doctor) {
        throw new Error('Doctor not found');
      }
      return normalizeDoctor(doctor);
    }

    const response = await api.get(`/doctors/${id}`);
    console.log("[DOCTOR BY ID API RESPONSE]", response.data);

    const rawDoctor = response.data?.data || response.data?.doctor || response.data;
    if (!rawDoctor) {
      throw new Error('Doctor not found');
    }

    return normalizeDoctor(rawDoctor);
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
    console.log("[DOCTOR SLOTS API RESPONSE]", response.data);

    const slotData = response.data?.data || response.data;
    let slots = [];
    if (Array.isArray(slotData?.availableSlots)) {
      slots = slotData.availableSlots.map((s) => (typeof s === 'string' ? s : s.time));
    } else if (Array.isArray(slotData?.allSlots)) {
      slots = slotData.allSlots.map((s) => (typeof s === 'string' ? s : s.time));
    } else if (Array.isArray(slotData?.slots)) {
      slots = slotData.slots;
    }

    return {
      date: slotData?.date || date,
      slots,
    };
  }
};

export default doctorService;
