import { motion } from "framer-motion";
import { Flame, Trophy, Star, Target, Zap, Crown, Award, TrendingUp, Moon, BookOpen, Dumbbell, Shield } from "lucide-react";
import type { LifeMetrics, TimeAllocation } from "@/lib/simulation-engine";

interface GamificationProps {
  metrics: LifeMetrics;
  allocation: TimeAllocation;
  streakCount: number;
  achievements: string[];
}

const allAchievements = [
  { id: "first_sim", label: "First Simulation", desc: "Run your first life simulation", icon: Star, condition: () => true },
  { id: "balanced", label: "Balanced Life", desc: "All metrics above 50", icon: Target, condition: (m: LifeMetrics) => m.wealth > 50 && m.happiness > 50 && m.health > 50 && m.impact > 50 },
  { id: "health_nut", label: "Health Nut", desc: "Health score above 80", icon: Zap, condition: (m: LifeMetrics) => m.health > 80 },
  { id: "scholar", label: "Scholar", desc: "Learning 3+ hours/day", icon: BookOpen, condition: (_m: LifeMetrics, a: TimeAllocation) => a.learning >= 3 },
  { id: "iron_will", label: "Iron Will", desc: "Work 10+ hours with perfect sleep", icon: Crown, condition: (_m: LifeMetrics, a: TimeAllocation) => a.work >= 10 && a.sleep >= 7 },
  { id: "digital_detox", label: "Digital Detox", desc: "Entertainment under 1hr", icon: Shield, condition: (_m: LifeMetrics, a: TimeAllocation) => a.entertainment <= 1 },
  { id: "peak_performer", label: "Peak Performer", desc: "Average score above 80", icon: Trophy, condition: (m: LifeMetrics) => (m.wealth + m.happiness + m.health + m.impact) / 4 > 80 },
  { id: "early_bird", label: "Early Bird", desc: "Sleep 8+ hours", icon: Moon, condition: (_m: LifeMetrics, a: TimeAllocation) => a.sleep >= 8 },
  { id: "athlete", label: "Athlete", desc: "Exercise 2+ hours/day", icon: Dumbbell, condition: (_m: LifeMetrics, a: TimeAllocation) => a.exercise >= 2 },
  { id: "social_butterfly", label: "Social Butterfly", desc: "Social time 3+ hours", icon: Award, condition: (_m: LifeMetrics, a: TimeAllocation) => a.social >= 3 },
  { id: "wealth_builder", label: "Wealth Builder", desc: "Wealth score above 80", icon: TrendingUp, condition: (m: LifeMetrics) => m.wealth > 80 },
  { id: "impact_maker", label: "Impact Maker", desc: "Impact score above 80", icon: Star, condition: (m: LifeMetrics) => m.impact > 80 },
];

const Gamification = ({ metrics, allocation, streakCount, achievements }: GamificationProps) => {
  const earnedIds = new Set(achievements);
  allAchievements.forEach((a) => {
    if (a.condition(metrics, allocation)) earnedIds.add(a.id);
  });
  const earnedCount = earnedIds.size;

  return (
    <div className="space-y-6">
      {/* Streak + Progress */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-5 glow-accent border-accent/20 text-center"
        >
          <Flame className="w-8 h-8 text-accent mx-auto mb-2" />
          <div className="font-display text-3xl font-black text-accent">{streakCount}</div>
          <div className="text-xs text-muted-foreground font-body uppercase tracking-wider">Day Streak</div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-5 border-primary/20 text-center"
        >
          <Trophy className="w-8 h-8 text-primary mx-auto mb-2" />
          <div className="font-display text-3xl font-black text-primary">{earnedCount}/{allAchievements.length}</div>
          <div className="text-xs text-muted-foreground font-body uppercase tracking-wider">Achievements</div>
        </motion.div>
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {allAchievements.map((ach, i) => {
          const Icon = ach.icon;
          const earned = earnedIds.has(ach.id);
          return (
            <motion.div
              key={ach.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.04 }}
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
  );
};

export { allAchievements };
export default Gamification;
