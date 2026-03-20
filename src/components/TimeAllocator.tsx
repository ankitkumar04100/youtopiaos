import { motion } from "framer-motion";
import { Slider } from "@/components/ui/slider";
import { Briefcase, Moon, Dumbbell, Users, Gamepad2, BookOpen, AlertTriangle, CheckCircle2 } from "lucide-react";
import type { TimeAllocation } from "@/lib/simulation-engine";
import { getRemainingHours } from "@/lib/simulation-engine";

interface TimeAllocatorProps {
  allocation: TimeAllocation;
  onChange: (a: TimeAllocation) => void;
}

const sliders = [
  { key: "work" as keyof TimeAllocation, label: "Work / Study", icon: Briefcase, max: 16, color: "primary" },
  { key: "sleep" as keyof TimeAllocation, label: "Sleep", icon: Moon, max: 12, color: "primary" },
  { key: "exercise" as keyof TimeAllocation, label: "Exercise", icon: Dumbbell, max: 6, color: "primary" },
  { key: "social" as keyof TimeAllocation, label: "Social / Relationships", icon: Users, max: 8, color: "primary" },
  { key: "entertainment" as keyof TimeAllocation, label: "Entertainment", icon: Gamepad2, max: 10, color: "destructive" },
  { key: "learning" as keyof TimeAllocation, label: "Learning / Growth", icon: BookOpen, max: 8, color: "primary" },
];

const TimeAllocator = ({ allocation, onChange }: TimeAllocatorProps) => {
  const remaining = getRemainingHours(allocation);
  const total = 24 - remaining;
  const isOver = remaining < 0;
  const isPerfect = remaining === 0;

  const handleChange = (key: keyof TimeAllocation, value: number[]) => {
    const newVal = value[0];
    const newAlloc = { ...allocation, [key]: newVal };
    // Allow setting but show warning
    onChange(newAlloc);
  };

  return (
    <div className="space-y-5">
      {/* 24h Status Bar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`glass rounded-xl p-4 flex items-center justify-between ${
          isOver ? "border-destructive/40 glow-destructive" : isPerfect ? "border-success/40 glow-success" : ""
        }`}
      >
        <div className="flex items-center gap-3">
          {isOver ? (
            <AlertTriangle className="w-5 h-5 text-destructive" />
          ) : isPerfect ? (
            <CheckCircle2 className="w-5 h-5 text-success" />
          ) : (
            <div className="w-5 h-5 rounded-full border-2 border-primary flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-primary" />
            </div>
          )}
          <div>
            <span className="font-display text-sm font-bold text-foreground">
              {total}h / 24h allocated
            </span>
            <span className={`ml-2 text-xs font-body ${isOver ? "text-destructive" : remaining > 0 ? "text-accent" : "text-success"}`}>
              {isOver ? `${Math.abs(remaining)}h over!` : remaining > 0 ? `${remaining}h remaining` : "Perfect ✓"}
            </span>
          </div>
        </div>
        {/* Mini bar */}
        <div className="w-32 h-2 bg-muted rounded-full overflow-hidden hidden sm:block">
          <motion.div
            className={`h-full rounded-full ${isOver ? "bg-destructive" : isPerfect ? "bg-success" : "bg-primary"}`}
            animate={{ width: `${Math.min(100, (total / 24) * 100)}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </motion.div>

      {/* Sliders */}
      {sliders.map((config, i) => {
        const Icon = config.icon;
        const value = allocation[config.key];
        const isNeg = config.color === "destructive";

        return (
          <motion.div
            key={config.key}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06 }}
            className="glass rounded-xl p-4 group hover:border-primary/30 transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${isNeg ? "bg-destructive/10" : "bg-primary/10"}`}>
                  <Icon className={`w-4 h-4 ${isNeg ? "text-destructive" : "text-primary"}`} />
                </div>
                <span className="font-body text-sm text-foreground">{config.label}</span>
              </div>
              <span className={`font-display text-sm font-bold ${isNeg ? "text-destructive" : "text-primary"}`}>
                {value}h
              </span>
            </div>
            <Slider
              value={[value]}
              onValueChange={(v) => handleChange(config.key, v)}
              min={0}
              max={config.max}
              step={0.5}
              className="w-full"
            />
          </motion.div>
        );
      })}
    </div>
  );
};

export default TimeAllocator;
