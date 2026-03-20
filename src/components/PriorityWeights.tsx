import { motion } from "framer-motion";
import { Slider } from "@/components/ui/slider";
import { Briefcase, Heart, Smile, Users, AlertTriangle, CheckCircle2 } from "lucide-react";
import type { Priorities } from "@/lib/simulation-engine";

interface PriorityWeightsProps {
  priorities: Priorities;
  onChange: (p: Priorities) => void;
}

const priorityConfig = [
  { key: "career" as keyof Priorities, label: "Career", icon: Briefcase, color: "hsl(var(--primary))" },
  { key: "health" as keyof Priorities, label: "Health", icon: Heart, color: "hsl(var(--success))" },
  { key: "happiness" as keyof Priorities, label: "Happiness", icon: Smile, color: "hsl(var(--accent))" },
  { key: "socialLife" as keyof Priorities, label: "Social Life", icon: Users, color: "hsl(var(--destructive))" },
];

const PriorityWeights = ({ priorities, onChange }: PriorityWeightsProps) => {
  const total = Object.values(priorities).reduce((s, v) => s + v, 0);
  const isValid = total === 100;

  const handleChange = (key: keyof Priorities, value: number[]) => {
    onChange({ ...priorities, [key]: value[0] });
  };

  return (
    <div className="space-y-5">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`glass rounded-xl p-4 flex items-center justify-between ${
          isValid ? "border-success/40" : "border-accent/40"
        }`}
      >
        <div className="flex items-center gap-3">
          {isValid ? (
            <CheckCircle2 className="w-5 h-5 text-success" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-accent" />
          )}
          <span className="font-display text-sm font-bold text-foreground">
            Total: {total}%
          </span>
          <span className={`text-xs font-body ${isValid ? "text-success" : "text-accent"}`}>
            {isValid ? "Balanced ✓" : `${total > 100 ? "Over" : "Under"} by ${Math.abs(100 - total)}%`}
          </span>
        </div>
      </motion.div>

      {/* Visual weight bar */}
      <div className="h-4 rounded-full overflow-hidden flex bg-muted">
        {priorityConfig.map((cfg) => (
          <motion.div
            key={cfg.key}
            animate={{ width: `${priorities[cfg.key]}%` }}
            transition={{ duration: 0.3 }}
            className="h-full"
            style={{ backgroundColor: cfg.color }}
          />
        ))}
      </div>

      {priorityConfig.map((cfg, i) => {
        const Icon = cfg.icon;
        return (
          <motion.div
            key={cfg.key}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06 }}
            className="glass rounded-xl p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg" style={{ backgroundColor: `${cfg.color}20` }}>
                  <Icon className="w-4 h-4" style={{ color: cfg.color }} />
                </div>
                <span className="font-body text-sm text-foreground">{cfg.label}</span>
              </div>
              <span className="font-display text-sm font-bold" style={{ color: cfg.color }}>
                {priorities[cfg.key]}%
              </span>
            </div>
            <Slider
              value={[priorities[cfg.key]]}
              onValueChange={(v) => handleChange(cfg.key, v)}
              min={0}
              max={100}
              step={5}
              className="w-full"
            />
          </motion.div>
        );
      })}
    </div>
  );
};

export default PriorityWeights;
