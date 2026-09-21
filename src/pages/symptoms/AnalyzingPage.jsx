import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Activity, Check, Circle, Loader2, AlertCircle, RefreshCw, Home, Stethoscope, ArrowLeft } from 'lucide-react';
import symptomService from '../../services/symptomService';
import Button from '../../components/Button';
import ErrorState from '../../components/ErrorState';

const AnalyzingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const symptomData = location.state?.symptomData;

  const [currentStep, setCurrentStep] = useState(1);
  const [error, setError] = useState(null);

  // Guard against React 18 StrictMode duplicate request execution
  const hasTriggeredRef = useRef(false);

  useEffect(() => {
    // Prevent duplicate API invocation during StrictMode mount-unmount-remount
    if (hasTriggeredRef.current) {
      return;
    }
    hasTriggeredRef.current = true;

    // Fallback payload if landed directly
    const payload = symptomData || {
      symptoms: ['Fever', 'Cough'],
      description: '',
      duration: '1 to 3 days',
      severity: 'moderate'
    };

    let isMounted = true;

    // Progression animation step timers
    const timer1 = setTimeout(() => {
      if (isMounted) setCurrentStep(2);
    }, 800);

    const timer2 = setTimeout(() => {
      if (isMounted) setCurrentStep(3);
    }, 1600);

    // Execute single analysis request
    const executeAnalysis = async () => {
      try {
        const result = await symptomService.analyzeSymptoms(payload);
        if (isMounted) {
          // Allow progression animation to complete smoothly before navigating
          setTimeout(() => {
            const targetId = result.id || result._id;
            navigate(`/symptoms/result/${targetId}`, {
              replace: true,
              state: { result }
            });
          }, 800);
        }
      } catch (err) {
        console.error('[AnalyzingPage] Analysis error:', err);
        if (isMounted) {
          // TASK 5: Display exact useful backend validation or error message
          setError(
            err.message ||
            'Unable to complete the analysis right now. Please verify backend service or consider consulting a healthcare professional directly.'
          );
        }
      }
    };

    executeAnalysis();

    return () => {
      isMounted = false;
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [symptomData, navigate]);

  if (error) {
    return (
      <div className="max-w-xl mx-auto py-12 px-4">
        <ErrorState
          title="Analysis Could Not Be Completed"
          message={error}
          onRetry={() => {
            hasTriggeredRef.current = false;
            setError(null);
            setCurrentStep(1);
            navigate('/symptoms');
          }}
          showHomeLink={false}
        />
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link to="/symptoms">
            <Button variant="outline" size="sm" icon={ArrowLeft}>
              Return to Symptom Form
            </Button>
          </Link>
          <Link to="/doctors">
            <Button variant="secondary" size="sm" icon={Stethoscope}>
              Browse Doctors Directly
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const steps = [
    { id: 1, title: 'Understanding symptoms', desc: 'Parsing reported discomfort and timeframe' },
    { id: 2, title: 'Identifying possible patterns', desc: 'Evaluating clinical indicators against health datasets' },
    { id: 3, title: 'Preparing general guidance', desc: 'Structuring self-care advice and urgency tier' },
  ];

  return (
    <div className="max-w-xl mx-auto py-12 px-4 sm:px-6">
      <div className="bg-white rounded-3xl border border-border p-8 sm:p-10 shadow-card text-center">
        {/* Animated Clinical Pulsing Icon */}
        <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center mx-auto mb-6 text-primary shadow-subtle relative">
          <Activity className="w-8 h-8 animate-pulse" />
          <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-primary animate-ping" />
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight mb-2">
          Analyzing your symptoms...
        </h2>
        <p className="text-xs sm:text-sm text-text-secondary max-w-sm mx-auto mb-8 leading-relaxed">
          Evaluating health patterns. This process does not claim diagnostic certainty and is for guidance only.
        </p>

        {/* Stepwise Progression UI */}
        <div className="space-y-4 max-w-md mx-auto text-left">
          {steps.map((step) => {
            const isCompleted = currentStep > step.id;
            const isCurrent = currentStep === step.id;

            return (
              <div
                key={step.id}
                className={`p-4 rounded-xl border transition-all duration-300 flex items-start gap-3.5 ${
                  isCompleted
                    ? 'bg-blue-50/40 border-blue-200'
                    : isCurrent
                    ? 'bg-white border-primary shadow-subtle ring-1 ring-primary/30'
                    : 'bg-slate-50 border-border opacity-50'
                }`}
              >
                <div className="mt-0.5 flex-shrink-0">
                  {isCompleted ? (
                    <div className="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  ) : isCurrent ? (
                    <Loader2 className="w-5 h-5 text-primary animate-spin" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border border-slate-300 flex items-center justify-center">
                      <Circle className="w-2.5 h-2.5 text-slate-300" />
                    </div>
                  )}
                </div>

                <div>
                  <h4 className={`text-sm font-semibold ${isCurrent ? 'text-primary' : 'text-text-primary'}`}>
                    {step.title}
                  </h4>
                  <p className="text-xs text-text-secondary mt-0.5">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 pt-6 border-t border-border text-[11px] text-text-muted">
          MediConsult Clinical Guidance Engine • Privacy-Preserved Assessment
        </div>
      </div>
    </div>
  );
};

export default AnalyzingPage;
