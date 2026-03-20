import { motion } from "framer-motion";
import { DollarSign, Heart, Activity, Globe } from "lucide-react";
import type { LifeMetrics } from "@/lib/simulation-engine";

interface AdvancedMetricsProps {
  metrics: LifeMetrics;
}

const metricsConfig = [
  { key: "wealth" as keyof LifeMetrics, label: "Wealth", icon: DollarSign, gradient: "from-accent to-accent/60" },
  { key: "happiness" as keyof LifeMetrics, label: "Happiness", icon: Heart, gradient: "from-primary to-primary/60" },
  { key: "health" as keyof LifeMetrics, label: "Health", icon: Activity, gradient: "from-success to-success/60" },
  { key: "impact" as keyof LifeMetrics, label: "Social Impact", icon: Globe, gradient: "from-destructive to-accent" },
];

const AdvancedMetrics = ({ metrics }: AdvancedMetricsProps) => {
  const avg = Math.round((metrics.wealth + metrics.happiness + metrics.health + metrics.impact) / 4);

  return (
    <div className="space-y-5">
      {/* Overall Score */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass rounded-2xl p-6 text-center glow-primary border-primary/20"
      >
        <div className="relative w-24 h-24 mx-auto mb-3">
          <svg className="w-24 h-24 -rotate-90" viewBox="0 0 96 96">
            <circle cx="48" cy="48" r="40" fill="none" stroke="hsl(var(--muted))" strokeWidth="6" />
            <circle
              cx="48" cy="48" r="40" fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={`${avg * 2.51} 251`}
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center font-display text-2xl font-black text-primary">
            {avg}
          </span>
        </div>
        <div className="text-sm text-muted-foreground font-body uppercase tracking-wider">Overall Life Score</div>
      </motion.div>

      {/* Individual Metrics */}
      <div className="grid grid-cols-2 gap-4">
        {metricsConfig.map((m, i) => {
          const Icon = m.icon;
          const val = metrics[m.key];
          return (
            <motion.div
              key={m.key}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.08 }}
              className="glass rounded-xl p-5 text-center relative overflow-hidden group"
            >
              <Icon className="w-6 h-6 text-primary mx-auto mb-2" />
              <div className="font-display text-3xl font-bold text-foreground mb-1">{Math.round(val)}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider font-body">{m.label}</div>
              <div className="mt-3 h-1.5 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className={`h-full rounded-full bg-gradient-to-r ${m.gradient}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${val}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default AdvancedMetrics;
