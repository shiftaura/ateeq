import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, UserCheck, Activity, ChevronRight } from 'lucide-react';
import UrgencyBadge from './UrgencyBadge';
import { formatDate } from '../utils/dateUtils';

const HealthRecordCard = ({ record, className = '' }) => {
  if (!record) return null;

  return (
    <div
      className={`bg-white rounded-2xl border border-border p-5 sm:p-6 shadow-card hover:shadow-card-hover transition-all duration-200 ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
        <div className="flex items-center gap-2 text-xs font-semibold text-text-secondary">
          <Calendar className="w-4 h-4 text-primary" />
          <span>{formatDate(record.date)}</span>
          <span className="text-slate-300">•</span>
          <span className="capitalize">{record.type === 'symptom_check' ? 'Symptom Assessment' : 'Clinical Consultation'}</span>
        </div>
        <UrgencyBadge level={record.urgency} size="sm" />
      </div>

      <div className="py-3">
        <h3 className="text-base font-semibold text-text-primary mb-2">
          {record.title}
        </h3>

        {/* Symptoms tags */}
        {record.symptoms && record.symptoms.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {record.symptoms.map((symptom, idx) => (
              <span
                key={idx}
                className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md font-medium"
              >
                {symptom}
              </span>
            ))}
          </div>
        )}

        <p className="text-sm text-text-secondary line-clamp-2 leading-relaxed mb-3">
          {record.summaryGuidance}
        </p>

        {record.doctorConsultation && (
          <div className="flex items-center gap-2 text-xs font-medium text-teal-800 bg-teal-50 px-3 py-2 rounded-lg border border-teal-100">
            <UserCheck className="w-3.5 h-3.5 text-teal" />
            <span>{record.doctorConsultation}</span>
          </div>
        )}
      </div>

      <div className="pt-3 border-t border-border flex justify-end">
        <Link
          to={`/medical-history/${record.id}`}
          className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-primary hover:text-primary-dark transition-colors"
        >
          <span>View Full Assessment</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

export default HealthRecordCard;
