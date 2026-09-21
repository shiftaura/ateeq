import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link, useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Bell, 
  ArrowRight, 
  Home, 
  Stethoscope 
} from 'lucide-react';
import appointmentService from '../../services/appointmentService';
import Button from '../../components/Button';
import Badge from '../../components/Badge';
import LoadingState from '../../components/LoadingState';
import { formatDate } from '../../utils/dateUtils';
import { useToast } from '../../context/ToastContext';

const AppointmentSuccessPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [appointment, setAppointment] = useState(location.state?.appointment || null);
  const [loading, setLoading] = useState(!location.state?.appointment);

  useEffect(() => {
    if (!appointment && id) {
      setLoading(true);
      appointmentService.getAppointmentById(id)
        .then((data) => {
          setAppointment(data);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    }
  }, [id, appointment]);

  const handleAddReminder = () => {
    showToast('Consultation reminder set for 24h and 1h prior to appointment.', 'success');
  };

  if (loading) {
    return <LoadingState message="Finalizing appointment confirmation..." description="Generating your digital appointment ticket." />;
  }

  return (
    <div className="max-w-2xl mx-auto py-8 sm:py-12 px-4">
      <div className="bg-white rounded-3xl border border-border p-6 sm:p-10 shadow-card text-center space-y-6">
        {/* Large Success Icon */}
        <div className="w-16 h-16 rounded-full bg-green-50 border-2 border-green-200 flex items-center justify-center mx-auto text-success shadow-subtle">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div>
          <span className="text-xs font-bold text-success uppercase tracking-wider block mb-1">
            Confirmed & Verified
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
            Appointment Confirmed
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-1 max-w-md mx-auto">
            Your consultation request has been reserved with the doctor's clinic.
          </p>
        </div>

        {/* Confirmed Details Card */}
        {appointment && (
          <div className="bg-slate-50/70 border border-border rounded-2xl p-6 text-left space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div className="flex items-center gap-3">
                <img
                  src={appointment.doctorAvatar}
                  alt={appointment.doctorName}
                  className="w-12 h-12 rounded-xl object-cover border border-border"
                />
                <div>
                  <h3 className="text-sm font-bold text-text-primary">{appointment.doctorName}</h3>
                  <p className="text-xs text-text-secondary">{appointment.specialization}</p>
                </div>
              </div>
              <Badge variant="primary" size="sm">
                Confirmed
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4 py-1">
              <div>
                <span className="text-[11px] text-text-muted uppercase font-semibold block">Date</span>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-text-primary mt-0.5">
                  <Calendar className="w-3.5 h-3.5 text-primary" />
                  <span>{formatDate(appointment.date)}</span>
                </div>
              </div>
              <div>
                <span className="text-[11px] text-text-muted uppercase font-semibold block">Time</span>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-text-primary mt-0.5">
                  <Clock className="w-3.5 h-3.5 text-teal" />
                  <span>{appointment.time}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-border flex items-start gap-2 text-xs text-text-muted">
              <MapPin className="w-3.5 h-3.5 text-text-muted flex-shrink-0 mt-0.5" />
              <span>{appointment.hospital} • {appointment.clinicAddress}</span>
            </div>
          </div>
        )}

        {/* Add reminder button */}
        <div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleAddReminder}
            icon={Bell}
          >
            Add Calendar Reminder
          </Button>
        </div>

        {/* Navigation Action Buttons */}
        <div className="pt-4 border-t border-border flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link to={`/appointments/${id || appointment?.id || ''}`} className="w-full sm:w-auto">
            <Button variant="primary" size="md" className="w-full sm:w-auto shadow-sm">
              View Appointment Ticket
            </Button>
          </Link>
          <Link to="/dashboard" className="w-full sm:w-auto">
            <Button variant="secondary" size="md" icon={Home} className="w-full sm:w-auto">
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AppointmentSuccessPage;
