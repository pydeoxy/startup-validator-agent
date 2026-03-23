import { motion } from "framer-motion";
import { Check, Loader2 } from "lucide-react";

interface Step {
  label: string;
  done: boolean;
  active: boolean;
}

interface StepIndicatorProps {
  steps: Step[];
}

const StepIndicator = ({ steps }: StepIndicatorProps) => {
  return (
    <div className="flex flex-col gap-1">
      {steps.map((step, i) => (
        <motion.div
          key={step.label}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
          className="flex items-center gap-3"
        >
          <div className={`h-6 w-6 rounded-full flex items-center justify-center text-xs shrink-0 ${
            step.done
              ? "gradient-primary text-primary-foreground"
              : step.active
              ? "border-2 border-primary text-primary"
              : "border border-border text-muted-foreground"
          }`}>
            {step.done ? <Check className="h-3 w-3" /> : step.active ? <Loader2 className="h-3 w-3 animate-spin" /> : i + 1}
          </div>
          <span className={`text-sm ${step.done ? "text-foreground" : step.active ? "text-primary font-medium" : "text-muted-foreground"}`}>
            {step.label}
          </span>
        </motion.div>
      ))}
    </div>
  );
};

export default StepIndicator;
