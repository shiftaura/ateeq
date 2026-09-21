import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2, Send, Info } from 'lucide-react';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Alert from '../../components/Alert';
import authService from '../../services/authService';
import { isMockMode } from '../../services/api';
import { isValidEmail } from '../../utils/validation';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Please enter your email address');
      return;
    }

    if (!isValidEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    try {
      const res = await authService.forgotPassword(email);
      setSuccessMessage(res.message || 'Password reset link sent successfully.');
      setIsSuccess(true);
    } catch (err) {
      setError(err.message || 'Unable to process reset request. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-border p-6 sm:p-8 shadow-card">
      {!isSuccess ? (
        <>
          <div className="mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight">
              Reset your password
            </h2>
            <p className="text-xs sm:text-sm text-text-secondary mt-1">
              Enter your registered email address and we'll send you instructions to reset your account password.
            </p>
          </div>

          {error && (
            <Alert type="danger" className="mb-5" onDismiss={() => setError('')}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <Input
              label="Email Address"
              id="reset-email"
              type="email"
              placeholder="name@example.com"
              required
              icon={Mail}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError('');
              }}
              error={error}
            />

            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full mt-2"
              isLoading={isLoading}
              icon={Send}
            >
              Send Reset Link
            </Button>
          </form>
        </>
      ) : (
        <div className="text-center py-4">
          <div className="w-12 h-12 rounded-full bg-green-50 text-success border border-green-200 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold text-text-primary mb-2">
            Reset Link Processed
          </h3>
          <p className="text-xs sm:text-sm text-text-secondary mb-4 leading-relaxed">
            {successMessage}
          </p>
          {isMockMode && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 mb-6 flex items-start gap-2 text-left">
              <Info className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
              <span>
                <strong>Demo / Simulation Notice:</strong> Since mock mode is active, no outbound email was sent over SMTP. In production with backend, an email will be delivered.
              </span>
            </div>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setIsSuccess(false);
              setEmail('');
            }}
            className="w-full mb-3"
          >
            Send Another Request
          </Button>
        </div>
      )}

      <div className="mt-6 pt-5 border-t border-border text-center">
        <Link
          to="/login"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-secondary hover:text-text-primary transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Sign In</span>
        </Link>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
