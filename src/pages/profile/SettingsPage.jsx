import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Lock, 
  Bell, 
  Shield, 
  Eye, 
  LogOut, 
  Check, 
  Smartphone, 
  Moon, 
  Sun,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Alert from '../../components/Alert';

const SettingsPage = () => {
  const { logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [pwdLoading, setPwdLoading] = useState(false);

  // Notification toggles
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsReminders, setSmsReminders] = useState(true);
  const [healthTips, setHealthTips] = useState(false);

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      showToast('Please provide both current and new passwords.', 'warning');
      return;
    }
    if (newPassword.length < 6) {
      showToast('New password must be at least 6 characters long.', 'warning');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      showToast('New passwords do not match.', 'error');
      return;
    }

    setPwdLoading(true);
    setTimeout(() => {
      setPwdLoading(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      showToast('Password updated successfully.', 'success');
    }, 600);
  };

  const handleLogout = () => {
    logout();
    showToast('Signed out of patient portal.', 'info');
    navigate('/login');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div>
        <span className="text-xs font-semibold text-primary uppercase tracking-wider block mb-1">
          Preferences & Security
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
          Account Settings
        </h1>
        <p className="text-sm text-text-secondary mt-1">
          Configure security credentials, notification channels, and privacy preferences.
        </p>
      </div>

      {/* Security & Password Section */}
      <div className="bg-white rounded-3xl border border-border p-6 sm:p-8 shadow-card space-y-6">
        <div className="flex items-center gap-2.5 pb-4 border-b border-border">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-primary flex items-center justify-center">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-text-primary">Change Password</h2>
            <p className="text-xs text-text-muted">Ensure your account uses a secure credentials sequence</p>
          </div>
        </div>

        <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-md">
          <Input
            label="Current Password"
            type="password"
            placeholder="••••••••"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />

          <Input
            label="New Password"
            type="password"
            placeholder="Minimum 6 characters"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <Input
            label="Confirm New Password"
            type="password"
            placeholder="Re-enter new password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
          />

          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={pwdLoading}
          >
            Update Password
          </Button>
        </form>
      </div>

      {/* Notification Preferences */}
      <div className="bg-white rounded-3xl border border-border p-6 sm:p-8 shadow-card space-y-6">
        <div className="flex items-center gap-2.5 pb-4 border-b border-border">
          <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal flex items-center justify-center">
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-text-primary">Notifications</h2>
            <p className="text-xs text-text-muted">Manage communication channels for consultations</p>
          </div>
        </div>

        <div className="space-y-4 divide-y divide-border">
          <div className="flex items-center justify-between pt-2">
            <div>
              <h4 className="text-sm font-semibold text-text-primary">Email Notifications</h4>
              <p className="text-xs text-text-muted">Receive digital confirmation tickets and clinic appointment reminders</p>
            </div>
            <input
              type="checkbox"
              checked={emailAlerts}
              onChange={() => setEmailAlerts(!emailAlerts)}
              className="w-4 h-4 rounded border-border text-primary focus:ring-primary cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between pt-4">
            <div>
              <h4 className="text-sm font-semibold text-text-primary">SMS Alerts</h4>
              <p className="text-xs text-text-muted">Urgent schedule notifications sent 2 hours before doctor appointments</p>
            </div>
            <input
              type="checkbox"
              checked={smsReminders}
              onChange={() => setSmsReminders(!smsReminders)}
              className="w-4 h-4 rounded border-border text-primary focus:ring-primary cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between pt-4">
            <div>
              <h4 className="text-sm font-semibold text-text-primary">General Health Bulletins</h4>
              <p className="text-xs text-text-muted">Seasonal infection advisories and preventive wellness articles</p>
            </div>
            <input
              type="checkbox"
              checked={healthTips}
              onChange={() => setHealthTips(!healthTips)}
              className="w-4 h-4 rounded border-border text-primary focus:ring-primary cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Privacy & Session Controls */}
      <div className="bg-white rounded-3xl border border-border p-6 sm:p-8 shadow-card space-y-6">
        <div className="flex items-center gap-2.5 pb-4 border-b border-border">
          <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-text-primary">Session & Privacy</h2>
            <p className="text-xs text-text-muted">Manage active device session and sign out</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-semibold text-text-primary">Sign Out of Account</h4>
            <p className="text-xs text-text-muted">Ends the current browser session securely.</p>
          </div>

          <Button
            variant="danger"
            size="md"
            onClick={handleLogout}
            icon={LogOut}
          >
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
