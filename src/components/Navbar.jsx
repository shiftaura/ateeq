import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { 
  Activity, 
  Bell, 
  User, 
  LogOut, 
  Settings as SettingsIcon, 
  ChevronDown,
  Stethoscope,
  Calendar,
  ClipboardList
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import notificationService from '../services/notificationService';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (isAuthenticated) {
      notificationService.getNotifications()
        .then((items) => {
          const unread = items.filter((n) => !n.isRead).length;
          setUnreadCount(unread);
        })
        .catch(() => {});
    }
  }, [isAuthenticated]);

  // Close dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    showToast('Logged out successfully', 'info');
    navigate('/login');
  };

  const navLinkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors py-1.5 px-3 rounded-md ${
      isActive
        ? 'text-primary bg-blue-50/70 font-semibold'
        : 'text-text-secondary hover:text-text-primary hover:bg-slate-50'
    }`;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-border shadow-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={isAuthenticated ? "/dashboard" : "/"} className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
              <Activity className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg text-text-primary tracking-tight leading-tight">
                MediConsult
              </span>
              <span className="text-[10px] text-text-muted font-medium uppercase tracking-wider">
                Clinical Companion
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <NavLink to={isAuthenticated ? "/dashboard" : "/"} className={navLinkClass}>
              Home
            </NavLink>
            <NavLink to="/symptoms" className={navLinkClass}>
              Check Symptoms
            </NavLink>
            <NavLink to="/doctors" className={navLinkClass}>
              Find Doctors
            </NavLink>
            {isAuthenticated && (
              <>
                <NavLink to="/appointments" className={navLinkClass}>
                  Appointments
                </NavLink>
                <NavLink to="/medical-history" className={navLinkClass}>
                  Medical History
                </NavLink>
              </>
            )}
          </nav>

          {/* Right side controls */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                {/* Notifications link */}
                <Link
                  to="/notifications"
                  className="relative p-2 text-text-secondary hover:text-text-primary hover:bg-slate-100 rounded-lg transition-colors"
                  aria-label="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-danger animate-pulse" />
                  )}
                </Link>

                {/* User Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-100 transition-colors focus:outline-none cursor-pointer"
                    aria-expanded={dropdownOpen}
                    aria-haspopup="true"
                  >
                    <img
                      src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=128'}
                      alt={user?.name || 'User avatar'}
                      className="w-8 h-8 rounded-lg object-cover border border-border"
                    />
                    <div className="hidden sm:flex flex-col text-left">
                      <span className="text-xs font-semibold text-text-primary truncate max-w-[120px]">
                        {user?.name || 'Patient'}
                      </span>
                      <span className="text-[11px] text-text-muted">Account</span>
                    </div>
                    <ChevronDown className="w-4 h-4 text-text-muted hidden sm:block" />
                  </button>

                  {/* Dropdown Menu */}
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl border border-border shadow-lg py-1.5 z-50 animate-in fade-in-50 duration-150">
                      <div className="px-4 py-2 border-b border-border">
                        <p className="text-xs font-semibold text-text-primary truncate">{user?.name}</p>
                        <p className="text-[11px] text-text-muted truncate">{user?.email}</p>
                      </div>

                      <Link
                        to="/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs text-text-secondary hover:text-text-primary hover:bg-slate-50 transition-colors"
                      >
                        <User className="w-4 h-4" />
                        <span>Profile & Health Info</span>
                      </Link>

                      <Link
                        to="/settings"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs text-text-secondary hover:text-text-primary hover:bg-slate-50 transition-colors"
                      >
                        <SettingsIcon className="w-4 h-4" />
                        <span>Account Settings</span>
                      </Link>

                      <div className="border-t border-border my-1" />

                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          handleLogout();
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-danger hover:bg-red-50 transition-colors cursor-pointer text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-xs sm:text-sm font-semibold text-text-secondary hover:text-text-primary px-3 py-2 rounded-lg transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-primary hover:bg-primary-dark text-white text-xs sm:text-sm font-medium px-3.5 py-2 rounded-lg shadow-sm transition-colors"
                >
                  Create Account
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
