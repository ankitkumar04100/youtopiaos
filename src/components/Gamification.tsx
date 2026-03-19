import { motion } from "framer-motion";
import { Flame, Trophy, Star, Target, Zap, Crown, Award, TrendingUp } from "lucide-react";
import type { Decisions } from "./DecisionSliders";
import { calculateMetrics } from "./MetricsDisplay";

interface GamificationProps {
  decisions: Decisions;
  streakCount: number;
  achievements: string[];
}

const allAchievements = [
  { id: "first_sim", label: "First Simulation", desc: "Run your first life simulation", icon: Star, condition: () => true },
  { id: "balanced", label: "Balanced Life", desc: "All metrics above 50", icon: Target, condition: (m: any) => m.wealth > 50 && m.happiness > 50 && m.health > 50 && m.impact > 50 },
  { id: "health_nut", label: "Health Nut", desc: "Health score above 80", icon: Zap, condition: (m: any) => m.health > 80 },
  { id: "scholar", label: "Scholar", desc: "Study time 8+ hours", icon: Award, condition: (_m: any, d: Decisions) => d.studyTime >= 8 },
  { id: "iron_will", label: "Iron Will", desc: "Discipline at 9+", icon: Crown, condition: (_m: any, d: Decisions) => d.discipline >= 9 },
  { id: "digital_detox", label: "Digital Detox", desc: "Social media under 1hr", icon: TrendingUp, condition: (_m: any, d: Decisions) => d.socialMedia <= 1 },
  { id: "peak_performer", label: "Peak Performer", desc: "Average score above 80", icon: Trophy, condition: (m: any) => (m.wealth + m.happiness + m.health + m.impact) / 4 > 80 },
  { id: "early_bird", label: "Early Bird", desc: "Sleep 8+ hours", icon: Star, condition: (_m: any, d: Decisions) => d.sleepHours >= 8 },
];

const Gamification = ({ decisions, streakCount, achievements }: GamificationProps) => {
  const metrics = calculateMetrics(decisions);

  const earnedIds = new Set(achievements);
  allAchievements.forEach((a) => {
    if (a.condition(metrics, decisions)) earnedIds.add(a.id);
  });

  return (
    <div className="space-y-6">
      {/* Streak */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-6 glow-accent border-accent/20 text-center"
      >
        <Flame className="w-10 h-10 text-accent mx-auto mb-2" />
        <div className="font-display text-4xl font-black text-accent">{streakCount}</div>
        <div className="text-sm text-muted-foreground font-body uppercase tracking-wider">Day Streak</div>
        <p className="text-xs text-muted-foreground/70 font-body mt-2">
          Simulate daily to build your streak. Consistency is the key to transformation.
        </p>
      </motion.div>

      {/* Milestones */}
      <div>
        <h3 className="font-display text-lg font-bold text-foreground mb-4 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-accent" /> Achievements
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {allAchievements.map((ach, i) => {
            const Icon = ach.icon;
            const earned = earnedIds.has(ach.id);
            return (
              <motion.div
                key={ach.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className={`glass rounded-xl p-4 text-center transition-all ${
                  earned ? "border-accent/30 glow-accent" : "opacity-40"
                }`}
              >
                <Icon className={`w-6 h-6 mx-auto mb-2 ${earned ? "text-accent" : "text-muted-foreground"}`} />
                <div className={`text-xs font-display font-bold ${earned ? "text-foreground" : "text-muted-foreground"}`}>
                  {ach.label}
                </div>
                <div className="text-[10px] text-muted-foreground font-body mt-1">{ach.desc}</div>
                {earned && (
                  <div className="mt-2 text-[10px] text-accent font-display tracking-wider">UNLOCKED ✓</div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export { allAchievements };
export default Gamification;
