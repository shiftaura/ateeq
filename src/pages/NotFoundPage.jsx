import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Activity, Stethoscope, ArrowLeft } from 'lucide-react';
import Button from '../components/Button';

const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-16">
      <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center mb-6 text-primary shadow-subtle">
        <span className="text-2xl font-bold font-mono">404</span>
      </div>

      <h1 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight mb-2">
        Page Not Found
      </h1>

      <p className="text-sm text-text-secondary max-w-md mb-8 leading-relaxed">
        The healthcare page or record you are searching for does not exist, has been moved, or is temporarily unavailable.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link to="/dashboard">
          <Button variant="primary" size="md" icon={Home}>
            Patient Dashboard
          </Button>
        </Link>
        <Link to="/symptoms">
          <Button variant="outline" size="md" icon={Activity}>
            Check Symptoms
          </Button>
        </Link>
        <Link to="/doctors">
          <Button variant="secondary" size="md" icon={Stethoscope}>
            Find Doctors
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
