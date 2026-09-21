import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  ArrowLeft, 
  Activity, 
  UserCheck, 
  FileText, 
  CheckCircle2, 
  AlertTriangle,
  ExternalLink
} from 'lucide-react';
import historyService from '../../services/historyService';
import Button from '../../components/Button';
import Badge from '../../components/Badge';
import UrgencyBadge from '../../components/UrgencyBadge';
import LoadingState from '../../components/LoadingState';
import ErrorState from '../../components/ErrorState';
import { formatDate } from '../../utils/dateUtils';

const MedicalHistoryDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    historyService.getHistoryDetail(id)
      .then((data) => {
        setRecord(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching record detail:', err);
        setError(err.message || 'Unable to retrieve history record.');
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <LoadingState message="Loading medical record..." description="Opening encrypted health assessment log." />;
  }

  if (error || !record) {
    return (
      <ErrorState
        title="Record Not Found"
        message={error || 'This historical record is unavailable.'}
        onRetry={() => navigate('/medical-history')}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Back button */}
      <div>
        <Link
          to="/medical-history"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-secondary hover:text-text-primary transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Medical History</span>
        </Link>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border">
        <div>
          <span className="text-xs font-semibold text-text-muted uppercase tracking-wider block mb-1">
            Timeline Entry • {formatDate(record.date)}
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
            {record.title}
          </h1>
        </div>

        <UrgencyBadge level={record.urgency} size="lg" />
      </div>

      {/* Record Overview Card */}
      <div className="bg-white rounded-3xl border border-border p-6 sm:p-8 shadow-card space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-6 border-b border-border">
          <div>
            <span className="text-xs text-text-muted uppercase tracking-wider font-semibold block mb-1">
              Assessment Type
            </span>
            <span className="text-sm font-semibold text-text-primary capitalize">
              {record.type === 'symptom_check' ? 'Digital Symptom Assessment' : 'Clinical In-Person Consultation'}
            </span>
          </div>

          <div>
            <span className="text-xs text-text-muted uppercase tracking-wider font-semibold block mb-1">
              Reported Duration
            </span>
            <span className="text-sm font-semibold text-text-primary">
              {record.duration || 'Not specified'}
            </span>
          </div>

          <div>
            <span className="text-xs text-text-muted uppercase tracking-wider font-semibold block mb-1">
              Severity Level
            </span>
            <span className="text-sm font-semibold text-text-primary">
              {record.severity || 'Mild to Moderate'}
            </span>
          </div>
        </div>

        {/* Symptoms Tags */}
        <div>
          <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2.5">
            Symptoms Logged
          </h3>
          <div className="flex flex-wrap gap-2">
            {record.symptoms?.map((s, idx) => (
              <span
                key={idx}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-blue-50 text-primary border border-blue-200"
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* General Guidance */}
        <div>
          <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
            General Guidance Provided
          </h3>
          <p className="text-sm text-text-secondary leading-relaxed bg-slate-50 p-4 rounded-xl border border-border">
            {record.summaryGuidance}
          </p>
        </div>

        {/* Linked Consultation if any */}
        {record.doctorConsultation && (
          <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <UserCheck className="w-5 h-5 text-teal flex-shrink-0" />
              <div>
                <span className="text-xs font-semibold text-teal-800 block">
                  Associated Consultation
                </span>
                <span className="text-sm font-bold text-text-primary">
                  {record.doctorConsultation}
                </span>
              </div>
            </div>

            {record.appointmentId && (
              <Link to={`/appointments/${record.appointmentId}`}>
                <Button variant="teal" size="sm" icon={ExternalLink} iconPosition="right">
                  View Appointment
                </Button>
              </Link>
            )}
          </div>
        )}

        {/* Additional Clinical Notes */}
        {record.notes && (
          <div>
            <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
              Patient Context & Notes
            </h3>
            <p className="text-sm text-text-secondary leading-relaxed bg-slate-50 p-4 rounded-xl border border-border italic">
              "{record.notes}"
            </p>
          </div>
        )}
      </div>

      {/* Safety Notice Footer */}
      <div className="p-4 rounded-xl border border-border bg-slate-100/60 text-center text-xs text-text-muted leading-relaxed">
        Medical history logs serve as patient reference notes. Always share this context with your attending physician during clinical appointments.
      </div>
    </div>
  );
};

export default MedicalHistoryDetailPage;
