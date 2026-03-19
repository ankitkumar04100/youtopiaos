import { motion } from "framer-motion";
import { Slider } from "@/components/ui/slider";
import { BookOpen, Moon, Smartphone, Dumbbell, Brain, Clock } from "lucide-react";

export interface Decisions {
  studyTime: number;
  sleepHours: number;
  socialMedia: number;
  exercise: number;
  discipline: number;
  screenTime: number;
}

interface DecisionSlidersProps {
  decisions: Decisions;
  onChange: (decisions: Decisions) => void;
}

const sliderConfig = [
  { key: "studyTime" as keyof Decisions, label: "Study / Work Focus", icon: BookOpen, min: 0, max: 10, unit: "hrs", color: "primary" },
  { key: "sleepHours" as keyof Decisions, label: "Sleep Quality", icon: Moon, min: 0, max: 10, unit: "hrs", color: "primary" },
  { key: "socialMedia" as keyof Decisions, label: "Social Media Usage", icon: Smartphone, min: 0, max: 10, unit: "hrs", color: "destructive" },
  { key: "exercise" as keyof Decisions, label: "Physical Activity", icon: Dumbbell, min: 0, max: 10, unit: "hrs", color: "primary" },
  { key: "discipline" as keyof Decisions, label: "Self Discipline", icon: Brain, min: 0, max: 10, unit: "/10", color: "primary" },
  { key: "screenTime" as keyof Decisions, label: "Mindless Screen Time", icon: Clock, min: 0, max: 10, unit: "hrs", color: "destructive" },
];

const DecisionSliders = ({ decisions, onChange }: DecisionSlidersProps) => {
  const handleChange = (key: keyof Decisions, value: number[]) => {
    onChange({ ...decisions, [key]: value[0] });
  };

  return (
    <div className="space-y-6">
      {sliderConfig.map((config, i) => {
        const Icon = config.icon;
        const value = decisions[config.key];
        const isNegative = config.color === "destructive";

        return (
          <motion.div
            key={config.key}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
            className="glass rounded-xl p-4 group hover:border-primary/30 transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${isNegative ? "bg-destructive/10" : "bg-primary/10"}`}>
                  <Icon className={`w-4 h-4 ${isNegative ? "text-destructive" : "text-primary"}`} />
                </div>
                <span className="font-body text-sm text-foreground">{config.label}</span>
              </div>
              <span className={`font-display text-sm font-bold ${isNegative ? "text-destructive" : "text-primary"}`}>
                {value}{config.unit}
              </span>
            </div>
            <Slider
              value={[value]}
              onValueChange={(v) => handleChange(config.key, v)}
              min={config.min}
              max={config.max}
              step={1}
              className="w-full"
            />
          </motion.div>
        );
      })}
    </div>
  );
};

export default DecisionSliders;
