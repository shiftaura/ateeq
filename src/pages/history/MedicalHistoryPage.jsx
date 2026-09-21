import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Search, Plus, Filter, Calendar } from 'lucide-react';
import historyService from '../../services/historyService';
import HealthRecordCard from '../../components/HealthRecordCard';
import Input from '../../components/Input';
import Select from '../../components/Select';
import Button from '../../components/Button';
import LoadingState from '../../components/LoadingState';
import EmptyState from '../../components/EmptyState';
import ErrorState from '../../components/ErrorState';

const MedicalHistoryPage = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [urgencyFilter, setUrgencyFilter] = useState('All');

  const fetchHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await historyService.getMedicalHistory({
        search: searchQuery,
        urgency: urgencyFilter,
      });
      setRecords(data);
    } catch (err) {
      console.error('Error fetching medical history:', err);
      setError(err.message || 'Unable to load medical history records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [urgencyFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchHistory();
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setUrgencyFilter('All');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <span className="text-xs font-semibold text-primary uppercase tracking-wider block mb-1">
            Personal Health Timeline
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
            Medical History
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Review past symptom assessments, general guidance notes, and recorded clinic consultations.
          </p>
        </div>

        <Link to="/symptoms">
          <Button variant="primary" size="md" icon={Plus}>
            New Symptom Check
          </Button>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-border p-4 sm:p-5 shadow-subtle space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-center gap-3">
          <div className="flex-1 w-full">
            <Input
              placeholder="Search records by symptoms or title..."
              icon={Search}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="w-full sm:w-48">
            <Select
              value={urgencyFilter}
              onChange={(e) => setUrgencyFilter(e.target.value)}
              options={[
                { value: 'All', label: 'All Urgency Levels' },
                { value: 'LOW', label: 'Low Urgency' },
                { value: 'MODERATE', label: 'Moderate Urgency' },
                { value: 'HIGH', label: 'High / Urgent' },
              ]}
            />
          </div>

          <Button type="submit" variant="secondary" size="md" className="w-full sm:w-auto">
            Filter
          </Button>
        </form>
      </div>

      {/* Records Timeline List */}
      <div>
        {loading ? (
          <LoadingState message="Loading medical history records..." description="Compiling clinical timeline and past evaluations." />
        ) : error ? (
          <ErrorState message={error} onRetry={fetchHistory} />
        ) : records.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No medical records found"
            description="You have no recorded symptom checks or consultations matching your current filters."
            actionLabel="Start a Symptom Check"
            actionLink="/symptoms"
          />
        ) : (
          <div className="space-y-4">
            <div className="text-xs text-text-muted px-1">
              Showing <strong>{records.length}</strong> recorded health timeline entries
            </div>

            <div className="space-y-4">
              {records.map((record) => (
                <HealthRecordCard key={record.id} record={record} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicalHistoryPage;
