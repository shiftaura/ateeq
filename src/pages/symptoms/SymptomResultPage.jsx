import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  AlertTriangle, 
  Stethoscope, 
  Bookmark, 
  Calendar, 
  Clock, 
  Info, 
  CheckCircle2, 
  AlertCircle,
  ArrowRight,
  Share2
} from 'lucide-react';
import symptomService from '../../services/symptomService';
import historyService from '../../services/historyService';
import Button from '../../components/Button';
import Badge from '../../components/Badge';
import UrgencyBadge from '../../components/UrgencyBadge';
import Alert from '../../components/Alert';
import LoadingState from '../../components/LoadingState';
import ErrorState from '../../components/ErrorState';
import { useToast } from '../../context/ToastContext';
import { formatDate } from '../../utils/dateUtils';

const SymptomResultPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [result, setResult] = useState(location.state?.result || null);
  const [loading, setLoading] = useState(!location.state?.result);
  const [error, setError] = useState(null);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (!result && id) {
      setLoading(true);
      symptomService.getSymptomById(id)
        .then((data) => {
          setResult(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error('Error fetching result:', err);
          setError(err.message || 'Unable to load symptom assessment result.');
          setLoading(false);
        });
    }
  }, [id, result]);

  const isUrgent =
    result?.urgencyLevel?.toLowerCase() === 'high' ||
    result?.urgencyLevel?.toLowerCase() === 'urgent';

  const urgencyText =
    result?.urgencyDescription ||
    result?.urgentWarning ||
    (isUrgent
      ? 'Urgent symptoms detected. High priority assessment suggests seeking immediate professional medical care or visiting an emergency health clinic.'
      : result?.urgencyLevel?.toLowerCase() === 'moderate'
      ? 'Moderate discomfort detected. Rest and monitor symptoms closely. If fever or distress persists over 48 hours, schedule an in-person doctor consultation.'
      : 'Low urgency profile. Consistent with mild fatigue or self-limiting symptoms. Practice self-care and rest.');

  const whenToSeeDoctorList =
    result?.whenToSeeDoctor && result.whenToSeeDoctor.length > 0
      ? result.whenToSeeDoctor
      : [
          'Fever exceeds 102°F (38.9°C) or does not decrease with standard rest.',
          'Development of shortness of breath, wheezing, or chest tightness.',
          'Inability to tolerate fluids or signs of dehydration (dark urine, dry mouth).',
          'Symptoms persist beyond 5 to 7 days without progressive improvement.'
        ];

  const handleSaveToHistory = async () => {
    if (!result) return;
    try {
      await historyService.addRecord({
        type: 'symptom_check',
        title: `Symptom Assessment: ${result.symptoms?.slice(0, 2).join(' & ') || 'General Check'}`,
        symptoms: result.symptoms || [],
        duration: result.duration,
        severity: result.severity,
        urgency: result.urgencyLevel,
        summaryGuidance: urgencyText,
        notes: result.description || 'Recorded from MediConsult symptom assessment'
      });
      setIsSaved(true);
      showToast('Assessment successfully saved to your Medical History.', 'success');
    } catch (err) {
      showToast('Unable to save to medical history.', 'error');
    }
  };

  if (loading) {
    return <LoadingState message="Loading health guidance..." description="Retrieving your assessment summary." />;
  }

  if (error || !result) {
    return (
      <ErrorState
        title="Assessment Not Found"
        message={error || 'The requested symptom assessment could not be retrieved.'}
        onRetry={() => navigate('/symptoms')}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border">
        <div>
          <span className="text-xs font-semibold text-primary uppercase tracking-wider block mb-1">
            Assessment Results • {formatDate(result.createdAt || new Date())}
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
            Your General Health Guidance
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSaveToHistory}
            disabled={isSaved}
            icon={Bookmark}
          >
            {isSaved ? 'Saved to History' : 'Save to Medical History'}
          </Button>
          <Link to={`/doctors?specialization=${encodeURIComponent(result.recommendedSpecialist || 'General Physician')}`}>
            <Button variant="primary" size="sm" icon={Stethoscope}>
              Find a Doctor
            </Button>
          </Link>
        </div>
      </div>

      {/* Urgent Warning Banner if High Urgency */}
      {isUrgent && (
        <div className="p-5 rounded-2xl bg-red-50 border-2 border-red-300 text-red-950 flex items-start gap-4 shadow-subtle">
          <AlertCircle className="w-6 h-6 text-danger flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-base font-bold text-danger mb-1">
              Seek Urgent Professional Medical Attention
            </h3>
            <p className="text-xs sm:text-sm text-red-900 leading-relaxed mb-3">
              {result.urgentWarning || 'Your reported symptoms suggest potential high-priority distress. Please visit your nearest hospital emergency department or consult an on-duty medical doctor immediately.'}
            </p>
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-white bg-danger px-3 py-1.5 rounded-lg shadow-sm">
              <span>Emergency Helpline: Call 911 or Local Emergency Services</span>
            </div>
          </div>
        </div>
      )}

      {/* Urgency Summary Card */}
      <div className="bg-white rounded-3xl border border-border p-6 sm:p-8 shadow-card space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
          <div>
            <span className="text-xs font-semibold text-text-muted uppercase tracking-wider block mb-1">
              Evaluation Status
            </span>
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-text-primary">Urgency Level:</span>
              <UrgencyBadge level={result.urgencyLevel} size="lg" />
            </div>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-xs text-text-muted block">Duration Reported</span>
            <span className="text-xs font-semibold text-text-primary capitalize">{result.duration} ({result.severity} severity)</span>
          </div>
        </div>

        <p className="text-sm text-text-secondary leading-relaxed">
          {urgencyText}
        </p>

        {/* Symptoms Reported */}
        <div>
          <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2.5">
            Reported Symptoms
          </h4>
          <div className="flex flex-wrap gap-2">
            {result.symptoms?.map((sym, idx) => (
              <span
                key={idx}
                className="text-xs font-medium px-3 py-1.5 rounded-lg bg-slate-100 text-slate-800 border border-slate-200"
              >
                {sym}
              </span>
            ))}
          </div>
          {result.description && (
            <p className="text-xs text-text-secondary italic mt-2.5">
              "{result.description}"
            </p>
          )}
        </div>
      </div>

      {/* Possible Causes Section (Strict Medical Safety Wording) */}
      <div className="bg-white rounded-3xl border border-border p-6 sm:p-8 shadow-card space-y-4">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-primary flex items-center justify-center">
            <Info className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-text-primary">
              Possible causes may include:
            </h3>
            <p className="text-xs text-text-muted">
              These are general clinical patterns, not a confirmed diagnosis.
            </p>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          {result.possibleCauses && result.possibleCauses.length > 0 ? (
            result.possibleCauses.map((cause, idx) => {
              const causeName = typeof cause === 'object' ? cause.name : cause;
              const causeExplanation = typeof cause === 'object' ? cause.explanation : null;

              return (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-border bg-slate-50/50 hover:bg-slate-50 transition-colors"
                >
                  <h4 className="text-sm font-semibold text-text-primary mb-1 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    {causeName}
                  </h4>
                  {causeExplanation && (
                    <p className="text-xs text-text-secondary leading-relaxed pl-3.5">
                      {causeExplanation}
                    </p>
                  )}
                </div>
              );
            })
          ) : (
            <p className="text-xs text-text-secondary italic">
              No specific primary pattern identified. General supportive care is advised.
            </p>
          )}
        </div>
      </div>

      {/* General Guidance (Non-Prescription Self-Care) */}
      <div className="bg-white rounded-3xl border border-border p-6 sm:p-8 shadow-card space-y-4">
        <h3 className="text-base font-bold text-text-primary">
          General Supportive Guidance
        </h3>
        <p className="text-xs text-text-secondary">
          Evidence-informed general recovery measures. (Note: No medicines or dosages are prescribed autonomously.)
        </p>

        <ul className="space-y-3 pt-2">
          {result.generalGuidance?.map((tip, idx) => (
            <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-text-secondary leading-relaxed">
              <CheckCircle2 className="w-4 h-4 text-teal flex-shrink-0 mt-0.5" />
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* When Should You See a Doctor? */}
      <div className="bg-amber-50/60 border border-amber-200/80 rounded-3xl p-6 sm:p-8 shadow-card space-y-4">
        <div className="flex items-center gap-2.5">
          <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0" />
          <h3 className="text-base font-bold text-amber-950">
            When should you see a doctor?
          </h3>
        </div>
        <p className="text-xs sm:text-sm text-amber-900 leading-relaxed">
          Consider professional in-person medical evaluation if you encounter any of the following indications:
        </p>

        <ul className="space-y-2.5 pt-1">
          {whenToSeeDoctorList.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-amber-950">
              <span className="text-warning font-bold">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Recommended Doctor Consultation Callout */}
      <div className="bg-gradient-to-r from-blue-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-card flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <span className="text-xs font-semibold text-teal-light uppercase tracking-wider block mb-1">
            Recommended Action
          </span>
          <h3 className="text-lg font-bold mb-1">
            Consult a {result.recommendedSpecialist || 'General Physician'}
          </h3>
          <p className="text-xs sm:text-sm text-blue-100/80 max-w-md leading-relaxed">
            Verified doctors are available today for clinical evaluations and accurate diagnoses.
          </p>
        </div>

        <Link to="/doctors">
          <Button variant="teal" size="md" icon={Stethoscope} className="whitespace-nowrap">
            Find Matching Doctors
          </Button>
        </Link>
      </div>

      {/* Bottom Safety Disclaimer */}
      <div className="p-4 rounded-xl border border-border bg-slate-100/60 text-center text-xs text-text-muted leading-relaxed">
        {result.safetyDisclaimer || 'This guidance is generated for informational purposes only and does not constitute a clinical medical diagnosis or prescription. Consult a licensed physician for clinical examination and personalized treatment.'}
      </div>
    </div>
  );
};

export default SymptomResultPage;
