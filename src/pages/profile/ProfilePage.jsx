import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Calendar, 
  Phone, 
  ShieldCheck, 
  Edit3, 
  Check, 
  Lock, 
  FileText,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import userService from '../../services/userService';
import Input from '../../components/Input';
import Select from '../../components/Select';
import Button from '../../components/Button';
import Badge from '../../components/Badge';
import LoadingState from '../../components/LoadingState';
import Alert from '../../components/Alert';
import { useToast } from '../../context/ToastContext';

const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    dateOfBirth: '',
    gender: '',
    phone: '',
    // Optional / future scope fields (contract safe)
    bloodGroup: '',
    emergencyContact: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        dateOfBirth: user.dateOfBirth || '',
        gender: user.gender || '',
        phone: user.phone || '',
        bloodGroup: user.bloodGroup || '',
        emergencyContact: user.emergencyContact || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Send supported backend contract fields
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        phone: formData.phone.trim(),
      };

      const updated = await userService.updateProfile(payload);
      updateProfile(updated);
      setIsEditing(false);
      showToast('Profile updated successfully!', 'success');
    } catch (err) {
      console.error('Update profile error:', err);
      showToast(err.message || 'Unable to update profile.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <span className="text-xs font-semibold text-primary uppercase tracking-wider block mb-1">
            Patient Identity & Records
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
            Patient Profile
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Manage your personal identity credentials and consultation contact details.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {!isEditing ? (
            <Button
              variant="outline"
              size="md"
              onClick={() => setIsEditing(true)}
              icon={Edit3}
            >
              Edit Profile
            </Button>
          ) : (
            <Button
              variant="secondary"
              size="md"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </Button>
          )}

          <Link to="/settings">
            <Button variant="ghost" size="md" icon={Lock}>
              Security Settings
            </Button>
          </Link>
        </div>
      </div>

      {/* Patient Avatar Card */}
      <div className="bg-white rounded-3xl border border-border p-6 sm:p-8 shadow-card flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <div className="relative">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=256'}
            alt={user?.name || 'Patient'}
            className="w-24 h-24 rounded-2xl object-cover border-2 border-border shadow-subtle"
          />
          <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-sm">
            <ShieldCheck className="w-5 h-5 text-success" />
          </div>
        </div>

        <div className="text-center sm:text-left flex-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
            <h2 className="text-xl font-bold text-text-primary">{user?.name}</h2>
            <Badge variant="primary" size="sm">
              Verified Patient
            </Badge>
          </div>
          <p className="text-sm text-text-secondary mb-3">{user?.email}</p>
          <div className="text-xs text-text-muted">
            Patient ID: <span className="font-mono text-text-primary font-semibold">{user?.id || 'usr_001'}</span>
          </div>
        </div>
      </div>

      {/* Profile Form (Backend Contract Supported Fields) */}
      <form onSubmit={handleSaveProfile} className="space-y-6">
        <div className="bg-white rounded-3xl border border-border p-6 sm:p-8 shadow-card space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-border">
            <h3 className="text-base font-bold text-text-primary tracking-tight">
              Personal Information
            </h3>
            <span className="text-xs text-text-muted">
              Primary identification for clinical bookings
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Input
              label="Full Legal Name"
              name="name"
              required
              disabled={!isEditing}
              value={formData.name}
              onChange={handleChange}
              icon={User}
            />

            <Input
              label="Email Address"
              name="email"
              type="email"
              required
              disabled={!isEditing}
              value={formData.email}
              onChange={handleChange}
              icon={Mail}
            />

            <Input
              label="Date of Birth"
              name="dateOfBirth"
              type="date"
              required
              disabled={!isEditing}
              value={formData.dateOfBirth}
              onChange={handleChange}
              icon={Calendar}
            />

            <Select
              label="Gender"
              name="gender"
              required
              disabled={!isEditing}
              value={formData.gender}
              onChange={handleChange}
              options={[
                { value: 'Female', label: 'Female' },
                { value: 'Male', label: 'Male' },
                { value: 'Non-binary', label: 'Non-binary' },
                { value: 'Prefer not to say', label: 'Prefer not to say' },
              ]}
            />

            <div className="sm:col-span-2">
              <Input
                label="Phone Number"
                name="phone"
                placeholder="+1 (555) 000-0000"
                disabled={!isEditing}
                value={formData.phone}
                onChange={handleChange}
                icon={Phone}
                helperText="Used strictly for consultation SMS reminders and clinic notifications."
              />
            </div>
          </div>

          {isEditing && (
            <div className="pt-4 border-t border-border flex justify-end gap-3">
              <Button
                variant="outline"
                size="md"
                onClick={() => setIsEditing(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={loading}
                icon={Check}
              >
                Save Changes
              </Button>
            </div>
          )}
        </div>

        {/* Optional / Future Scope Section (Strict API Contract Adherence) */}
        <div className="bg-white rounded-3xl border border-border p-6 sm:p-8 shadow-card space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-border">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-text-primary tracking-tight">
                  Additional Clinical Details
                </h3>
                <Badge variant="neutral" size="sm">
                  Optional / Future Scope
                </Badge>
              </div>
              <p className="text-xs text-text-muted mt-0.5">
                These fields are reserved for future medical records integrations and do not affect current bookings.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Input
              label="Blood Group (Optional)"
              name="bloodGroup"
              placeholder="e.g. O+"
              disabled={!isEditing}
              value={formData.bloodGroup}
              onChange={handleChange}
            />

            <Input
              label="Emergency Contact Number (Optional)"
              name="emergencyContact"
              placeholder="+1 (555) 000-0000"
              disabled={!isEditing}
              value={formData.emergencyContact}
              onChange={handleChange}
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProfilePage;
