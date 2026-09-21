import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Star, 
  MapPin, 
  Calendar, 
  Clock, 
  Award, 
  GraduationCap, 
  CheckCircle2, 
  ArrowLeft, 
  ShieldCheck,
  Building
} from 'lucide-react';
import doctorService from '../../services/doctorService';
import Button from '../../components/Button';
import Badge from '../../components/Badge';
import LoadingState from '../../components/LoadingState';
import ErrorState from '../../components/ErrorState';
import { formatDate } from '../../utils/dateUtils';
import { useToast } from '../../context/ToastContext';

const DoctorDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  useEffect(() => {
    setLoading(true);
    doctorService.getDoctorById(id)
      .then((data) => {
        setDoctor(data);
        if (data.availableDates && data.availableDates.length > 0) {
          setSelectedDate(data.availableDates[0]);
        }
        if (data.timeSlots && data.timeSlots.length > 0) {
          setSelectedTime(data.timeSlots[0]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching doctor details:', err);
        setError(err.message || 'Unable to load doctor profile.');
        setLoading(false);
      });
  }, [id]);

  const handleProceedBooking = () => {
    if (!selectedDate || !selectedTime) {
      showToast('Please select a date and time slot to proceed.', 'warning');
      return;
    }

    navigate(`/appointments/book/${doctor.id}?date=${encodeURIComponent(selectedDate)}&time=${encodeURIComponent(selectedTime)}`);
  };

  if (loading) {
    return <LoadingState message="Loading doctor profile..." description="Fetching practitioner credentials and opening times." />;
  }

  if (error || !doctor) {
    return (
      <ErrorState
        title="Practitioner Not Found"
        message={error || 'The requested doctor profile could not be found.'}
        onRetry={() => navigate('/doctors')}
      />
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Back button */}
      <div>
        <Link
          to="/doctors"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-secondary hover:text-text-primary transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Doctors</span>
        </Link>
      </div>

      {/* Main Grid: Left Doctor Profile (8 cols) & Right Sticky Booking Panel (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Doctor Profile & Credentials */}
        <div className="lg:col-span-8 space-y-8">
          {/* Header Card */}
          <div className="bg-white rounded-3xl border border-border p-6 sm:p-8 shadow-card flex flex-col sm:flex-row items-start gap-6">
            <img
              src={doctor.avatar}
              alt={doctor.name}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border border-border shadow-subtle flex-shrink-0"
            />

            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <h1 className="text-xl sm:text-2xl font-bold text-text-primary">
                  {doctor.name}
                </h1>
                <Badge variant="teal" size="sm">
                  {doctor.specialization}
                </Badge>
              </div>

              <p className="text-sm font-medium text-text-secondary mb-2">
                {doctor.qualification}
              </p>

              <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-text-muted mb-4">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span className="font-bold text-text-primary">{doctor.rating}</span>
                  <span>({doctor.reviewCount} verified reviews)</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Award className="w-4 h-4 text-primary" />
                  <span>{doctor.experience}</span>
                </div>
              </div>

              <div className="flex items-start gap-2 text-xs text-text-secondary pt-3 border-t border-border">
                <Building className="w-4 h-4 text-text-muted flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-text-primary block">{doctor.hospital}</span>
                  <span>{doctor.clinicAddress}</span>
                </div>
              </div>
            </div>
          </div>

          {/* About Section */}
          <div className="bg-white rounded-3xl border border-border p-6 sm:p-8 shadow-card space-y-4">
            <h2 className="text-lg font-bold text-text-primary tracking-tight">
              About {doctor.name}
            </h2>
            <p className="text-sm text-text-secondary leading-relaxed">
              {doctor.about}
            </p>
          </div>

          {/* Qualifications & Clinical Background */}
          <div className="bg-white rounded-3xl border border-border p-6 sm:p-8 shadow-card space-y-6">
            <h2 className="text-lg font-bold text-text-primary tracking-tight">
              Credentials & Clinical Qualifications
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-border bg-slate-50/60">
                <div className="flex items-center gap-2 text-primary text-xs font-semibold uppercase tracking-wider mb-1">
                  <GraduationCap className="w-4 h-4" />
                  <span>Education & Degrees</span>
                </div>
                <p className="text-sm font-medium text-text-primary">
                  {doctor.qualification}
                </p>
                <p className="text-xs text-text-muted mt-1">
                  Accredited Medical Board Certification
                </p>
              </div>

              <div className="p-4 rounded-xl border border-border bg-slate-50/60">
                <div className="flex items-center gap-2 text-teal text-xs font-semibold uppercase tracking-wider mb-1">
                  <Award className="w-4 h-4" />
                  <span>Clinical Experience</span>
                </div>
                <p className="text-sm font-medium text-text-primary">
                  {doctor.experience}
                </p>
                <p className="text-xs text-text-muted mt-1">
                  Hospital Senior Resident & Outpatient Consulting
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-text-secondary">
              <ShieldCheck className="w-4 h-4 text-success" />
              <span>License and certifications independently verified by health authorities</span>
            </div>
          </div>
        </div>

        {/* Right Column: Sticky Slot Selection & Booking Panel */}
        <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
          <div className="bg-white rounded-3xl border border-border p-6 shadow-card space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div>
                <span className="text-xs text-text-muted block">Consultation Fee</span>
                <span className="text-xl font-bold text-text-primary">{doctor.consultationFee || '$60'}</span>
              </div>
              <Badge variant="success" size="sm">
                In-Clinic Visit
              </Badge>
            </div>

            {/* Select Date */}
            <div>
              <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2.5">
                1. Select Consultation Date
              </label>
              <div className="grid grid-cols-3 gap-2">
                {doctor.availableDates?.map((dateStr) => {
                  const isSelected = selectedDate === dateStr;
                  const d = new Date(dateStr);
                  const dayName = isNaN(d.getTime()) ? '' : new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(d);
                  const dayNumber = isNaN(d.getTime()) ? '' : d.getDate();

                  return (
                    <button
                      key={dateStr}
                      type="button"
                      onClick={() => setSelectedDate(dateStr)}
                      className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-blue-50 border-primary text-primary shadow-subtle ring-1 ring-primary'
                          : 'bg-white border-border text-text-secondary hover:border-slate-300'
                      }`}
                    >
                      <span className="text-[10px] uppercase font-bold block opacity-75">{dayName}</span>
                      <span className="text-base font-bold block">{dayNumber}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Select Time Slot */}
            <div>
              <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2.5">
                2. Available Time Slots
              </label>
              <div className="grid grid-cols-2 gap-2">
                {doctor.timeSlots?.map((slot) => {
                  const isSelected = selectedTime === slot;
                  return (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedTime(slot)}
                      className={`p-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        isSelected
                          ? 'bg-primary text-white border-primary shadow-sm'
                          : 'bg-white border-border text-text-secondary hover:border-slate-300 hover:text-text-primary'
                      }`}
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>{slot}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected Booking Summary */}
            <div className="p-3.5 bg-slate-50 border border-border rounded-xl text-xs space-y-1">
              <div className="flex justify-between text-text-muted">
                <span>Selected Date:</span>
                <strong className="text-text-primary">{formatDate(selectedDate)}</strong>
              </div>
              <div className="flex justify-between text-text-muted">
                <span>Selected Time:</span>
                <strong className="text-text-primary">{selectedTime}</strong>
              </div>
            </div>

            {/* Booking CTA Button */}
            <Button
              variant="primary"
              size="lg"
              className="w-full shadow-md"
              onClick={handleProceedBooking}
              icon={Calendar}
            >
              Book Appointment
            </Button>

            <p className="text-[11px] text-text-muted text-center leading-relaxed">
              Instant confirmation • Reschedule or cancel anytime prior to appointment
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDetailPage;
