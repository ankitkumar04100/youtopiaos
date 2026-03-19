import { motion } from "framer-motion";
import { Sparkles, AlertTriangle } from "lucide-react";
import type { Decisions } from "./DecisionSliders";
import { calculateMetrics } from "./MetricsDisplay";

interface FutureVisualizationProps {
  decisions: Decisions;
}

const FutureVisualization = ({ decisions }: FutureVisualizationProps) => {
  const metrics = calculateMetrics(decisions);
  const avgScore = (metrics.wealth + metrics.happiness + metrics.health + metrics.impact) / 4;

  const idealFuture = {
    title: "Your Ideal Future",
    icon: Sparkles,
    score: Math.min(100, avgScore + 15),
    description: avgScore > 60
      ? "You're building an exceptional life. Your discipline and focus are creating compounding returns across all areas."
      : "With a few adjustments, this future is within reach. Increase focus and reduce distractions to unlock it.",
    highlights: [
      avgScore > 50 ? "Financial independence by 35" : "Stable career with growth potential",
      metrics.health > 60 ? "Peak physical and mental health" : "Improved energy and vitality",
      metrics.happiness > 60 ? "Deep, fulfilling relationships" : "Growing social connections",
      metrics.impact > 60 ? "Meaningful contribution to society" : "Finding your purpose",
    ],
    glowClass: "glow-success",
    borderClass: "border-success/30",
    textClass: "text-success",
    bgClass: "bg-success/5",
  };

  const negativeFuture = {
    title: "Your Shadow Future",
    icon: AlertTriangle,
    score: Math.max(0, 100 - avgScore - 10),
    description: avgScore < 40
      ? "Current patterns are leading toward stagnation. Every day of inaction compounds the gap."
      : "This future becomes less likely with your current trajectory, but complacency is the enemy.",
    highlights: [
      avgScore < 50 ? "Financial stress and debt cycles" : "Missed wealth opportunities",
      metrics.health < 40 ? "Chronic health issues emerging" : "Declining energy over time",
      metrics.happiness < 40 ? "Isolation and unfulfillment" : "Surface-level connections",
      metrics.impact < 40 ? "Regret over unrealized potential" : "Diminished influence",
    ],
    glowClass: "glow-destructive",
    borderClass: "border-destructive/30",
    textClass: "text-destructive",
    bgClass: "bg-destructive/5",
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {[idealFuture, negativeFuture].map((future, idx) => {
        const Icon = future.icon;
        return (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.2 }}
            className={`glass rounded-2xl p-6 ${future.borderClass} ${future.glowClass} relative overflow-hidden`}
          >
            {/* Background glow */}
            <div className={`absolute inset-0 ${future.bgClass} opacity-50`} />

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 rounded-lg ${future.bgClass}`}>
                  <Icon className={`w-5 h-5 ${future.textClass}`} />
                </div>
                <h3 className={`font-display text-lg font-bold ${future.textClass}`}>{future.title}</h3>
              </div>

              {/* Score ring */}
              <div className="flex items-center gap-4 mb-4">
                <div className="relative w-16 h-16">
                  <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
                    <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" className="text-muted" strokeWidth="4" />
                    <circle
                      cx="32" cy="32" r="28" fill="none"
                      stroke="currentColor"
                      className={future.textClass}
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeDasharray={`${future.score * 1.76} 176`}
                    />
                  </svg>
                  <span className={`absolute inset-0 flex items-center justify-center font-display text-sm font-bold ${future.textClass}`}>
                    {Math.round(future.score)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground font-body flex-1">{future.description}</p>
              </div>

              <ul className="space-y-2">
                {future.highlights.map((h, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
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

export default FutureVisualization;
