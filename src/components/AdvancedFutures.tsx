import { motion } from "framer-motion";
import { Sparkles, AlertTriangle, TrendingUp, TrendingDown } from "lucide-react";
import type { LifeMetrics, ConstraintWarnings, YearProjection } from "@/lib/simulation-engine";

interface AdvancedFuturesProps {
  metrics: LifeMetrics;
  warnings: ConstraintWarnings;
  projections: YearProjection[];
}

const AdvancedFutures = ({ metrics, warnings, projections }: AdvancedFuturesProps) => {
  const avg = (metrics.wealth + metrics.happiness + metrics.health + metrics.impact) / 4;
  const y10 = projections[10];
  const y10Avg = y10 ? (y10.wealth + y10.happiness + y10.health + y10.impact) / 4 : avg;
  const isGrowing = y10Avg > avg;

  const idealFuture = {
    title: "Your Ideal Future",
    icon: Sparkles,
    score: Math.min(100, avg + 15),
    year10Score: Math.min(100, y10Avg + 10),
    description: avg > 60
      ? "You're on a trajectory toward an exceptional life. Discipline and consistency are compounding in your favor."
      : "This future is within reach. A few key habit adjustments unlock exponential growth over the next decade.",
    highlights: [
      y10 && y10.wealth > 70 ? "Financial independence achieved" : "Steady wealth accumulation",
      y10 && y10.health > 70 ? "Peak physical and mental vitality" : "Improving health trajectory",
      y10 && y10.happiness > 70 ? "Deep fulfillment and purpose" : "Growing sense of contentment",
      y10 && y10.impact > 70 ? "Significant societal contribution" : "Expanding positive influence",
    ],
    trend: isGrowing ? "Trajectory: Upward ↗" : "Trajectory: Stable →",
    glowClass: "glow-success",
    borderClass: "border-success/30",
    textClass: "text-success",
    bgClass: "bg-success/5",
  };

  const shadowFuture = {
    title: "Your Shadow Future",
    icon: AlertTriangle,
    score: Math.max(0, 100 - avg - 10),
    year10Score: Math.max(0, 100 - y10Avg),
    description: avg < 40
      ? "Current patterns compound toward stagnation. The gap between where you are and where you could be widens each year."
      : "This future fades as your habits improve, but complacency remains the silent threat.",
    highlights: [
      warnings.burnoutRisk > 50 ? "⚠ High burnout risk: career collapse" : "Missed career milestones",
      warnings.healthDecline > 50 ? "⚠ Health crisis by year 5" : "Gradual energy decline",
      warnings.isolationRisk > 50 ? "⚠ Social isolation deepens" : "Weakening relationships",
      warnings.stagnationRisk > 50 ? "⚠ Complete skill stagnation" : "Falling behind peers",
    ],
    trend: !isGrowing ? "Trajectory: Downward ↘" : "Trajectory: Fading ↗",
    glowClass: "glow-destructive",
    borderClass: "border-destructive/30",
    textClass: "text-destructive",
    bgClass: "bg-destructive/5",
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {[idealFuture, shadowFuture].map((future, idx) => {
        const Icon = future.icon;
        return (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.2 }}
            className={`glass rounded-2xl p-6 ${future.borderClass} ${future.glowClass} relative overflow-hidden`}
          >
            <div className={`absolute inset-0 ${future.bgClass} opacity-50`} />

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 rounded-lg ${future.bgClass}`}>
                  <Icon className={`w-5 h-5 ${future.textClass}`} />
                </div>
                <div>
                  <h3 className={`font-display text-lg font-bold ${future.textClass}`}>{future.title}</h3>
                  <span className={`text-xs font-body ${future.textClass} opacity-70`}>{future.trend}</span>
                </div>
              </div>

              {/* Score comparison: now vs 10yr */}
              <div className="flex items-center gap-4 mb-4">
                <div className="text-center">
                  <div className={`font-display text-2xl font-black ${future.textClass}`}>
                    {Math.round(future.score)}
                  </div>
                  <div className="text-[10px] text-muted-foreground font-body">Now</div>
                </div>
                {idx === 0 ? (
                  <TrendingUp className="w-5 h-5 text-success" />
                ) : (
                  <TrendingDown className="w-5 h-5 text-destructive" />
                )}
                <div className="text-center">
                  <div className={`font-display text-2xl font-black ${future.textClass}`}>
                    {Math.round(future.year10Score)}
                  </div>
                  <div className="text-[10px] text-muted-foreground font-body">10 Years</div>
                </div>
              </div>

              <p className="text-sm text-muted-foreground font-body mb-4">{future.description}</p>

              <ul className="space-y-2">
                {future.highlights.map((h, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.08 }}
                    className="flex items-start gap-2 text-sm font-body"
                  >
                    <span className={`mt-1.5 w-1.5 h-1.5 rounded-full ${future.textClass} bg-current flex-shrink-0`} />
                    <span className="text-foreground/80">{h}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default AdvancedFutures;
