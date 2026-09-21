import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Mail, 
  Phone, 
  ArrowLeft, 
  FileText, 
  CheckCircle2, 
  AlertCircle,
  FileCheck,
  Building
} from 'lucide-react';
import appointmentService from '../../services/appointmentService';
import Button from '../../components/Button';
import Badge from '../../components/Badge';
import Modal from '../../components/Modal';
import Textarea from '../../components/Textarea';
import Input from '../../components/Input';
import Select from '../../components/Select';
import LoadingState from '../../components/LoadingState';
import ErrorState from '../../components/ErrorState';
import { formatDate } from '../../utils/dateUtils';
import { useToast } from '../../context/ToastContext';

const AppointmentDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cancellation modal
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelLoading, setCancelLoading] = useState(false);

  // Reschedule modal
  const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleTime, setRescheduleTime] = useState('10:00 AM');
  const [rescheduleLoading, setRescheduleLoading] = useState(false);

  const fetchAppointment = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await appointmentService.getAppointmentById(id);
      setAppointment(data);
      setRescheduleDate(data.date);
      setRescheduleTime(data.time);
    } catch (err) {
      console.error('Error fetching appointment:', err);
      setError(err.message || 'Unable to load appointment details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointment();
  }, [id]);

  const handleConfirmCancel = async () => {
    setCancelLoading(true);
    try {
      await appointmentService.cancelAppointment(appointment.id, cancelReason || 'Cancelled by patient');
      showToast('Appointment successfully cancelled.', 'info');
      setCancelModalOpen(false);
      fetchAppointment();
    } catch (err) {
      showToast('Failed to cancel appointment.', 'error');
    } finally {
      setCancelLoading(false);
    }
  };

  const handleConfirmReschedule = async () => {
    setRescheduleLoading(true);
    try {
      await appointmentService.rescheduleAppointment(appointment.id, {
        date: rescheduleDate,
        time: rescheduleTime
      });
      showToast('Appointment successfully rescheduled.', 'success');
      setRescheduleModalOpen(false);
      fetchAppointment();
    } catch (err) {
      showToast('Failed to reschedule appointment.', 'error');
    } finally {
      setRescheduleLoading(false);
    }
  };

  if (loading) {
    return <LoadingState message="Loading consultation ticket..." description="Fetching reservation details." />;
  }

  if (error || !appointment) {
    return (
      <ErrorState
        title="Appointment Not Found"
        message={error || 'The requested appointment record could not be found.'}
        onRetry={() => navigate('/appointments')}
      />
    );
  }

  const statusConfig = {
    upcoming: { variant: 'primary', label: 'Confirmed Upcoming' },
    completed: { variant: 'success', label: 'Completed' },
    cancelled: { variant: 'danger', label: 'Cancelled' },
  };

  const status = statusConfig[appointment.status] || { variant: 'neutral', label: appointment.status };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Back button */}
      <div>
        <Link
          to="/appointments"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-secondary hover:text-text-primary transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to My Appointments</span>
        </Link>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border">
        <div>
          <span className="text-xs font-semibold text-text-muted uppercase tracking-wider block mb-1">
            Appointment Ref: #{appointment.id}
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
            Consultation Details
          </h1>
        </div>

        <Badge variant={status.variant} size="md">
          {status.label}
        </Badge>
      </div>

      {/* Cancelled Banner if cancelled */}
      {appointment.status === 'cancelled' && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-900 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-danger flex-shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm">
            <strong>Appointment Cancelled:</strong> {appointment.cancellationReason || 'Cancelled upon patient request.'}
          </div>
        </div>
      )}

      {/* Doctor Summary Card */}
      <div className="bg-white rounded-3xl border border-border p-6 sm:p-8 shadow-card flex flex-col sm:flex-row items-start justify-between gap-6">
        <div className="flex items-start gap-5">
          <img
            src={appointment.doctorAvatar}
            alt={appointment.doctorName}
            className="w-20 h-20 rounded-2xl object-cover border border-border shadow-subtle flex-shrink-0"
          />
          <div>
            <span className="text-xs font-semibold text-teal block mb-0.5">
              {appointment.specialization}
            </span>
            <h2 className="text-xl font-bold text-text-primary mb-1">
              {appointment.doctorName}
            </h2>
            <div className="flex items-center gap-1.5 text-xs text-text-muted mb-2">
              <Building className="w-3.5 h-3.5 text-text-muted" />
              <span>{appointment.hospital}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-text-secondary">
              <MapPin className="w-3.5 h-3.5 text-text-muted" />
              <span>{appointment.clinicAddress}</span>
            </div>
          </div>
        </div>

        <div className="text-left sm:text-right pt-4 sm:pt-0 border-t sm:border-t-0 border-border w-full sm:w-auto">
          <span className="text-xs text-text-muted block">Fee Due at Clinic</span>
          <span className="text-xl font-bold text-text-primary">{appointment.fee || '$60'}</span>
        </div>
      </div>

      {/* Schedule & Patient Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Schedule Box */}
        <div className="bg-white rounded-3xl border border-border p-6 shadow-card space-y-4">
          <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider">
            Schedule & Time
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-text-muted flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                Date:
              </span>
              <strong className="text-text-primary">{formatDate(appointment.date)}</strong>
            </div>

            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-text-muted flex items-center gap-2">
                <Clock className="w-4 h-4 text-teal" />
                Time Slot:
              </span>
              <strong className="text-text-primary">{appointment.time}</strong>
            </div>

            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-text-muted">Booking Status:</span>
              <span className="font-semibold capitalize text-text-primary">{appointment.status}</span>
            </div>
          </div>
        </div>

        {/* Patient Box */}
        <div className="bg-white rounded-3xl border border-border p-6 shadow-card space-y-4">
          <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider">
            Patient Information
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-text-muted flex items-center gap-2">
                <User className="w-4 h-4 text-slate-400" />
                Name:
              </span>
              <span className="font-medium text-text-primary">{appointment.patientName}</span>
            </div>

            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-text-muted flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-400" />
                Email:
              </span>
              <span className="font-medium text-text-primary truncate max-w-[180px]">{appointment.patientEmail}</span>
            </div>

            {appointment.patientPhone && (
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="text-text-muted flex items-center gap-2">
                  <Phone className="w-4 h-4 text-slate-400" />
                  Phone:
                </span>
                <span className="font-medium text-text-primary">{appointment.patientPhone}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Consultation Reason */}
      <div className="bg-white rounded-3xl border border-border p-6 sm:p-8 shadow-card space-y-3">
        <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider">
          Reported Reason for Consultation
        </h3>
        <p className="text-sm text-text-secondary leading-relaxed bg-slate-50 p-4 rounded-xl border border-border">
          {appointment.reason || 'No specific symptoms entered at booking.'}
        </p>
      </div>

      {/* CONDITIONAL CONSULTATION NOTES (Strict user requirement: only rendered if provided by API) */}
      {appointment.consultationNotes && (
        <div className="bg-white rounded-3xl border border-teal-200 p-6 sm:p-8 shadow-card space-y-3 bg-teal-50/20">
          <div className="flex items-center gap-2 text-teal">
            <FileCheck className="w-5 h-5" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-teal-900">
              Doctor Consultation Notes
            </h3>
          </div>
          <p className="text-sm text-text-secondary leading-relaxed bg-white p-4 rounded-xl border border-teal-100">
            {appointment.consultationNotes}
          </p>
          <span className="text-[11px] text-text-muted block">
            Official summary provided following clinical examination.
          </span>
        </div>
      )}

      {/* Bottom Actions */}
      {appointment.status === 'upcoming' && (
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-border">
          <Button
            variant="ghost"
            size="md"
            className="text-danger hover:bg-red-50 hover:text-danger-dark"
            onClick={() => setCancelModalOpen(true)}
          >
            Cancel Appointment
          </Button>

          <Button
            variant="outline"
            size="md"
            onClick={() => setRescheduleModalOpen(true)}
          >
            Reschedule Consultation
          </Button>
        </div>
      )}

      {/* Cancel Modal */}
      <Modal
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        title="Cancel Appointment"
      >
        <div className="space-y-4">
          <p className="text-sm text-text-secondary">
            Are you sure you want to cancel this appointment with {appointment.doctorName}?
          </p>
          <Textarea
            label="Cancellation Reason"
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            rows={3}
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => setCancelModalOpen(false)}>
              Keep
            </Button>
            <Button variant="danger" size="sm" onClick={handleConfirmCancel} isLoading={cancelLoading}>
              Confirm Cancel
            </Button>
          </div>
        </div>
      </Modal>

      {/* Reschedule Modal */}
      <Modal
        isOpen={rescheduleModalOpen}
        onClose={() => setRescheduleModalOpen(false)}
        title="Reschedule Appointment"
      >
        <div className="space-y-4">
          <Input
            label="New Date"
            type="date"
            value={rescheduleDate}
            onChange={(e) => setRescheduleDate(e.target.value)}
          />
          <Select
            label="New Time Slot"
            value={rescheduleTime}
            onChange={(e) => setRescheduleTime(e.target.value)}
            options={[
              { value: '09:30 AM', label: '09:30 AM' },
              { value: '10:00 AM', label: '10:00 AM' },
              { value: '10:30 AM', label: '10:30 AM' },
              { value: '11:00 AM', label: '11:00 AM' },
              { value: '02:00 PM', label: '02:00 PM' },
            ]}
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => setRescheduleModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleConfirmReschedule} isLoading={rescheduleLoading}>
              Save New Schedule
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AppointmentDetailPage;
