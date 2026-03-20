import { motion } from "framer-motion";
import { Brain, Target, Shield, Flame, Zap } from "lucide-react";
import type { BehavioralTraits, ConstraintWarnings } from "@/lib/simulation-engine";

interface BehavioralIntelligenceProps {
  traits: BehavioralTraits;
  warnings: ConstraintWarnings;
}

const traitConfig = [
  { key: "focusLevel" as keyof BehavioralTraits, label: "Focus Level", icon: Target, desc: "How well you concentrate on productive tasks" },
  { key: "consistencyScore" as keyof BehavioralTraits, label: "Consistency", icon: Shield, desc: "How regular and predictable your habits are" },
  { key: "disciplineLevel" as keyof BehavioralTraits, label: "Discipline", icon: Brain, desc: "Ability to delay gratification for long-term gains" },
  { key: "riskTaking" as keyof BehavioralTraits, label: "Risk Taking", icon: Flame, desc: "Willingness to pursue ambitious goals" },
  { key: "stressTolerance" as keyof BehavioralTraits, label: "Stress Tolerance", icon: Zap, desc: "Capacity to handle pressure without breaking down" },
];

const warningConfig = [
  { key: "burnoutRisk" as keyof ConstraintWarnings, label: "Burnout Risk", color: "destructive" },
  { key: "healthDecline" as keyof ConstraintWarnings, label: "Health Decline", color: "destructive" },
  { key: "isolationRisk" as keyof ConstraintWarnings, label: "Isolation Risk", color: "accent" },
  { key: "stagnationRisk" as keyof ConstraintWarnings, label: "Stagnation Risk", color: "accent" },
];

const getTraitLevel = (v: number) => {
  if (v >= 80) return { label: "Exceptional", color: "text-success" };
  if (v >= 60) return { label: "Strong", color: "text-primary" };
  if (v >= 40) return { label: "Average", color: "text-accent" };
  if (v >= 20) return { label: "Developing", color: "text-muted-foreground" };
  return { label: "Critical", color: "text-destructive" };
};

const BehavioralIntelligence = ({ traits, warnings }: BehavioralIntelligenceProps) => {
  return (
    <div className="space-y-6">
      {/* Traits */}
      <div>
        <h3 className="font-display text-lg font-bold text-foreground mb-4 flex items-center gap-2">
          <Brain className="w-5 h-5 text-primary" /> Behavioral Profile
        </h3>
        <div className="space-y-3">
          {traitConfig.map((cfg, i) => {
            const Icon = cfg.icon;
            const val = traits[cfg.key];
            const level = getTraitLevel(val);
            return (
              <motion.div
                key={cfg.key}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                className="glass rounded-xl p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-primary" />
                    <div>
                      <span className="font-body text-sm text-foreground">{cfg.label}</span>
                      <span className={`ml-2 text-xs font-display ${level.color}`}>{level.label}</span>
                    </div>
                  </div>
                  <span className="font-display text-sm font-bold text-primary">{val}</span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-primary"
                    initial={{ width: 0 }}
                    animate={{ width: `${val}%` }}
                    transition={{ duration: 0.6, delay: i * 0.06 }}
                  />
                </div>
                <p className="text-xs text-muted-foreground font-body mt-2">{cfg.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Constraint Warnings */}
      <div>
        <h3 className="font-display text-lg font-bold text-foreground mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-accent" /> Risk Assessment
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {warningConfig.map((cfg, i) => {
            const val = warnings[cfg.key];
            const isHigh = val > 50;
            return (
              <motion.div
                key={cfg.key}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.06 }}
                className={`glass rounded-xl p-4 text-center ${isHigh ? `border-${cfg.color}/30 glow-${cfg.color}` : ""}`}
              >
                <div className={`font-display text-2xl font-bold ${isHigh ? `text-${cfg.color}` : "text-muted-foreground"}`}>
                  {val}%
                </div>
                <div className="text-xs text-muted-foreground font-body mt-1">{cfg.label}</div>
                {isHigh && (
                  <div className={`text-[10px] text-${cfg.color} font-display mt-1`}>⚠ HIGH</div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BehavioralIntelligence;
