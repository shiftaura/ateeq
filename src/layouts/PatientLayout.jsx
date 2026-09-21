import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import MobileNavbar from '../components/MobileNavbar';
import Footer from '../components/Footer';

const PatientLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-surface-bg">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 pb-20 md:pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Outlet />
        </div>
      </main>

      {/* Footer on desktop/tablet */}
      <div className="hidden md:block">
        <Footer />
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <MobileNavbar />
    </div>
  );
};

export default PatientLayout;
