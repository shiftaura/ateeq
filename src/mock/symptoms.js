// Common symptom chips for selection
export const symptomChips = [
  'Fever',
  'Cough',
  'Headache',
  'Sore throat',
  'Fatigue',
  'Body ache',
  'Nausea',
  'Runny nose',
  'Shortness of breath',
  'Chest tightness',
  'Chills',
  'Dizziness'
];

export const durationOptions = [
  { id: 'today', label: 'Today (Less than 24 hours)' },
  { id: '1-3-days', label: '1 to 3 days' },
  { id: '4-7-days', label: '4 to 7 days' },
  { id: 'more-than-week', label: 'More than a week' }
];

export const severityOptions = [
  { id: 'Mild', label: 'Mild', description: 'Noticeable but does not affect daily routine' },
  { id: 'Moderate', label: 'Moderate', description: 'Uncomfortable and impacts some normal activities' },
  { id: 'Severe', label: 'Severe', description: 'Significantly impairs daily functioning or is painful' }
];

// Mock symptom analyses for demo mode
export const mockSymptomResults = [
  {
    id: 'sym_001',
    createdAt: '2026-09-21T10:30:00Z',
    symptoms: ['Fever', 'Cough', 'Sore throat', 'Headache'],
    description: 'Feeling warm since yesterday, mild dry cough and slight throat pain when swallowing.',
    duration: '1 to 3 days',
    severity: 'Moderate',
    urgencyLevel: 'MODERATE',
    urgencyDescription: 'Symptoms warrant monitoring and rest. If high fever persists beyond 3 days or breathing difficulty develops, consult a doctor promptly.',
    possibleCauses: [
      {
        name: 'Common Viral Cold',
        explanation: 'Typical presentation of upper respiratory irritation characterized by scratchy throat, light fever, and nasal congestion.'
      },
      {
        name: 'Influenza-like Illness',
        explanation: 'Systemic viral infection often presenting with body chills, generalized headache, fatigue, and elevated temperature.'
      },
      {
        name: 'Acute Pharyngitis',
        explanation: 'Localized inflammation of the pharynx often caused by seasonal viral agents.'
      }
    ],
    generalGuidance: [
      'Maintain generous oral hydration with warm water, herbal teas, or broths.',
      'Ensure adequate physical rest and sleep to support natural immune response.',
      'Use saline gargles (warm water with 1/2 tsp salt) to soothe throat irritation.',
      'Monitor body temperature twice daily using a calibrated digital thermometer.',
      'Maintain a well-ventilated resting environment.'
    ],
    whenToSeeDoctor: [
      'Fever exceeds 102°F (38.9°C) or does not decrease with standard rest.',
      'Development of shortness of breath, wheezing, or chest tightness.',
      'Inability to tolerate fluids or signs of dehydration (dark urine, dry mouth).',
      'Symptoms persist beyond 5 to 7 days without progressive improvement.'
    ],
    recommendedSpecialist: 'General Physician',
    safetyDisclaimer: 'This guidance is generated for informational purposes only and does not constitute a clinical medical diagnosis or prescription. Consult a licensed physician for diagnosis and medical decisions.'
  },
  {
    id: 'sym_002',
    createdAt: '2026-09-18T14:15:00Z',
    symptoms: ['Headache', 'Fatigue'],
    description: 'Dull ache around temples after prolonged screen work and poor sleep.',
    duration: 'Today',
    severity: 'Mild',
    urgencyLevel: 'LOW',
    urgencyDescription: 'Low urgency. Likely related to strain, fatigue, or mild dehydration.',
    possibleCauses: [
      {
        name: 'Tension-Type Headache',
        explanation: 'Often associated with physical stress, prolonged computer monitor posture, or neck muscle stiffness.'
      },
      {
        name: 'Eye Strain / Dehydration',
        explanation: 'Inadequate fluid intake combined with prolonged visual concentration.'
      }
    ],
    generalGuidance: [
      'Take regular breaks from digital displays (follow the 20-20-20 rule).',
      'Hydrate with 2-3 glasses of water.',
      'Rest in a quiet, dimly lit room for 30 minutes.'
    ],
    whenToSeeDoctor: [
      'Sudden, severe "thunderclap" headache unlike any experienced before.',
      'Headache accompanied by stiff neck, confusion, or visual disturbances.'
    ],
    recommendedSpecialist: 'General Physician',
    safetyDisclaimer: 'This guidance is generated for informational purposes only and does not constitute a clinical medical diagnosis or prescription.'
  }
];
