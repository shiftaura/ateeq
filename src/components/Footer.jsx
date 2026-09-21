import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, ShieldCheck, Heart, AlertTriangle } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-border mt-auto">
      {/* Emergency Notice Banner */}
      <div className="bg-red-50/60 border-b border-red-100 py-3 px-4 text-center">
        <p className="text-xs text-red-900 max-w-4xl mx-auto flex items-center justify-center gap-1.5 font-medium">
          <AlertTriangle className="w-4 h-4 text-danger flex-shrink-0" />
          <span>
            <strong>Medical Emergency Notice:</strong> If you are experiencing chest pain, severe bleeding, or sudden shortness of breath, call emergency services (911 or local emergency number) immediately.
          </span>
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Column */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-3 group">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white shadow-sm">
                <Activity className="w-4 h-4" />
              </div>
              <span className="font-bold text-lg text-text-primary tracking-tight">
                MediConsult
              </span>
            </Link>
            <p className="text-xs sm:text-sm text-text-secondary max-w-md leading-relaxed mb-4">
              AI-assisted healthcare companion providing guided symptom understanding, general health guidance, and seamless connection with licensed medical doctors.
            </p>
            <div className="flex items-center gap-2 text-xs text-text-muted">
              <ShieldCheck className="w-4 h-4 text-success" />
              <span>Certified clinical workflows • Patient privacy priority</span>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-xs font-semibold text-text-primary uppercase tracking-wider mb-3">
              Patient Services
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-text-secondary">
              <li>
                <Link to="/symptoms" className="hover:text-primary transition-colors">
                  Check Symptoms
                </Link>
              </li>
              <li>
                <Link to="/doctors" className="hover:text-primary transition-colors">
                  Find a Doctor
                </Link>
              </li>
              <li>
                <Link to="/appointments" className="hover:text-primary transition-colors">
                  Book Appointments
                </Link>
              </li>
              <li>
                <Link to="/medical-history" className="hover:text-primary transition-colors">
                  Medical Records
                </Link>
              </li>
            </ul>
          </div>

          {/* Guidelines & Safety */}
          <div>
            <h4 className="text-xs font-semibold text-text-primary uppercase tracking-wider mb-3">
              Safety & Standards
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-text-secondary">
              <li>
                <span className="hover:text-primary transition-colors cursor-pointer">
                  Clinical Guidance Policy
                </span>
              </li>
              <li>
                <span className="hover:text-primary transition-colors cursor-pointer">
                  Terms of Consultation
                </span>
              </li>
              <li>
                <span className="hover:text-primary transition-colors cursor-pointer">
                  Patient Data Privacy
                </span>
              </li>
              <li>
                <span className="hover:text-primary transition-colors cursor-pointer">
                  Emergency Protocols
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Disclaimer */}
        <div className="border-t border-border pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-text-muted">
          <p className="text-center md:text-left leading-relaxed">
            © {new Date().getFullYear()} MediConsult System. Designed for academic and clinical demonstration. Not a replacement for professional clinical diagnosis.
          </p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Built with care for health</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
