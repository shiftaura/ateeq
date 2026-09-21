import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, Stethoscope, SlidersHorizontal } from 'lucide-react';
import doctorService from '../../services/doctorService';
import DoctorCard from '../../components/DoctorCard';
import Input from '../../components/Input';
import Select from '../../components/Select';
import Button from '../../components/Button';
import LoadingState from '../../components/LoadingState';
import EmptyState from '../../components/EmptyState';
import ErrorState from '../../components/ErrorState';

const FindDoctorsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSpecialization = searchParams.get('specialization') || 'All';

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState(initialSpecialization);
  const [selectedAvailability, setSelectedAvailability] = useState('All');

  const fetchDoctors = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await doctorService.getDoctors({
        search: searchQuery,
        specialization: selectedSpecialty,
        availability: selectedAvailability,
      });
      setDoctors(data);
    } catch (err) {
      console.error('Error fetching doctors:', err);
      setError(err.message || 'Unable to fetch doctors directory.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, [selectedSpecialty, selectedAvailability]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchDoctors();
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedSpecialty('All');
    setSelectedAvailability('All');
    setSearchParams({});
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <span className="text-xs font-semibold text-primary uppercase tracking-wider block mb-1">
          Medical Directory
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
          Find a Doctor
        </h1>
        <p className="text-sm text-text-secondary mt-1">
          Connect with verified clinical specialists, view open consultation slots, and book visits.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-border p-4 sm:p-5 shadow-subtle space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row items-center gap-3">
          <div className="flex-1 w-full">
            <Input
              placeholder="Search by doctor name, specialty, or clinic..."
              icon={Search}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <div className="w-full sm:w-48">
              <Select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                options={[
                  { value: 'All', label: 'All Specializations' },
                  { value: 'General Physician', label: 'General Physician' },
                  { value: 'Pulmonologist', label: 'Pulmonologist' },
                  { value: 'Cardiologist', label: 'Cardiologist' },
                  { value: 'Family Medicine', label: 'Family Medicine' },
                  { value: 'ENT Specialist', label: 'ENT Specialist' },
                ]}
              />
            </div>

            <div className="w-full sm:w-44">
              <Select
                value={selectedAvailability}
                onChange={(e) => setSelectedAvailability(e.target.value)}
                options={[
                  { value: 'All', label: 'Any Availability' },
                  { value: 'Today', label: 'Available Today' },
                  { value: 'Tomorrow', label: 'Available Tomorrow' },
                ]}
              />
            </div>

            <Button type="submit" variant="primary" size="md" className="w-full sm:w-auto">
              Search
            </Button>
          </div>
        </form>
      </div>

      {/* Results Section */}
      <div>
        {loading ? (
          <LoadingState message="Searching verified doctors..." description="Matching clinical specialties and schedule availability." />
        ) : error ? (
          <ErrorState message={error} onRetry={fetchDoctors} />
        ) : doctors.length === 0 ? (
          <EmptyState
            icon={Stethoscope}
            title="No doctors found"
            description="We couldn't find any medical practitioners matching your filter criteria."
            actionLabel="Reset Search Filters"
            onAction={handleResetFilters}
          />
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-text-secondary px-1">
              <span>Showing <strong>{doctors.length}</strong> certified practitioners</span>
            </div>

            <div className="space-y-4">
              {doctors.map((doctor) => (
                <DoctorCard key={doctor.id} doctor={doctor} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FindDoctorsPage;
