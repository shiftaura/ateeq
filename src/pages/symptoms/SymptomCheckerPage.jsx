import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, AlertTriangle, ShieldCheck, ArrowRight, HelpCircle } from 'lucide-react';
import SymptomChip from '../../components/SymptomChip';
import Textarea from '../../components/Textarea';
import Button from '../../components/Button';
import Alert from '../../components/Alert';
import { symptomChips, durationOptions, severityOptions } from '../../mock/symptoms';
import { useToast } from '../../context/ToastContext';

const SymptomCheckerPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [selectedChips, setSelectedChips] = useState(['Fever', 'Cough']);
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('1 to 3 days');
  const [severity, setSeverity] = useState('Moderate');
  const [error, setError] = useState('');

  const toggleChip = (chip) => {
    setSelectedChips((prev) =>
      prev.includes(chip) ? prev.filter((c) => c !== chip) : [...prev, chip]
    );
    if (error) setError('');
  };

  const handleQuickAddCommon = (chip) => {
    if (!selectedChips.includes(chip)) {
      setSelectedChips((prev) => [...prev, chip]);
    }
  };

  const handleStartAnalysis = (e) => {
    e.preventDefault();
    setError('');

    if (selectedChips.length === 0) {
      setError('Please select at least one symptom from the options above to begin analysis.');
      showToast('Please select at least one symptom to proceed.', 'warning');
      return;
    }

    if (!duration) {
      setError('Please select how long you have had these symptoms.');
      return;
    }

    if (!severity) {
      setError('Please select the severity level.');
      return;
    }

    // Navigate to analyzing animation page with data payload matching backend contract
    navigate('/symptoms/analyzing', {
      state: {
        symptomData: {
          symptoms: selectedChips,
          description: description.trim(),
          duration: duration.trim(),
          severity: severity.toLowerCase(),
        }
      }
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center sm:text-left">
        <span className="text-xs font-semibold text-primary uppercase tracking-wider block mb-1">
          Clinical Companion
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
          How are you feeling today?
        </h1>
        <p className="text-sm text-text-secondary mt-1">
          Describe your symptoms in simple language. We'll generate general health guidance and highlight urgency levels.
        </p>
      </div>

      {error && (
        <Alert type="danger" onDismiss={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Safety Notice Banner */}
      <div className="bg-blue-50/80 border border-blue-200 rounded-2xl p-4 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
        <div className="text-xs text-blue-900 leading-relaxed">
          <strong>Important Health Safety:</strong> This tool provides general health information and structured pattern analysis. It is <strong>not a medical diagnosis</strong>. Never disregard professional clinical advice or delay seeking care because of this guidance.
        </div>
      </div>

      {/* Main Interactive Form Card */}
      <form onSubmit={handleStartAnalysis} className="bg-white rounded-3xl border border-border p-6 sm:p-8 shadow-card space-y-8">
        {/* Step 1: Select common symptom chips */}
        <div>
          <label className="block text-sm font-semibold text-text-primary mb-2">
            1. Select Symptoms You Are Experiencing
            <span className="text-danger ml-1">*</span>
          </label>
          <p className="text-xs text-text-secondary mb-3">
            Choose all that match. You can select multiple symptoms.
          </p>

          <div className="flex flex-wrap gap-2">
            {symptomChips.map((chip) => (
              <SymptomChip
                key={chip}
                label={chip}
                selected={selectedChips.includes(chip)}
                onToggle={toggleChip}
              />
            ))}
          </div>

          {selectedChips.length > 0 && (
            <div className="mt-3 flex items-center gap-2 text-xs text-text-muted">
              <span>Selected ({selectedChips.length}): </span>
              <span className="font-semibold text-primary">{selectedChips.join(', ')}</span>
            </div>
          )}
        </div>

        {/* Step 2: Natural language description */}
        <div>
          <label htmlFor="description" className="block text-sm font-semibold text-text-primary mb-2">
            2. Describe Your Discomfort in Simple Words (Optional)
          </label>
          <p className="text-xs text-text-secondary mb-3">
            E.g., "I started feeling feverish yesterday with a sore throat when swallowing, and mild dry cough."
          </p>

          <Textarea
            id="description"
            rows={4}
            placeholder="Describe what you are feeling, when it started, or any specific triggers..."
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              if (error) setError('');
            }}
          />
        </div>

        {/* Step 3: Duration options */}
        <div>
          <label className="block text-sm font-semibold text-text-primary mb-2">
            3. How Long Have You Noticed These Symptoms?
            <span className="text-danger ml-1">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {durationOptions.map((opt) => {
              const isSelected = duration === opt.label || duration === opt.id;
              return (
                <button
                  type="button"
                  key={opt.id}
                  onClick={() => setDuration(opt.label)}
                  className={`p-3.5 rounded-xl border text-left text-xs font-medium transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50 border-primary text-primary shadow-subtle ring-1 ring-primary'
                      : 'bg-white border-border text-text-secondary hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <span className="block font-semibold text-text-primary mb-0.5">
                    {opt.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 4: Severity scale */}
        <div>
          <label className="block text-sm font-semibold text-text-primary mb-2">
            4. Current Severity Level
            <span className="text-danger ml-1">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {severityOptions.map((sev) => {
              const isSelected = severity === sev.label;
              return (
                <button
                  type="button"
                  key={sev.id}
                  onClick={() => setSeverity(sev.label)}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50 border-primary text-primary shadow-subtle ring-1 ring-primary'
                      : 'bg-white border-border text-text-secondary hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-sm text-text-primary">
                      {sev.label}
                    </span>
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-primary" />
                    )}
                  </div>
                  <p className="text-xs text-text-muted leading-relaxed">
                    {sev.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Emergency Check Notice */}
        <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
          <div className="text-xs text-amber-900 leading-relaxed">
            <strong>Emergency Alert:</strong> If you are experiencing sudden severe chest pain, extreme difficulty breathing, fainting, or sudden numbness, do not use this online tool. Seek emergency medical care immediately.
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border">
          <span className="text-xs text-text-muted">
            Analysis evaluates symptom patterns against general health references.
          </span>
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full sm:w-auto shadow-md"
            icon={ArrowRight}
            iconPosition="right"
          >
            Analyze Symptoms
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SymptomCheckerPage;
