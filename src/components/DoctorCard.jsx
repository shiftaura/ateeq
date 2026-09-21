import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, Calendar, Clock, CheckCircle } from 'lucide-react';
import Button from './Button';
import Badge from './Badge';

const DoctorCard = ({ doctor, className = '' }) => {
  if (!doctor) return null;

  return (
    <div
      className={`bg-white rounded-2xl border border-border p-5 sm:p-6 shadow-card hover:shadow-card-hover transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-5 ${className}`}
    >
      {/* Doctor Info Left */}
      <div className="flex items-start gap-4 sm:gap-5 flex-1">
        <div className="relative flex-shrink-0">
          <img
            src={doctor.avatar}
            alt={doctor.name}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover border border-border shadow-subtle"
            loading="lazy"
          />
          <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
            <CheckCircle className="w-4 h-4 text-primary fill-blue-50" />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h3 className="text-base sm:text-lg font-semibold text-text-primary tracking-tight">
              {doctor.name}
            </h3>
            <Badge variant="teal" size="sm">
              {doctor.specialization}
            </Badge>
          </div>

          <p className="text-xs sm:text-sm text-text-secondary mb-1.5 font-medium">
            {doctor.qualification} • {doctor.experience}
          </p>

          <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-text-secondary mb-3">
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span className="font-semibold text-text-primary">{doctor.rating}</span>
              <span className="text-text-muted">({doctor.reviewCount} reviews)</span>
            </div>
            <span className="text-slate-300">•</span>
            <div className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-text-muted" />
              <span className="truncate max-w-[200px]">{doctor.hospital}</span>
            </div>
          </div>

          {/* Availability pill */}
          <div className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
            <Clock className="w-3.5 h-3.5 text-emerald-600" />
            <span>{doctor.availability}</span>
          </div>
        </div>
      </div>

      {/* Action Right */}
      <div className="flex flex-row md:flex-col items-center md:items-end justify-between border-t md:border-t-0 pt-4 md:pt-0 border-border gap-3 flex-shrink-0">
        <div className="text-left md:text-right">
          <span className="text-xs text-text-muted block">Consultation Fee</span>
          <span className="text-base sm:text-lg font-bold text-text-primary">
            {doctor.consultationFee || '$60'}
          </span>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Link to={`/doctors/${doctor.id}`} className="flex-1 md:flex-initial">
            <Button variant="outline" size="sm" className="w-full">
              View Profile
            </Button>
          </Link>
          <Link to={`/appointments/book/${doctor.id}`} className="flex-1 md:flex-initial">
            <Button variant="primary" size="sm" className="w-full" icon={Calendar}>
              Book Slot
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;
