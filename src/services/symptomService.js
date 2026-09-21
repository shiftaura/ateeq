import api, { isMockMode } from './api';
import { mockSymptomResults } from '../mock/symptoms';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper for local mock storage
const getStoredSymptomAnalyses = () => {
  const stored = localStorage.getItem('mediconsult_symptom_analyses');
  if (!stored) {
    localStorage.setItem('mediconsult_symptom_analyses', JSON.stringify(mockSymptomResults));
    return mockSymptomResults;
  }
  return JSON.parse(stored);
};

export const symptomService = {
  analyzeSymptoms: async (symptomData) => {
    // Exact schema matching backend symptomValidator.js:
    // 1. symptoms: non-empty array of strings (min 1, max 20)
    // 2. duration: trimmed string (max 50 chars)
    // 3. severity: lowercase enum ("mild" | "moderate" | "severe")
    const payload = {
      symptoms: Array.isArray(symptomData.symptoms)
        ? symptomData.symptoms.filter((s) => typeof s === 'string' && s.trim().length > 0)
        : [],
      duration: (symptomData.duration || '1 to 3 days').trim(),
      severity: (symptomData.severity || 'moderate').trim().toLowerCase(),
    };

    if (isMockMode) {
      await delay(1200); // realistic analysis duration

      const { symptoms = [], description = '', duration = '1 to 3 days', severity = 'moderate' } = symptomData;
      const normalizedSeverity = severity.toLowerCase();

      const isHighUrgency =
        normalizedSeverity === 'severe' ||
        symptoms.includes('Shortness of breath') ||
        symptoms.includes('Chest tightness') ||
        (description && description.toLowerCase().includes('chest pain')) ||
        (description && description.toLowerCase().includes('breathing difficulty'));

      const isLowUrgency = normalizedSeverity === 'mild' && duration === 'Today' && !symptoms.includes('Fever');

      const urgencyLevel = isHighUrgency ? 'high' : isLowUrgency ? 'low' : 'moderate';

      const urgencyDescription = isHighUrgency
        ? 'Urgent symptoms detected. High priority assessment suggests seeking immediate professional medical care or visiting an emergency health clinic.'
        : urgencyLevel === 'moderate'
        ? 'Moderate discomfort detected. Rest and monitor symptoms closely. If fever or distress persists over 48 hours, schedule an in-person doctor consultation.'
        : 'Low urgency profile. Consistent with mild fatigue or self-limiting symptoms. Practice self-care and rest.';

      // Generate possible causes based on inputs
      let possibleCauses = [];
      if (symptoms.includes('Fever') || symptoms.includes('Cough') || symptoms.includes('Sore throat')) {
        possibleCauses.push(
          'Common Viral Upper Respiratory Tract Infection',
          'Seasonal Influenza Pattern',
          'Acute Pharyngitis / Tonsillar Irritation'
        );
      } else if (symptoms.includes('Headache') || symptoms.includes('Fatigue')) {
        possibleCauses.push(
          'Tension Headache & Screen Fatigue',
          'Dehydration / Sleep Deprivation'
        );
      } else {
        possibleCauses.push(
          'Nonspecific Viral Malaise',
          'Physical Overexertion or Stress'
        );
      }

      const generalGuidance = [
        'Maintain plentiful oral hydration with water, warm infusions, and electrolyte fluids.',
        'Prioritize 8–9 hours of sleep in a well-ventilated, quiet room.',
        'Avoid strenuous physical exertion until energy and symptoms normalize.',
        'Monitor temperature twice daily with a digital thermometer.',
        'Avoid self-medicating with antibiotics; viral patterns do not respond to antibiotic therapy.'
      ];

      const whenToSeeDoctor = [
        'Temperature climbs above 102°F (38.9°C) or fails to reduce with standard rest.',
        'Any feeling of labored breathing, shortness of breath, or chest heaviness.',
        'Persistent vomiting or inability to keep liquids down for more than 12 hours.',
        'Symptoms continue without noticeable improvement beyond 4 to 5 days.'
      ];

      const newAnalysis = {
        id: 'sym_' + Date.now(),
        createdAt: new Date().toISOString(),
        symptoms,
        description: description || '',
        duration,
        severity: normalizedSeverity,
        urgencyLevel,
        urgencyDescription,
        possibleCauses,
        generalGuidance,
        whenToSeeDoctor,
        doctorRecommendation: true,
        recommendedSpecialist: isHighUrgency ? 'Pulmonologist / Emergency Care' : 'General Physician',
        safetyDisclaimer: 'This guidance is generated for informational purposes only and does not constitute a clinical medical diagnosis or prescription. Consult a licensed physician for clinical examination and personalized treatment.'
      };

      const stored = getStoredSymptomAnalyses();
      const updated = [newAnalysis, ...stored];
      localStorage.setItem('mediconsult_symptom_analyses', JSON.stringify(updated));

      return newAnalysis;
    }

    // TASK 1: Safe development logging immediately before Axios request
    console.log("SYMPTOM ANALYSIS PAYLOAD:", payload);

    try {
      const response = await api.post('/symptoms/analyze', payload);
      // Backend ApiResponse standard format: { success: true, message: "...", data: { ... } }
      const rawData = response.data?.data || response.data;
      return {
        ...rawData,
        id: rawData._id || rawData.id,
      };
    } catch (err) {
      // TASK 5: Extract actual useful backend validation messages
      let errorMessage = 'Unable to complete the analysis right now.';

      if (err.response?.data) {
        const { message, errors } = err.response.data;
        if (Array.isArray(errors) && errors.length > 0) {
          const detail = errors.map((e) => e.message || `${e.field}: invalid value`).join(', ');
          errorMessage = detail ? `${message || 'Validation failed'}: ${detail}` : message;
        } else if (message) {
          errorMessage = message;
        }
      } else if (err.request) {
        errorMessage = 'Unable to reach the symptom analysis service. Please check your network connection or verify the backend server is running.';
      } else if (err.message) {
        errorMessage = err.message;
      }

      console.error('[symptomService] Analysis request failed:', errorMessage);
      const enrichedError = new Error(errorMessage);
      enrichedError.response = err.response;
      throw enrichedError;
    }
  },

  getSymptomHistory: async () => {
    if (isMockMode) {
      await delay(250);
      return getStoredSymptomAnalyses();
    }

    const response = await api.get('/symptoms/history');
    const rawData = response.data?.data || response.data;
    // Backend returns { records: [...], pagination: {...} }
    const list = rawData?.records || (Array.isArray(rawData) ? rawData : []);
    return list.map((item) => ({
      ...item,
      id: item._id || item.id,
    }));
  },

  getSymptomById: async (id) => {
    if (isMockMode) {
      await delay(200);
      const items = getStoredSymptomAnalyses();
      const found = items.find((item) => item.id === id);
      if (!found) {
        throw new Error('Symptom assessment not found');
      }
      return found;
    }

    const response = await api.get(`/symptoms/${id}`);
    const rawData = response.data?.data || response.data;
    return {
      ...rawData,
      id: rawData._id || rawData.id,
    };
  }
};

export default symptomService;
