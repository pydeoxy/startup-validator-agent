import ReactMarkdown from "react-markdown";
import { motion } from "framer-motion";

interface ReportViewProps {
  report: string;
}

const ReportView = ({ report }: ReportViewProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="gradient-card rounded-xl border border-border shadow-card overflow-hidden"
    >
      <div className="px-6 py-4 border-b border-border">
        <h3 className="font-semibold text-foreground">Validation Report</h3>
      </div>
      <div className="p-6 prose prose-invert prose-sm max-w-none
        prose-headings:text-foreground prose-headings:font-semibold
        prose-p:text-muted-foreground prose-p:leading-relaxed
        prose-strong:text-foreground
        prose-li:text-muted-foreground
        prose-code:text-primary prose-code:bg-secondary prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
        prose-hr:border-border
      ">
        <ReactMarkdown>{report}</ReactMarkdown>
      </div>
    </motion.div>
  );
};

export default ReportView;
