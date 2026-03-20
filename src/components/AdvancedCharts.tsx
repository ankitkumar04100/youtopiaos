import { useState } from "react";
import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";
import { Button } from "@/components/ui/button";
import type { YearProjection, LifeMetrics, BehavioralTraits } from "@/lib/simulation-engine";

interface AdvancedChartsProps {
  projections: YearProjection[];
  metrics: LifeMetrics;
  traits: BehavioralTraits;
  history: Array<{ metrics: any; date: string }>;
}

const chartColors = {
  wealth: "hsl(45, 100%, 50%)",
  happiness: "hsl(187, 100%, 50%)",
  health: "hsl(145, 100%, 45%)",
  impact: "hsl(348, 100%, 55%)",
};

const AdvancedCharts = ({ projections, metrics, traits, history }: AdvancedChartsProps) => {
  const [view, setView] = useState<"projection" | "radar" | "history">("projection");

  const projData = projections.map((p) => ({
    year: `Y${p.year}`,
    ...p,
  }));

  const radarData = [
    { trait: "Focus", value: traits.focusLevel },
    { trait: "Consistency", value: traits.consistencyScore },
    { trait: "Discipline", value: traits.disciplineLevel },
    { trait: "Risk", value: traits.riskTaking },
    { trait: "Stress Tol.", value: traits.stressTolerance },
    { trait: "Wealth", value: metrics.wealth },
    { trait: "Happiness", value: metrics.happiness },
    { trait: "Health", value: metrics.health },
  ];

  const histData = history.slice(-15).map((h, i) => ({
    session: `#${i + 1}`,
    ...h.metrics,
  }));

  return (
    <div className="space-y-5">
      {/* View Selector */}
      <div className="flex gap-2">
        {[
          { id: "projection" as const, label: "10-Year Projection" },
          { id: "radar" as const, label: "Profile Radar" },
          { id: "history" as const, label: "History" },
        ].map((v) => (
          <Button
            key={v.id}
            variant={view === v.id ? "default" : "outline"}
            size="sm"
            onClick={() => setView(v.id)}
            className={view === v.id
              ? "bg-primary text-primary-foreground font-display text-xs"
              : "border-primary/30 text-primary hover:bg-primary/10 font-display text-xs"
            }
          >
            {v.label}
          </Button>
        ))}
      </div>

      {/* Projection Chart */}
      {view === "projection" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-2xl p-5">
          <h3 className="font-display text-sm font-bold text-foreground mb-3">10-Year Life Projection</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={projData}>
                <defs>
                  {Object.entries(chartColors).map(([key, color]) => (
                    <linearGradient key={key} id={`adv-${key}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={color} stopOpacity={0.3} />
                      <stop offset="100%" stopColor={color} stopOpacity={0} />
                    </linearGradient>
                  ))}
                </defs>
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
                {Object.entries(chartColors).map(([key, color]) => (
                  <Area key={key} type="monotone" dataKey={key} stroke={color} fill={`url(#adv-${key})`} strokeWidth={2} />
                ))}
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-4 mt-3 justify-center">
            {Object.entries(chartColors).map(([key, color]) => (
              <div key={key} className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                <span className="text-xs text-muted-foreground capitalize font-body">{key}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Radar Chart */}
      {view === "radar" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-2xl p-5">
          <h3 className="font-display text-sm font-bold text-foreground mb-3">Profile Radar</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="hsl(222, 30%, 18%)" />
                <PolarAngleAxis dataKey="trait" tick={{ fill: "hsl(215, 15%, 55%)", fontSize: 10 }} />
                <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                <Radar dataKey="value" stroke="hsl(187, 100%, 50%)" fill="hsl(187, 100%, 50%)" fillOpacity={0.2} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      )}

      {/* History */}
      {view === "history" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-2xl p-5">
          <h3 className="font-display text-sm font-bold text-foreground mb-3">Simulation History</h3>
          {histData.length > 0 ? (
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={histData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 18%)" />
                  <XAxis dataKey="session" tick={{ fill: "hsl(215, 15%, 55%)", fontSize: 10 }} />
                  <YAxis domain={[0, 100]} tick={{ fill: "hsl(215, 15%, 55%)", fontSize: 10 }} />
                  <Tooltip contentStyle={{
                    background: "hsl(222, 40%, 10%)",
                    border: "1px solid hsl(222, 30%, 22%)",
                    borderRadius: "8px",
                    color: "hsl(200, 20%, 90%)",
                    fontSize: 11,
                  }} />
                  {Object.entries(chartColors).map(([key, color]) => (
                    <Area key={key} type="monotone" dataKey={key} stroke={color} fill="transparent" strokeWidth={2} />
                  ))}
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground font-body">Save simulations to see your history</p>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default AdvancedCharts;
