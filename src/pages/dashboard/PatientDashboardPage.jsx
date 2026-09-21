import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Activity, 
  Stethoscope, 
  Calendar, 
  Clock, 
  FileText, 
  ArrowRight, 
  Bell, 
  ChevronRight,
  ShieldAlert,
  Sparkles,
  MapPin
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import userService from '../../services/userService';
import appointmentService from '../../services/appointmentService';
import Button from '../../components/Button';
import Badge from '../../components/Badge';
import UrgencyBadge from '../../components/UrgencyBadge';
import LoadingState from '../../components/LoadingState';
import ErrorState from '../../components/ErrorState';
import { getGreeting, formatDate } from '../../utils/dateUtils';

const PatientDashboardPage = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await userService.getDashboardData();
      setDashboardData(data);
    } catch (err) {
      console.error('Error fetching dashboard:', err);
      setError(err.message || 'Unable to load your dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return <LoadingState message="Loading your health portal..." description="Preparing your personalized consultations and reminders." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchDashboard} />;
  }

  const upcoming = dashboardData?.upcomingAppointment;
  const recentCheck = dashboardData?.recentSymptomCheck;

  return (
    <div className="space-y-8">
      {/* Header Greeting */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
        <div>
          <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
            Patient Portal Overview
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
            {getGreeting()}, {user?.name?.split(' ')[0] || 'Patient'}
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            How are you feeling today? Check your symptoms or consult a doctor.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/symptoms">
            <Button variant="primary" size="md" icon={Activity}>
              Start Symptom Check
            </Button>
          </Link>
          <Link to="/doctors">
            <Button variant="outline" size="md" icon={Stethoscope}>
              Find a Doctor
            </Button>
          </Link>
        </div>
      </div>

      {/* Primary Symptom Guidance Card */}
      <div className="bg-gradient-to-r from-blue-900 via-primary-dark to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-card relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-blue-200 text-xs font-medium mb-4 backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 text-teal-light" />
            <span>AI-Assisted Symptom Analysis</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold tracking-tight mb-2">
            Not feeling well? Check your symptoms in simple language.
          </h2>

          <p className="text-sm text-blue-100/90 leading-relaxed mb-6">
            Describe how you are feeling, understand potential patterns, and receive clear safety guidance on when to seek in-person clinical care.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Link to="/symptoms">
              <Button variant="teal" size="md" icon={Activity}>
                Check Symptoms Now
              </Button>
            </Link>
            <span className="text-xs text-blue-200/80">
              Takes ~2 minutes • Confidential assessment
            </span>
          </div>
        </div>
      </div>

      {/* Quick Action Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Check Symptoms', desc: 'Report discomfort', icon: Activity, to: '/symptoms', color: 'text-primary bg-blue-50' },
          { label: 'Find a Doctor', desc: 'Browse specialists', icon: Stethoscope, to: '/doctors', color: 'text-teal bg-teal-50' },
          { label: 'My Appointments', desc: 'Manage visits', icon: Calendar, to: '/appointments', color: 'text-indigo-600 bg-indigo-50' },
          { label: 'Medical History', desc: 'Past records', icon: FileText, to: '/medical-history', color: 'text-emerald-700 bg-emerald-50' },
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <Link
              key={idx}
              to={item.to}
              className="bg-white rounded-2xl border border-border p-4 sm:p-5 shadow-subtle hover:shadow-card hover:border-slate-300 transition-all flex flex-col justify-between group"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${item.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-text-primary group-hover:text-primary transition-colors">
                  {item.label}
                </h3>
                <p className="text-xs text-text-muted mt-0.5">
                  {item.desc}
                </p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Dashboard Main Grid: Upcoming Appointment & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Upcoming Consultation (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-text-primary tracking-tight">
              Upcoming Consultation
            </h2>
            <Link
              to="/appointments"
              className="text-xs font-semibold text-primary hover:text-primary-dark transition-colors inline-flex items-center gap-1"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {upcoming ? (
            <div className="bg-white rounded-2xl border border-border p-6 shadow-card">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
                <div className="flex items-center gap-4">
                  <img
                    src={upcoming.doctorAvatar}
                    alt={upcoming.doctorName}
                    className="w-14 h-14 rounded-xl object-cover border border-border shadow-subtle"
                  />
                  <div>
                    <h3 className="text-base font-semibold text-text-primary">
                      {upcoming.doctorName}
                    </h3>
                    <p className="text-xs sm:text-sm text-text-secondary font-medium">
                      {upcoming.specialization}
                    </p>
                    <div className="flex items-center gap-1.5 text-xs text-text-muted mt-1">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{upcoming.hospital}</span>
                    </div>
                  </div>
                </div>

                <Badge variant="primary" size="sm">
                  Confirmed
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 py-4 border-b border-border bg-slate-50/50 rounded-xl px-4 my-4">
                <div>
                  <span className="text-[11px] text-text-muted uppercase font-semibold block">Date</span>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-text-primary mt-0.5">
                    <Calendar className="w-3.5 h-3.5 text-primary" />
                    <span>{formatDate(upcoming.date)}</span>
                  </div>
                </div>
                <div>
                  <span className="text-[11px] text-text-muted uppercase font-semibold block">Time Slot</span>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-text-primary mt-0.5">
                    <Clock className="w-3.5 h-3.5 text-teal" />
                    <span>{upcoming.time}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="text-xs text-text-secondary truncate max-w-xs">
                  <strong>Reason: </strong> {upcoming.reason}
                </div>
                <Link to={`/appointments/${upcoming.id}`}>
                  <Button variant="ghost" size="sm" className="text-primary hover:text-primary-dark">
                    Details →
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-dashed border-border p-8 text-center">
              <Calendar className="w-8 h-8 text-text-muted mx-auto mb-2" />
              <p className="text-sm font-semibold text-text-primary mb-1">
                No upcoming appointments
              </p>
              <p className="text-xs text-text-secondary mb-4">
                Consult with verified doctors whenever you experience persistent symptoms.
              </p>
              <Link to="/doctors">
                <Button variant="outline" size="sm">
                  Browse Available Doctors
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Right Column: Recent Health Assessment (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-text-primary tracking-tight">
              Recent Symptom Check
            </h2>
            <Link
              to="/medical-history"
              className="text-xs font-semibold text-primary hover:text-primary-dark transition-colors inline-flex items-center gap-1"
            >
              <span>History</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentCheck ? (
            <div className="bg-white rounded-2xl border border-border p-6 shadow-card space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-text-muted font-medium">
                  Assessed {formatDate(recentCheck.createdAt)}
                </span>
                <UrgencyBadge level={recentCheck.urgencyLevel} size="sm" />
              </div>

              <div>
                <span className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider block mb-1.5">
                  Reported Symptoms
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {recentCheck.symptoms.map((s, i) => (
                    <span
                      key={i}
                      className="text-xs bg-slate-100 text-slate-800 px-2.5 py-1 rounded-md font-medium"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50/70 border border-blue-100 rounded-xl p-3.5 text-xs text-text-secondary leading-relaxed">
                <strong className="text-primary block mb-0.5">Primary Guidance:</strong>
                {recentCheck.urgencyDescription}
              </div>

              <div className="pt-2 border-t border-border flex justify-end">
                <Link to={`/symptoms/result/${recentCheck.id}`}>
                  <Button variant="ghost" size="sm" className="text-primary hover:text-primary-dark p-0">
                    View Assessment Result →
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-dashed border-border p-8 text-center">
              <Activity className="w-8 h-8 text-text-muted mx-auto mb-2" />
              <p className="text-sm font-semibold text-text-primary mb-1">
                No recent symptom checks
              </p>
              <p className="text-xs text-text-secondary mb-4">
                Record your symptoms to generate helpful health patterns.
              </p>
              <Link to="/symptoms">
                <Button variant="primary" size="sm">
                  Run First Check
                </Button>
              </Link>
            </div>
          )}

          {/* Quick Safety Reminder Note */}
          <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900 leading-relaxed">
              <strong>Health Reminder:</strong> If symptoms change rapidly or severe pain develops, do not wait for online analysis. Contact your local urgent care center.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboardPage;
