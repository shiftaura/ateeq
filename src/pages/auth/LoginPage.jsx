import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, LogIn, Sparkles, AlertCircle, Info } from 'lucide-react';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Alert from '../../components/Alert';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { validateLoginForm } from '../../utils/validation';
import { DEMO_CREDENTIALS } from '../../mock/users';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isMockMode } = useAuth();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState(null);

  const from = location.state?.from?.pathname || '/dashboard';

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Clear field-specific error
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError(null);

    const validation = validateLoginForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsLoading(true);
    try {
      await login(formData.email, formData.password);
      showToast('Welcome back! Signed in successfully.', 'success');
      navigate(from, { replace: true });
    } catch (err) {
      console.error('Login error:', err);
      const errMsg = err.message || 'Invalid email or password';
      setServerError(errMsg);
      showToast(errMsg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Demo user autofill (VISIBLE ONLY WHEN isMockMode is true)
  const handleFillDemoUser = () => {
    setFormData({
      email: DEMO_CREDENTIALS.email,
      password: DEMO_CREDENTIALS.password,
      rememberMe: true,
    });
    setErrors({});
    setServerError(null);
  };

  return (
    <div className="bg-white rounded-2xl border border-border p-6 sm:p-8 shadow-card">
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight">
          Sign In to MediConsult
        </h2>
        <p className="text-xs sm:text-sm text-text-secondary mt-1">
          Access your clinical companion, symptom records, and appointments.
        </p>
      </div>

      {serverError && (
        <Alert type="danger" className="mb-5" onDismiss={() => setServerError(null)}>
          {serverError}
        </Alert>
      )}

      {/* Demo helper banner ONLY when VITE_USE_MOCK=true */}
      {isMockMode && (
        <div className="mb-5 p-3.5 bg-blue-50/80 border border-blue-200 rounded-xl flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-blue-900">
            <Sparkles className="w-4 h-4 text-primary flex-shrink-0" />
            <span>
              <strong>Demo Mode:</strong> {DEMO_CREDENTIALS.email} / {DEMO_CREDENTIALS.password}
            </span>
          </div>
          <button
            type="button"
            onClick={handleFillDemoUser}
            className="text-xs font-semibold text-primary hover:text-primary-dark underline cursor-pointer flex-shrink-0"
          >
            Fill Demo Login
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
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

        {/* Password */}
        <Input
          label="Password"
          id="password"
          name="password"
          type={showPassword ? 'text' : 'password'}
          placeholder="••••••••"
          autoComplete="current-password"
          required
          icon={Lock}
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          rightElement={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-text-muted hover:text-text-primary focus:outline-none p-1"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          }
        />

        {/* Remember me and Forgot password */}
        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
              className="w-4 h-4 rounded border-border text-primary focus:ring-primary focus:ring-offset-0"
            />
            <span className="text-xs text-text-secondary font-medium">Remember me</span>
          </label>

          <Link
            to="/forgot-password"
            className="text-xs font-medium text-primary hover:text-primary-dark transition-colors"
          >
            Forgot password?
          </Link>
        </div>

        {/* Submit */}
        <Button
          type="submit"
          variant="primary"
          size="md"
          className="w-full mt-2"
          isLoading={isLoading}
          icon={LogIn}
        >
          Sign In
        </Button>

        {/* Continue with Google (Visual only, properly disabled without fake authentication) */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-text-muted">Or continue with</span>
          </div>
        </div>

        <div>
          <button
            type="button"
            disabled
            className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 border border-border rounded-lg text-xs font-medium text-slate-400 bg-slate-50 cursor-not-allowed select-none"
            title="Google sign-in will be available after OAuth configuration."
          >
            <svg className="w-4 h-4 opacity-50" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
              />
              <path
                fill="#4285F4"
                d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
              />
              <path
                fill="#FBBC05"
                d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.1-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15.2c0 2.8.7 5.5 1.9 7.8l3.7-2.9c-.2-.7-.4-1.5-.4-2.3z"
              />
              <path
                fill="#34A853"
                d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2-6.4-4.8L1.9 17C3.7 20.7 7.5 23.5 12 23.5z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>
          <p className="text-[11px] text-text-muted text-center mt-1.5 flex items-center justify-center gap-1">
            <Info className="w-3 h-3" />
            <span>Google sign-in will be available after OAuth configuration.</span>
          </p>
        </div>
      </form>

      {/* Bottom link */}
      <div className="mt-6 pt-5 border-t border-border text-center">
        <p className="text-xs text-text-secondary">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-primary hover:text-primary-dark">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
