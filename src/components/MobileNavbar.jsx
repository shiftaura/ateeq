import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Activity, Stethoscope, Calendar, User } from 'lucide-react';

const MobileNavbar = () => {
  const navItemClass = ({ isActive }) =>
    `flex flex-col items-center justify-center flex-1 py-1.5 min-h-[52px] text-[10px] font-medium transition-colors ${
      isActive
        ? 'text-primary font-semibold'
        : 'text-text-secondary hover:text-text-primary'
    }`;

  return (
    <nav 
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-border shadow-[0_-2px_10px_rgba(0,0,0,0.04)] px-1 pb-[env(safe-area-inset-bottom)]"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        <NavLink to="/dashboard" className={navItemClass}>
          <Home className="w-5 h-5 mb-0.5" />
          <span>Home</span>
        </NavLink>

        <NavLink to="/symptoms" className={navItemClass}>
          <Activity className="w-5 h-5 mb-0.5" />
          <span>Symptoms</span>
        </NavLink>

        <NavLink to="/doctors" className={navItemClass}>
          <Stethoscope className="w-5 h-5 mb-0.5" />
          <span>Doctors</span>
        </NavLink>

        <NavLink to="/appointments" className={navItemClass}>
          <Calendar className="w-5 h-5 mb-0.5" />
          <span>Appointments</span>
        </NavLink>

        <NavLink to="/profile" className={navItemClass}>
          <User className="w-5 h-5 mb-0.5" />
          <span>Profile</span>
        </NavLink>
      </div>
    </nav>
  );
};

export default MobileNavbar;
