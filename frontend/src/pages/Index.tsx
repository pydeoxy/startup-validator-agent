import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap } from "lucide-react";
import ValidatorForm from "@/components/ValidatorForm";
import ReportView from "@/components/ReportView";
import StepIndicator from "@/components/StepIndicator";
import { validateIdea } from "@/lib/api";

const STEPS = [
  "Market Analysis",
  "Competitor Scan",
  "Pricing Strategy",
  "Landing Page Draft",
  "Customer Objections",
];

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [report, setReport] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(async (idea: string, customer: string) => {
    setIsLoading(true);
    setReport(null);
    setError(null);
    setCurrentStep(0);

    // Simulate step progression while waiting for the API
    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step < STEPS.length) {
        setCurrentStep(step);
      } else {
        // Loop back through steps while still waiting
        step = 0;
        setCurrentStep(0);
      }
    }, 3000);

    try {
      const result = await validateIdea({ idea, target_customer: customer });

      clearInterval(interval);
      setCurrentStep(STEPS.length);

      if (result.status === "success" && result.report) {
        setReport(result.report);
      } else {
        setError(result.message || "Validation failed. Please try again.");
      }
    } catch (err) {
      clearInterval(interval);
      setError(err instanceof Error ? err.message : "Failed to connect to the backend. Make sure it's running.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleReset = () => {
    setReport(null);
    setError(null);
    setCurrentStep(-1);
  };

  const steps = STEPS.map((label, i) => ({
    label,
    done: i < currentStep,
    active: i === currentStep && isLoading,
  }));

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container max-w-4xl py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center">
              <Zap className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-foreground text-lg tracking-tight">IdeaValidator</span>
          </div>
          {(report || error) && (
            <button
              onClick={handleReset}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              ← New Analysis
            </button>
          )}
        </div>
      </header>

      <main className="container max-w-4xl py-8 sm:py-12">
        <AnimatePresence mode="wait">
          {!report && !error && currentStep < 0 ? (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-xl mx-auto space-y-8"
            >
              <div className="text-center space-y-3">
                <h1 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
                  Validate Your <span className="text-gradient-primary">Startup Idea</span>
                </h1>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Get instant market analysis, competitor intelligence, pricing strategy, and more — powered by AI agents.
                </p>
              </div>
              <ValidatorForm onSubmit={handleSubmit} isLoading={isLoading} />
            </motion.div>
          ) : isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-sm mx-auto py-16 space-y-6"
            >
              <h2 className="text-lg font-semibold text-foreground text-center">Running Validation Agent…</h2>
              <p className="text-xs text-muted-foreground text-center">This may take a minute or two</p>
              <StepIndicator steps={steps} />
            </motion.div>
          ) : error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="max-w-md mx-auto py-16 text-center space-y-4"
            >
              <p className="text-destructive font-medium">⚠ {error}</p>
              <button
                onClick={handleReset}
                className="text-sm text-primary hover:underline"
              >
                Try again
              </button>
            </motion.div>
          ) : report ? (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="mb-8 text-center">
                <h2 className="text-2xl font-bold text-foreground">Validation Complete ✓</h2>
                <p className="text-sm text-muted-foreground mt-1">Here's what the agents found</p>
              </div>
              <ReportView report={report} />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Index;
