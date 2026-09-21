import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Plus, Clock, Stethoscope, AlertTriangle } from 'lucide-react';
import appointmentService from '../../services/appointmentService';
import AppointmentCard from '../../components/AppointmentCard';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import Textarea from '../../components/Textarea';
import Input from '../../components/Input';
import Select from '../../components/Select';
import LoadingState from '../../components/LoadingState';
import EmptyState from '../../components/EmptyState';
import ErrorState from '../../components/ErrorState';
import { useToast } from '../../context/ToastContext';

const MyAppointmentsPage = () => {
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming' | 'completed' | 'cancelled'
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cancellation Modal State
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedForCancel, setSelectedForCancel] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelLoading, setCancelLoading] = useState(false);

  // Reschedule Modal State
  const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false);
  const [selectedForReschedule, setSelectedForReschedule] = useState(null);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleTime, setRescheduleTime] = useState('10:00 AM');
  const [rescheduleLoading, setRescheduleLoading] = useState(false);

  const fetchAppointments = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await appointmentService.getAppointments();
      setAppointments(data);
    } catch (err) {
      console.error('Error fetching appointments:', err);
      setError(err.message || 'Unable to load appointments.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleOpenCancelModal = (apt) => {
    setSelectedForCancel(apt);
    setCancelReason('');
    setCancelModalOpen(true);
  };

  const handleConfirmCancel = async () => {
    if (!selectedForCancel) return;
    setCancelLoading(true);
    try {
      await appointmentService.cancelAppointment(
        selectedForCancel.id,
        cancelReason || 'Cancelled by patient request'
      );
      showToast('Appointment successfully cancelled.', 'info');
      setCancelModalOpen(false);
      fetchAppointments();
    } catch (err) {
      showToast('Failed to cancel appointment. Please try again.', 'error');
    } finally {
      setCancelLoading(false);
    }
  };

  const handleOpenRescheduleModal = (apt) => {
    setSelectedForReschedule(apt);
    setRescheduleDate(apt.date || '2026-09-25');
    setRescheduleTime(apt.time || '10:00 AM');
    setRescheduleModalOpen(true);
  };

  const handleConfirmReschedule = async () => {
    if (!selectedForReschedule) return;
    setRescheduleLoading(true);
    try {
      await appointmentService.rescheduleAppointment(selectedForReschedule.id, {
        date: rescheduleDate,
        time: rescheduleTime
      });
      showToast('Appointment successfully rescheduled.', 'success');
      setRescheduleModalOpen(false);
      fetchAppointments();
    } catch (err) {
      showToast('Failed to reschedule appointment. Please try again.', 'error');
    } finally {
      setRescheduleLoading(false);
    }
  };

  const filteredAppointments = appointments.filter((apt) => {
    if (activeTab === 'upcoming') return apt.status === 'upcoming';
    if (activeTab === 'completed') return apt.status === 'completed';
    if (activeTab === 'cancelled') return apt.status === 'cancelled';
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <span className="text-xs font-semibold text-primary uppercase tracking-wider block mb-1">
            Clinical Care Calendar
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
            My Appointments
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Track confirmed medical visits, past consultations, and cancellations.
          </p>
        </div>

        <Link to="/doctors">
          <Button variant="primary" size="md" icon={Plus}>
            Book New Consultation
          </Button>
        </Link>
      </div>

      {/* Tabs */}
      <div className="border-b border-border flex items-center gap-6">
        {[
          { id: 'upcoming', label: 'Upcoming Consultations' },
          { id: 'completed', label: 'Past & Completed' },
          { id: 'cancelled', label: 'Cancelled' },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3.5 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
                isActive
                  ? 'border-primary text-primary'
                  : 'border-transparent text-text-secondary hover:text-text-primary hover:border-slate-300'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content Area */}
      <div>
        {loading ? (
          <LoadingState message="Loading your appointments..." description="Retrieving schedules from verified clinics." />
        ) : error ? (
          <ErrorState message={error} onRetry={fetchAppointments} />
        ) : filteredAppointments.length === 0 ? (
          <EmptyState
            icon={Calendar}
            title={
              activeTab === 'upcoming'
                ? 'No upcoming appointments scheduled'
                : activeTab === 'completed'
                ? 'No past consultations on record'
                : 'No cancelled appointments'
            }
            description={
              activeTab === 'upcoming'
                ? 'You do not have any active appointments with doctors at this moment.'
                : 'Your consultation history will appear here once visits are concluded.'
            }
            actionLabel={activeTab === 'upcoming' ? 'Browse Available Doctors' : undefined}
            actionLink="/doctors"
          />
        ) : (
          <div className="space-y-4">
            {filteredAppointments.map((apt) => (
              <AppointmentCard
                key={apt.id}
                appointment={apt}
                onCancel={handleOpenCancelModal}
                onReschedule={handleOpenRescheduleModal}
              />
            ))}
          </div>
        )}
      </div>

      {/* Cancel Appointment Modal */}
      <Modal
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        title="Cancel Scheduled Appointment"
      >
        <div className="space-y-4">
          <p className="text-sm text-text-secondary leading-relaxed">
            Are you sure you want to cancel your consultation with{' '}
            <strong className="text-text-primary">{selectedForCancel?.doctorName}</strong> on{' '}
            <strong>{selectedForCancel?.date}</strong>?
          </p>

          <Textarea
            label="Reason for Cancellation (Optional)"
            placeholder="Please let the clinic know why you are cancelling..."
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            rows={3}
          />

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCancelModalOpen(false)}
              disabled={cancelLoading}
            >
              Keep Appointment
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handleConfirmCancel}
              isLoading={cancelLoading}
            >
              Confirm Cancellation
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
          <p className="text-sm text-text-secondary leading-relaxed">
            Select a new date and time for your consultation with{' '}
            <strong className="text-text-primary">{selectedForReschedule?.doctorName}</strong>:
          </p>

          <div className="space-y-3">
            <Input
              label="New Appointment Date"
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
                { value: '03:30 PM', label: '03:30 PM' },
              ]}
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setRescheduleModalOpen(false)}
              disabled={rescheduleLoading}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleConfirmReschedule}
              isLoading={rescheduleLoading}
            >
              Confirm New Schedule
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default MyAppointmentsPage;
