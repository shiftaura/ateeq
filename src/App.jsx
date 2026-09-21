import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Providers
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import PatientLayout from './layouts/PatientLayout';
import AuthLayout from './layouts/AuthLayout';

// Guard
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import LandingPage from './pages/landing/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';

import PatientDashboardPage from './pages/dashboard/PatientDashboardPage';
import SymptomCheckerPage from './pages/symptoms/SymptomCheckerPage';
import AnalyzingPage from './pages/symptoms/AnalyzingPage';
import SymptomResultPage from './pages/symptoms/SymptomResultPage';

import FindDoctorsPage from './pages/doctors/FindDoctorsPage';
import DoctorDetailPage from './pages/doctors/DoctorDetailPage';

import MyAppointmentsPage from './pages/appointments/MyAppointmentsPage';
import AppointmentDetailPage from './pages/appointments/AppointmentDetailPage';
import BookAppointmentPage from './pages/appointments/BookAppointmentPage';
import AppointmentSuccessPage from './pages/appointments/AppointmentSuccessPage';

import MedicalHistoryPage from './pages/history/MedicalHistoryPage';
import MedicalHistoryDetailPage from './pages/history/MedicalHistoryDetailPage';

import NotificationsPage from './pages/notifications/NotificationsPage';
import ProfilePage from './pages/profile/ProfilePage';
import SettingsPage from './pages/profile/SettingsPage';

import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <Routes>
          {/* Public Root Route */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/404" element={<NotFoundPage />} />
          </Route>

          {/* Authentication Routes (Split Auth Layout) */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          </Route>

          {/* Protected Patient Routes (Patient Layout with Desktop & Mobile Nav) */}
          <Route
            element={
              <ProtectedRoute>
                <PatientLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<PatientDashboardPage />} />
            <Route path="/symptoms" element={<SymptomCheckerPage />} />
            <Route path="/symptoms/analyzing" element={<AnalyzingPage />} />
            <Route path="/symptoms/result/:id" element={<SymptomResultPage />} />
            
            <Route path="/doctors" element={<FindDoctorsPage />} />
            <Route path="/doctors/:id" element={<DoctorDetailPage />} />
            
            <Route path="/appointments" element={<MyAppointmentsPage />} />
            <Route path="/appointments/:id" element={<AppointmentDetailPage />} />
            <Route path="/appointments/book/:doctorId" element={<BookAppointmentPage />} />
            <Route path="/appointment-success/:id" element={<AppointmentSuccessPage />} />
            
            <Route path="/medical-history" element={<MedicalHistoryPage />} />
            <Route path="/medical-history/:id" element={<MedicalHistoryDetailPage />} />
            
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>

          {/* Catch-all 404 Route */}
          <Route element={<PublicLayout />}>
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
