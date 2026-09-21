import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Activity, ShieldCheck, HeartPulse, Stethoscope, AlertTriangle } from 'lucide-react';

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-surface-bg">
      {/* Left Branding Panel (Desktop) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-900 via-primary-dark to-slate-900 text-white p-12 flex-col justify-between relative overflow-hidden">
        {/* Subtle decorative circles */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-teal/15 blur-3xl pointer-events-none" />

        {/* Brand Header */}
        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white text-primary flex items-center justify-center shadow-md">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white block">
                MediConsult
              </span>
              <span className="text-xs text-blue-200 tracking-wider uppercase font-medium">
                Clinical Guidance Portal
              </span>
            </div>
          </Link>
        </div>

        {/* Central Clinical Value Message */}
        <div className="relative z-10 max-w-md my-auto py-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-blue-200 text-xs font-medium mb-6 backdrop-blur-sm border border-white/10">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-light" />
            <span>AI-Assisted Doctor Consultation</span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-white leading-tight mb-4">
            Your first step toward better-informed healthcare decisions.
          </h1>

          <p className="text-sm text-blue-100/80 leading-relaxed mb-8">
            Access structured symptom assessments, understand urgency tiers, and connect directly with certified medical practitioners when clinical attention is needed.
          </p>

          <div className="space-y-3.5 pt-4 border-t border-white/10 text-xs text-blue-100">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-teal-light">
                <HeartPulse className="w-4 h-4" />
              </div>
              <span>Calibrated health insights & general guidance</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-teal-light">
                <Stethoscope className="w-4 h-4" />
              </div>
              <span>Direct access to verified medical specialists</span>
            </div>
          </div>
        </div>

        {/* Safety Note */}
        <div className="relative z-10 text-xs text-blue-200/70 border-t border-white/10 pt-6">
          <p>
            MediConsult adheres to responsible health information standards. AI recommendations are assistive guidelines and not clinical diagnoses.
          </p>
        </div>
      </div>

      {/* Right Column: Form Container */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 lg:p-16 min-h-screen">
        {/* Mobile Header Logo */}
        <div className="lg:hidden w-full max-w-md mb-6 text-center">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center shadow-sm">
              <Activity className="w-5 h-5" />
            </div>
            <span className="text-lg font-bold text-text-primary tracking-tight">
              MediConsult
            </span>
          </Link>
        </div>

        <div className="w-full max-w-md">
          <Outlet />
        </div>

        {/* Bottom emergency disclaimer */}
        <div className="mt-8 text-center max-w-md text-xs text-text-muted flex items-center justify-center gap-1.5">
          <AlertTriangle className="w-3.5 h-3.5 text-warning flex-shrink-0" />
          <span>If in immediate life-threatening danger, contact emergency services.</span>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
