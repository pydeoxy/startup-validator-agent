import { useState } from "react";
import { motion } from "framer-motion";
import { Rocket, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

interface ValidatorFormProps {
  onSubmit: (idea: string, customer: string) => void;
  isLoading: boolean;
}

const ValidatorForm = ({ onSubmit, isLoading }: ValidatorFormProps) => {
  const [idea, setIdea] = useState("");
  const [customer, setCustomer] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (idea.trim() && customer.trim()) {
      onSubmit(idea, customer);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-foreground">
          <Rocket className="h-4 w-4 text-primary" />
          Startup Idea
        </label>
        <Textarea
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          placeholder="Describe your startup idea in detail. What problem does it solve? How does it work?"
          className="min-h-[120px] bg-secondary border-border placeholder:text-muted-foreground/60 focus:ring-primary resize-none"
        />
      </div>

      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-foreground">
          <Target className="h-4 w-4 text-accent" />
          Target Customer
        </label>
        <Input
          value={customer}
          onChange={(e) => setCustomer(e.target.value)}
          placeholder="e.g., SaaS founders with teams of 5-20 people"
          className="bg-secondary border-border placeholder:text-muted-foreground/60 focus:ring-primary"
        />
      </div>

      <Button
        type="submit"
        disabled={!idea.trim() || !customer.trim() || isLoading}
        className="w-full gradient-primary text-primary-foreground font-semibold h-12 text-base glow-primary hover:opacity-90 transition-opacity disabled:opacity-40"
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              className="inline-block h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
            />
            Analyzing...
          </span>
        ) : (
          "Validate My Idea"
        )}
      </Button>
    </motion.form>
  );
};

export default ValidatorForm;
