import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, AlertCircle } from 'lucide-react';
import Button from './Button';
import Badge from './Badge';
import { formatDate } from '../utils/dateUtils';

const AppointmentCard = ({
  appointment,
  onCancel,
  onReschedule,
  className = ''
}) => {
  if (!appointment) return null;

  const statusConfig = {
    upcoming: { variant: 'primary', label: 'Confirmed Upcoming' },
    completed: { variant: 'success', label: 'Completed' },
    cancelled: { variant: 'danger', label: 'Cancelled' },
  };

  const status = statusConfig[appointment.status] || { variant: 'neutral', label: appointment.status };

  return (
    <div
      className={`bg-white rounded-2xl border border-border p-5 sm:p-6 shadow-card hover:shadow-card-hover transition-all duration-200 ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-border">
        {/* Doctor details */}
        <div className="flex items-start gap-4">
          <img
            src={appointment.doctorAvatar}
            alt={appointment.doctorName}
            className="w-14 h-14 rounded-xl object-cover border border-border shadow-subtle flex-shrink-0"
            loading="lazy"
          />
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h3 className="text-base font-semibold text-text-primary">
                {appointment.doctorName}
              </h3>
              <Badge variant={status.variant} size="sm">
                {status.label}
              </Badge>
            </div>
            <p className="text-xs sm:text-sm text-text-secondary font-medium">
              {appointment.specialization}
            </p>
            <div className="flex items-center gap-1.5 text-xs text-text-muted mt-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>{appointment.hospital}</span>
            </div>
          </div>
        </div>

        {/* Date and time box */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-2.5 flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-1">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-text-primary">
            <Calendar className="w-3.5 h-3.5 text-primary" />
            <span>{formatDate(appointment.date)}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-medium text-text-secondary">
            <Clock className="w-3.5 h-3.5 text-teal" />
            <span>{appointment.time}</span>
          </div>
        </div>
      </div>

      {/* Appointment Reason / Consultation preview */}
      {appointment.reason && (
        <div className="py-3 text-xs sm:text-sm text-text-secondary">
          <span className="font-medium text-text-primary">Reason: </span>
          <span className="line-clamp-2">{appointment.reason}</span>
        </div>
      )}

      {appointment.status === 'cancelled' && appointment.cancellationReason && (
        <div className="mt-2 p-2.5 bg-red-50 border border-red-200 rounded-lg text-xs text-red-800 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-danger" />
          <span>{appointment.cancellationReason}</span>
        </div>
      )}

      {/* Card Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-border mt-1">
        <Link to={`/appointments/${appointment.id}`}>
          <Button variant="ghost" size="sm" className="text-primary hover:text-primary-dark font-medium p-0">
            View Consultation Details →
          </Button>
        </Link>

        {appointment.status === 'upcoming' && (
          <div className="flex items-center gap-2">
            {onReschedule && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onReschedule(appointment)}
              >
                Reschedule
              </Button>
            )}
            {onCancel && (
              <Button
                variant="ghost"
                size="sm"
                className="text-danger hover:bg-red-50 hover:text-danger-dark"
                onClick={() => onCancel(appointment)}
              >
                Cancel
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentCard;
