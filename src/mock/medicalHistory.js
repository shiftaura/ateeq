// Mock Medical History Data for Demo Mode
export const mockMedicalHistory = [
  {
    id: 'hist_001',
    date: '2026-09-21',
    type: 'symptom_check',
    title: 'Symptom Assessment: Fever & Sore Throat',
    symptoms: ['Fever', 'Cough', 'Sore throat', 'Headache'],
    duration: '1 to 3 days',
    severity: 'Moderate',
    urgency: 'MODERATE',
    summaryGuidance: 'Identified possible viral cold or pharyngitis patterns. Recommended hydration, temperature monitoring, and doctor consultation if symptoms persist past 3 days.',
    doctorConsultation: 'Scheduled with Dr. Michael Chen for Sep 24, 2026',
    appointmentId: 'apt_101',
    notes: 'Patient noted onset after exposure to air-conditioned environment.'
  },
  {
    id: 'hist_002',
    date: '2026-09-18',
    type: 'symptom_check',
    title: 'Symptom Assessment: Headache & Fatigue',
    symptoms: ['Headache', 'Fatigue'],
    duration: 'Today',
    severity: 'Mild',
    urgency: 'LOW',
    summaryGuidance: 'Identified tension headache and digital screen strain patterns. Recommended rest, hydration, and 20-20-20 screen pause routine.',
    doctorConsultation: null,
    appointmentId: null,
    notes: 'Resolved after rest and hydration.'
  },
  {
    id: 'hist_003',
    date: '2026-08-15',
    type: 'consultation',
    title: 'In-Clinic Physical Consultation',
    symptoms: ['Routine Wellness Check'],
    duration: 'Annual visit',
    severity: 'None',
    urgency: 'LOW',
    summaryGuidance: 'Routine annual check completed. Baseline metabolic and cardiovascular indicators within healthy range.',
    doctorConsultation: 'Consulted Dr. Aisha Patel (Family Medicine)',
    appointmentId: 'apt_103',
    notes: 'Blood pressure 118/76 mmHg. Advised continuation of healthy diet and hydration.'
  }
];
