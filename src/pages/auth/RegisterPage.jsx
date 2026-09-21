import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Calendar, Eye, EyeOff, UserPlus } from 'lucide-react';
import Input from '../../components/Input';
import Select from '../../components/Select';
import Button from '../../components/Button';
import Alert from '../../components/Alert';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { validateRegisterForm } from '../../utils/validation';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    dateOfBirth: '',
    gender: '',
    phone: '',
    agreeTerms: false,
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError(null);

    const validation = validateRegisterForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsLoading(true);
    try {
      const result = await register({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        phone: formData.phone.trim(),
      });

      showToast('Registration successful! Welcome to MediConsult.', 'success');
      if (result?.token) {
        navigate('/dashboard', { replace: true });
      } else {
        navigate('/login', { replace: true });
      }
    } catch (err) {
      console.error('Registration error:', err);
      const errMsg = err.message || 'Registration failed. Please try again.';
      setServerError(errMsg);
      showToast(errMsg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-border p-6 sm:p-8 shadow-card">
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight">
          Create Patient Account
        </h2>
        <p className="text-xs sm:text-sm text-text-secondary mt-1">
          Begin your health journey with tailored guidance and consultation access.
        </p>
      </div>

      {serverError && (
        <Alert type="danger" className="mb-5" onDismiss={() => setServerError(null)}>
          {serverError}
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* Full Name */}
        <Input
          label="Full Legal Name"
          id="name"
          name="name"
          placeholder="e.g. Sarah Jenkins"
          autoComplete="name"
          required
          icon={User}
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
        />

        {/* Email */}
        <Input
          label="Email Address"
          id="email"
          name="email"
          type="email"
          placeholder="name@example.com"
          autoComplete="email"
          required
          icon={Mail}
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
        />

        {/* DOB and Gender */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Date of Birth"
            id="dateOfBirth"
            name="dateOfBirth"
            type="date"
            required
            value={formData.dateOfBirth}
            onChange={handleChange}
            error={errors.dateOfBirth}
          />

          <Select
            label="Gender"
            id="gender"
            name="gender"
            required
            value={formData.gender}
            onChange={handleChange}
            error={errors.gender}
            options={[
              { value: 'female', label: 'Female' },
              { value: 'male', label: 'Male' },
              { value: 'other', label: 'Non-binary' },
              { value: 'other', label: 'Prefer not to say' },
            ]}
          />
        </div>

        {/* Password */}
        <Input
          label="Password"
          id="password"
          name="password"
          type={showPassword ? 'text' : 'password'}
          placeholder="Minimum 6 characters"
          autoComplete="new-password"
          required
          icon={Lock}
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          rightElement={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-text-muted hover:text-text-primary p-1"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          }
        />

        {/* Confirm Password */}
        <Input
          label="Confirm Password"
          id="confirmPassword"
          name="confirmPassword"
          type={showPassword ? 'text' : 'password'}
          placeholder="Re-enter password"
          autoComplete="new-password"
          required
          icon={Lock}
          value={formData.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
        />

        {/* Terms Checkbox */}
        <div className="pt-1">
          <label className="flex items-start gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              name="agreeTerms"
              checked={formData.agreeTerms}
              onChange={handleChange}
              className="mt-0.5 w-4 h-4 rounded border-border text-primary focus:ring-primary focus:ring-offset-0"
            />
            <span className="text-xs text-text-secondary leading-snug">
              I agree to the{' '}
              <span className="text-primary hover:underline cursor-pointer">Terms of Service</span> and{' '}
              <span className="text-primary hover:underline cursor-pointer">Privacy Policy</span>. I understand this platform provides general guidance and not autonomous diagnoses.
            </span>
          </label>
          {errors.agreeTerms && (
            <p className="mt-1 text-xs text-danger font-medium">{errors.agreeTerms}</p>
          )}
        </div>

        {/* Submit */}
        <Button
          type="submit"
          variant="primary"
          size="md"
          className="w-full mt-3"
          isLoading={isLoading}
          icon={UserPlus}
        >
          Create Account
        </Button>
      </form>

      {/* Bottom link */}
      <div className="mt-6 pt-5 border-t border-border text-center">
        <p className="text-xs text-text-secondary">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-primary hover:text-primary-dark">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
