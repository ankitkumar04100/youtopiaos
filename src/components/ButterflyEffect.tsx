import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { TimeAllocation, Priorities, LifeMetrics, BehavioralTraits } from "@/lib/simulation-engine";
import { inferTraits, calculateLifeMetrics, simulateYears } from "@/lib/simulation-engine";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface ButterflyEffectProps {
  allocation: TimeAllocation;
  priorities: Priorities;
  metrics: LifeMetrics;
  traits: BehavioralTraits;
}

const ButterflyEffect = ({ allocation, priorities, metrics, traits }: ButterflyEffectProps) => {
  const [tweakType, setTweakType] = useState<string | null>(null);

  const tweaks = [
    { id: "sleep1", label: "+1h Sleep", apply: (a: TimeAllocation) => ({ ...a, sleep: Math.min(12, a.sleep + 1), entertainment: Math.max(0, a.entertainment - 1) }) },
    { id: "exercise1", label: "+1h Exercise", apply: (a: TimeAllocation) => ({ ...a, exercise: Math.min(6, a.exercise + 1), entertainment: Math.max(0, a.entertainment - 1) }) },
    { id: "learn1", label: "+1h Learning", apply: (a: TimeAllocation) => ({ ...a, learning: Math.min(8, a.learning + 1), entertainment: Math.max(0, a.entertainment - 1) }) },
    { id: "lessEntertain", label: "-2h Entertainment", apply: (a: TimeAllocation) => ({ ...a, entertainment: Math.max(0, a.entertainment - 2), learning: a.learning + 1, exercise: a.exercise + 1 }) },
  ];

  const baseProjection = simulateYears(metrics, allocation, traits, 10);

  const selectedTweak = tweaks.find((t) => t.id === tweakType);
  const tweakedAlloc = selectedTweak ? selectedTweak.apply(allocation) : allocation;
  const tweakedTraits = inferTraits(tweakedAlloc, priorities);
  const tweakedMetrics = calculateLifeMetrics(tweakedAlloc, priorities, tweakedTraits);
  const tweakedProjection = simulateYears(tweakedMetrics, tweakedAlloc, tweakedTraits, 10);

  const chartData = baseProjection.map((bp, i) => ({
    year: `Year ${bp.year}`,
    baseAvg: Math.round((bp.wealth + bp.happiness + bp.health + bp.impact) / 4),
    tweakedAvg: tweakType
      ? Math.round(
          (tweakedProjection[i].wealth + tweakedProjection[i].happiness + tweakedProjection[i].health + tweakedProjection[i].impact) / 4
        )
      : null,
  }));

  const diff10 = tweakType
    ? chartData[10].tweakedAvg! - chartData[10].baseAvg
    : 0;

  return (
    <div className="space-y-5">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-6 glow-primary border-primary/20 text-center"
      >
        <Sparkles className="w-8 h-8 text-primary mx-auto mb-3" />
        <h3 className="font-display text-xl font-bold text-foreground mb-2">The Butterfly Effect</h3>
        <p className="text-sm text-muted-foreground font-body mb-4">
          Small daily changes create massive long-term differences. Choose a tweak to see the impact.
        </p>

        <div className="flex flex-wrap gap-2 justify-center">
          {tweaks.map((t) => (
            <Button
              key={t.id}
              variant={tweakType === t.id ? "default" : "outline"}
              size="sm"
              onClick={() => setTweakType(tweakType === t.id ? null : t.id)}
              className={tweakType === t.id
                ? "bg-primary text-primary-foreground font-display text-xs"
                : "border-primary/30 text-primary hover:bg-primary/10 font-display text-xs"
              }
            >
              {t.label}
            </Button>
          ))}
          {tweakType && (
            <Button variant="ghost" size="sm" onClick={() => setTweakType(null)} className="text-muted-foreground text-xs">
              <RotateCcw className="w-3 h-3 mr-1" /> Reset
            </Button>
          )}
        </div>
      </motion.div>

      {/* Chart */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-2xl p-5">
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 18%)" />
              <XAxis dataKey="year" tick={{ fill: "hsl(215, 15%, 55%)", fontSize: 10 }} />
              <YAxis domain={[0, 100]} tick={{ fill: "hsl(215, 15%, 55%)", fontSize: 10 }} />
              <Tooltip contentStyle={{
                background: "hsl(222, 40%, 10%)",
                border: "1px solid hsl(222, 30%, 22%)",
                borderRadius: "8px",
                color: "hsl(200, 20%, 90%)",
                fontSize: 11,
              }} />
              <Line type="monotone" dataKey="baseAvg" stroke="hsl(215, 15%, 55%)" strokeWidth={2} name="Current Path" strokeDasharray="5 5" dot={false} />
              {tweakType && (
                <Line type="monotone" dataKey="tweakedAvg" stroke="hsl(187, 100%, 50%)" strokeWidth={2} name="Tweaked Path" dot={false} />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center justify-center gap-4 mt-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-0.5 bg-muted-foreground" style={{ borderTop: "2px dashed hsl(215, 15%, 55%)" }} />
            <span className="text-xs text-muted-foreground font-body">Current Path</span>
          </div>
          {tweakType && (
            <div className="flex items-center gap-2">
              <div className="w-6 h-0.5 bg-primary" />
              <span className="text-xs text-primary font-body">Tweaked Path</span>
            </div>
          )}
        </div>
      </motion.div>

      {/* Impact Summary */}
      {tweakType && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className={`glass rounded-xl p-4 text-center ${diff10 > 0 ? "border-success/30" : "border-destructive/30"}`}
        >
          <div className="flex items-center justify-center gap-2 mb-1">
            <ArrowRight className={`w-4 h-4 ${diff10 > 0 ? "text-success" : "text-destructive"}`} />
            <span className={`font-display text-lg font-bold ${diff10 > 0 ? "text-success" : "text-destructive"}`}>
              {diff10 > 0 ? "+" : ""}{diff10} points
            </span>
          </div>
          <p className="text-xs text-muted-foreground font-body">
            In 10 years, this small change shifts your overall life score by {Math.abs(diff10)} points.
            {diff10 > 5 && " That's the butterfly effect in action."}
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default ButterflyEffect;
