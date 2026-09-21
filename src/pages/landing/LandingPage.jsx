import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Activity, 
  Stethoscope, 
  Clock, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  ChevronRight, 
  Calendar,
  FileText,
  UserCheck,
  Shield,
  ArrowRight
} from 'lucide-react';
import Button from '../../components/Button';
import Badge from '../../components/Badge';
import UrgencyBadge from '../../components/UrgencyBadge';

const LandingPage = () => {
  return (
    <div className="bg-surface-bg">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 border-b border-border/60 bg-gradient-to-b from-blue-50/40 via-white to-surface-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-primary text-xs font-semibold uppercase tracking-wider mb-6">
                <Activity className="w-3.5 h-3.5" />
                <span>AI-assisted health guidance</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-text-primary tracking-tight leading-[1.15] mb-6">
                Understand your symptoms.{' '}
                <span className="text-primary">Take the next step with confidence.</span>
              </h1>

              <p className="text-base sm:text-lg text-text-secondary max-w-2xl mx-auto lg:mx-0 leading-relaxed mb-8">
                MediConsult helps you understand common symptoms, provides general health guidance, and connects you with doctors when professional care is needed.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link to="/symptoms" className="w-full sm:w-auto">
                  <Button variant="primary" size="lg" className="w-full shadow-md" icon={Activity}>
                    Check Your Symptoms
                  </Button>
                </Link>
                <Link to="/doctors" className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="w-full" icon={Stethoscope}>
                    Find a Doctor
                  </Button>
                </Link>
              </div>

              {/* Trust badges */}
              <div className="mt-10 pt-8 border-t border-border flex flex-wrap items-center justify-center lg:justify-start gap-y-3 gap-x-6 text-xs text-text-muted font-medium">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-success" />
                  <span>No autonomous prescription</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-success" />
                  <span>Evidence-informed guidance</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-success" />
                  <span>Verified clinical specialists</span>
                </div>
              </div>
            </div>

            {/* Right Realistic Healthcare App Mockup (NO robot/neon/cyberpunk) */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Clean device frame/card */}
                <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xl p-6 relative z-10">
                  {/* Mockup Header */}
                  <div className="flex items-center justify-between pb-4 mb-4 border-b border-border">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                        <Activity className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-text-primary">Clinical Assessment</div>
                        <div className="text-[10px] text-text-muted">Assessment #MC-4891</div>
                      </div>
                    </div>
                    <UrgencyBadge level="MODERATE" size="sm" />
                  </div>

                  {/* Mockup Reported Symptoms */}
                  <div className="mb-4">
                    <span className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider block mb-2">
                      Reported Symptoms
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      <span className="text-xs bg-slate-100 text-slate-800 px-2.5 py-1 rounded-md font-medium">
                        Mild Fever
                      </span>
                      <span className="text-xs bg-slate-100 text-slate-800 px-2.5 py-1 rounded-md font-medium">
                        Dry Cough
                      </span>
                      <span className="text-xs bg-slate-100 text-slate-800 px-2.5 py-1 rounded-md font-medium">
                        Sore Throat
                      </span>
                    </div>
                  </div>

                  {/* Mockup Guidance Box */}
                  <div className="bg-blue-50/70 border border-blue-100 rounded-xl p-3.5 mb-4">
                    <div className="text-xs font-semibold text-primary mb-1">
                      Possible Causes May Include:
                    </div>
                    <p className="text-xs text-text-secondary leading-relaxed">
                      Upper viral respiratory tract irritation. Guidance suggests hydration, rest, and temperature monitoring.
                    </p>
                  </div>

                  {/* Mockup Recommended Doctor Card */}
                  <div className="p-3.5 rounded-xl border border-border bg-slate-50/60 mb-5">
                    <span className="text-[10px] font-semibold text-teal uppercase tracking-wider block mb-2">
                      Recommended Next Step
                    </span>
                    <div className="flex items-center gap-3">
                      <img
                        src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=128"
                        alt="Doctor"
                        className="w-10 h-10 rounded-lg object-cover border border-border"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-text-primary truncate">
                          Dr. Michael Chen
                        </div>
                        <div className="text-[11px] text-text-muted">
                          General Physician • Metro Health
                        </div>
                      </div>
                      <span className="text-[11px] font-semibold text-primary bg-white px-2 py-1 rounded border border-border">
                        Today 10:30 AM
                      </span>
                    </div>
                  </div>

                  {/* Mockup Action Button */}
                  <div className="pt-2">
                    <div className="w-full bg-primary text-white text-center py-2.5 rounded-xl text-xs font-semibold shadow-sm flex items-center justify-center gap-2">
                      <span>Book Consultation With Doctor</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>

                {/* Subtle back decorative accents */}
                <div className="absolute -bottom-4 -right-4 w-72 h-72 bg-teal/10 rounded-3xl -z-0 blur-xl" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Three Core Features Section */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <Badge variant="primary" size="md" className="mb-3">
            Core Capabilities
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight mb-4">
            Designed for thoughtful, accurate healthcare guidance
          </h2>
          <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
            MediConsult bridges the gap between early symptoms and licensed clinical care with safety safeguards at every step.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-white rounded-2xl border border-border p-8 shadow-card hover:shadow-card-hover transition-all">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-primary flex items-center justify-center mb-6">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-text-primary mb-2.5">
              Symptom Checker
            </h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              Describe your discomfort in natural language, select specific symptoms, and receive structured general health guidance and urgency indicators.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white rounded-2xl border border-border p-8 shadow-card hover:shadow-card-hover transition-all">
            <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal flex items-center justify-center mb-6">
              <Stethoscope className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-text-primary mb-2.5">
              Doctor Consultation
            </h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              Find verified doctors by specialization, view qualifications and available appointment slots, and reserve in-clinic consultations seamlessly.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white rounded-2xl border border-border p-8 shadow-card hover:shadow-card-hover transition-all">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-text-primary mb-2.5">
              Health History
            </h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              Maintain an organized digital timeline of past symptom checks, recommendations, and verified consultation records in one secure place.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works (6 Steps) */}
      <section className="py-16 md:py-24 bg-white border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-teal uppercase tracking-wider block mb-2">
              Structured Workflow
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight mb-4">
              How MediConsult Works
            </h2>
            <p className="text-sm sm:text-base text-text-secondary">
              A transparent, 6-step clinical support pathway designed for patient safety and clarity.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6">
            {[
              { num: '01', title: 'Login', desc: 'Securely access your patient account and history.' },
              { num: '02', title: 'Symptoms', desc: 'Enter symptoms, duration, and severity level.' },
              { num: '03', title: 'Analyze', desc: 'Structured analysis compares clinical patterns.' },
              { num: '04', title: 'Guidance', desc: 'Receive safe guidance and urgency level.' },
              { num: '05', title: 'Doctor', desc: 'Browse matched specialists with real openings.' },
              { num: '06', title: 'Book', desc: 'Confirm appointment and receive reminders.' },
            ].map((step, idx) => (
              <div
                key={idx}
                className="bg-surface-bg rounded-2xl border border-border/80 p-5 flex flex-col justify-between"
              >
                <div>
                  <span className="text-2xl font-black text-slate-300 block mb-3 font-mono">
                    {step.num}
                  </span>
                  <h4 className="text-base font-semibold text-text-primary mb-1.5">
                    {step.title}
                  </h4>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Health Safety Section (Mandatory Requirement) */}
      <section className="py-16 md:py-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-slate-800">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-teal/20 text-teal-light flex items-center justify-center border border-teal-500/30">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold tracking-tight">Our Health Safety Commitment</h3>
              <p className="text-xs text-blue-200">Patient safety and clinical responsibility guide our system</p>
            </div>
          </div>

          <p className="text-sm sm:text-base text-blue-100/90 leading-relaxed mb-8">
            MediConsult is built to assist and inform, never to replace the clinical judgment of certified medical doctors. We enforce rigorous safety boundaries across our algorithms:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-white/10">
            <div>
              <h4 className="text-sm font-semibold text-white mb-1.5 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-light" />
                No Final Diagnosis
              </h4>
              <p className="text-xs text-blue-200/80 leading-relaxed">
                We provide possible causes and pattern insights. We never declare definitive diagnostic conclusions.
              </p>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-white mb-1.5 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-light" />
                No Autonomous Prescription
              </h4>
              <p className="text-xs text-blue-200/80 leading-relaxed">
                We never recommend pharmaceutical dosages, prescription medicines, or unsupervised drug treatments.
              </p>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-white mb-1.5 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-light" />
                Professional Care When Needed
              </h4>
              <p className="text-xs text-blue-200/80 leading-relaxed">
                When symptoms suggest potential risk, we prioritize rapid booking with licensed medical practitioners.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Bar */}
      <section className="py-16 bg-blue-50/50 border-t border-border">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight mb-4">
            Ready to check your symptoms?
          </h2>
          <p className="text-sm text-text-secondary mb-8 max-w-xl mx-auto">
            Get structured general guidance in minutes, understand urgency, and consult certified doctors near you.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/symptoms">
              <Button variant="primary" size="lg" icon={Activity}>
                Start Symptom Assessment
              </Button>
            </Link>
            <Link to="/doctors">
              <Button variant="outline" size="lg" icon={Stethoscope}>
                Browse Doctor Directory
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
