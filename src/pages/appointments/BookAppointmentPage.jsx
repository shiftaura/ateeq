import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, User, Mail, FileText, ArrowLeft, ShieldCheck, AlertCircle } from 'lucide-react';
import doctorService from '../../services/doctorService';
import appointmentService from '../../services/appointmentService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import Input from '../../components/Input';
import Textarea from '../../components/Textarea';
import Button from '../../components/Button';
import LoadingState from '../../components/LoadingState';
import ErrorState from '../../components/ErrorState';
import Alert from '../../components/Alert';
import { formatDate } from '../../utils/dateUtils';

const BookAppointmentPage = () => {
  const { doctorId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();

  const queryDate = searchParams.get('date');
  const queryTime = searchParams.get('time');

  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingLoading, setBookingLoading] = useState(false);

  const [appointmentDate, setAppointmentDate] = useState(queryDate || '');
  const [appointmentTime, setAppointmentTime] = useState(queryTime || '');
  const [reason, setReason] = useState('');
  const [reasonError, setReasonError] = useState('');

  useEffect(() => {
    setLoading(true);
    doctorService.getDoctorById(doctorId)
      .then((data) => {
        setDoctor(data);
        if (!appointmentDate && Array.isArray(data?.availableDates) && data.availableDates.length > 0) {
          setAppointmentDate(data.availableDates[0]);
        }
        if (!appointmentTime && Array.isArray(data?.timeSlots) && data.timeSlots.length > 0) {
          setAppointmentTime(data.timeSlots[0]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching doctor for booking:', err);
        setError(err.response?.data?.message || err.message || 'Unable to load doctor information.');
        setLoading(false);
      });
  }, [doctorId]);

  const handleConfirmBooking = async (e) => {
    e.preventDefault();
    setReasonError('');

    if (!reason.trim()) {
      setReasonError('Please provide a brief reason or chief symptom for the visit.');
      return;
    }

    if (!appointmentDate || !appointmentTime) {
      showToast('Please specify an appointment date and time slot.', 'warning');
      return;
    }

    setBookingLoading(true);
    try {
      const targetDocId = doctor?.id || doctor?._id || doctorId;
      const newAppointment = await appointmentService.bookAppointment({
        doctorId: targetDocId,
        doctorName: doctor.name,
        doctorAvatar: doctor.avatar,
        specialization: doctor.specialization,
        date: appointmentDate,
        time: appointmentTime,
        patientName: user?.name || 'Patient',
        patientEmail: user?.email || '',
        patientPhone: user?.phone || '',
        reason: reason.trim(),
        hospital: doctor.hospital,
        clinicAddress: doctor.clinicAddress,
        fee: doctor.consultationFee || '$60'
      });

      showToast('Appointment successfully scheduled!', 'success');
      navigate(`/appointment-success/${newAppointment?.id || newAppointment?._id || 'confirmed'}`, {
        state: { appointment: newAppointment },
        replace: true
      });
    } catch (err) {
      console.error('Booking failed:', err);
      const errMsg = err.response?.data?.message || err.message || 'Failed to book appointment. Please check connection and try again.';
      showToast(errMsg, 'error');
      setError(errMsg);
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return <LoadingState message="Preparing booking portal..." description="Validating slot availability." />;
  }

  if (error && !doctor) {
    return (
      <ErrorState
        title="Unable to Load Doctor"
        message={error}
        onRetry={() => navigate('/doctors')}
      />
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-12">
      {/* Back button */}
      <div>
        <Link
          to={`/doctors/${doctor?.id || doctor?._id || doctorId}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-secondary hover:text-text-primary transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Doctor Profile</span>
        </Link>
      </div>

      <div>
        <span className="text-xs font-semibold text-primary uppercase tracking-wider block mb-1">
          Review & Confirmation
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
          Confirm Your Appointment
        </h1>
        <p className="text-sm text-text-secondary mt-1">
          Please verify your consultation details before securing your booking slot.
        </p>
      </div>

      {error && (
        <Alert type="danger" onDismiss={() => setError(null)}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleConfirmBooking} className="space-y-6">
        {/* Selected Doctor Summary Card */}
        <div className="bg-white rounded-3xl border border-border p-6 shadow-card flex items-start gap-4 sm:gap-5">
          <img
            src={doctor.avatar}
            alt={doctor.name}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border border-border shadow-subtle flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <span className="text-xs font-semibold text-teal block">{doctor.specialization}</span>
            <h2 className="text-lg font-bold text-text-primary truncate">{doctor.name}</h2>
            <div className="flex items-center gap-1.5 text-xs text-text-muted mt-1">
              <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate">{doctor.hospital} • {doctor.clinicAddress}</span>
            </div>
            <div className="text-xs font-semibold text-primary mt-2">
              Consultation Fee: {doctor.consultationFee || '$60'}
            </div>
          </div>
        </div>

        {/* Date and Time Details Card */}
        <div className="bg-white rounded-3xl border border-border p-6 shadow-card space-y-4">
          <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider">
            Consultation Schedule
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 border border-border rounded-2xl">
              <span className="text-xs text-text-muted block mb-1">Scheduled Date</span>
              <div className="flex items-center gap-2 text-sm font-semibold text-text-primary">
                <Calendar className="w-4 h-4 text-primary" />
                <span>{formatDate(appointmentDate)}</span>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border border-border rounded-2xl">
              <span className="text-xs text-text-muted block mb-1">Scheduled Time</span>
              <div className="flex items-center gap-2 text-sm font-semibold text-text-primary">
                <Clock className="w-4 h-4 text-teal" />
                <span>{appointmentTime}</span>
              </div>
            </div>
          </div>

          <p className="text-xs text-text-muted">
            Please plan to arrive 10 minutes prior to your designated slot for registration.
          </p>
        </div>

        {/* Patient Details & Reason */}
        <div className="bg-white rounded-3xl border border-border p-6 shadow-card space-y-5">
          <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider">
            Patient Consultation Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Patient Name"
              value={user?.name || 'Sarah Jenkins'}
              disabled
              icon={User}
            />
            <Input
              label="Email Address"
              value={user?.email || 'sarah.jenkins@example.com'}
              disabled
              icon={Mail}
            />
          </div>

          <div>
            <Textarea
              label="Reason for Consultation / Chief Symptoms"
              id="booking-reason"
              rows={3}
              required
              placeholder="E.g., Ongoing throat discomfort and fever since yesterday; seeking physician examination."
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                if (reasonError) setReasonError('');
              }}
              error={reasonError}
              helperText="This information helps the doctor prepare for your consultation."
            />
          </div>
        </div>

        {/* Verification Guard Alert */}
        <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-4 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <div className="text-xs text-blue-900 leading-relaxed">
            <strong>Verification Notice:</strong> Please verify the doctor, date, and appointment time before confirming. You will receive an instant digital confirmation ticket.
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <Link to={`/doctors/${doctor?.id || doctor?._id || doctorId}`} className="w-full sm:w-auto">
            <Button variant="ghost" size="md" className="w-full sm:w-auto">
              Change Slot
            </Button>
          </Link>
          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={bookingLoading}
            className="w-full sm:w-auto shadow-md"
            icon={Calendar}
          >
            Confirm Appointment
          </Button>
        </div>
      </form>
    </div>
  );
};

export default BookAppointmentPage;
