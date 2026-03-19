import { motion } from "framer-motion";
import { DollarSign, Heart, Activity, Globe } from "lucide-react";
import type { Decisions } from "./DecisionSliders";

interface MetricsDisplayProps {
  decisions: Decisions;
}

const calculateMetrics = (d: Decisions) => {
  const wealth = Math.min(100, Math.max(0,
    d.studyTime * 10 + d.discipline * 8 - d.socialMedia * 5 - d.screenTime * 3 + d.sleepHours * 3
  ));
  const happiness = Math.min(100, Math.max(0,
    d.exercise * 8 + d.sleepHours * 8 + d.discipline * 5 - d.socialMedia * 6 - d.screenTime * 4 + d.studyTime * 3
  ));
  const health = Math.min(100, Math.max(0,
    d.exercise * 12 + d.sleepHours * 10 - d.socialMedia * 3 - d.screenTime * 5 + d.discipline * 4
  ));
  const impact = Math.min(100, Math.max(0,
    d.studyTime * 8 + d.discipline * 10 + d.exercise * 3 - d.socialMedia * 4 - d.screenTime * 3 + d.sleepHours * 2
  ));
  return { wealth, happiness, health, impact };
};

const metrics = [
  { key: "wealth", label: "Wealth", icon: DollarSign, gradient: "from-accent to-accent/60" },
  { key: "happiness", label: "Happiness", icon: Heart, gradient: "from-primary to-primary/60" },
  { key: "health", label: "Health", icon: Activity, gradient: "from-success to-success/60" },
  { key: "impact", label: "Social Impact", icon: Globe, gradient: "from-destructive to-accent" },
] as const;

const MetricsDisplay = ({ decisions }: MetricsDisplayProps) => {
  const values = calculateMetrics(decisions);

  return (
    <div className="grid grid-cols-2 gap-4">
      {metrics.map((m, i) => {
        const Icon = m.icon;
        const val = values[m.key];
        return (
          <motion.div
            key={m.key}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="glass rounded-xl p-5 text-center relative overflow-hidden group"
          >
            <div className="relative z-10">
              <Icon className="w-6 h-6 text-primary mx-auto mb-2" />
              <div className="font-display text-3xl font-bold text-foreground mb-1">
                {Math.round(val)}
              </div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider font-body">{m.label}</div>
              {/* Progress bar */}
              <div className="mt-3 h-1.5 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className={`h-full rounded-full bg-gradient-to-r ${m.gradient}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${val}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export { calculateMetrics };
export default MetricsDisplay;
