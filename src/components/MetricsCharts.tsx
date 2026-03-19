import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import type { Decisions } from "./DecisionSliders";
import { calculateMetrics } from "./MetricsDisplay";

interface MetricsChartsProps {
  decisions: Decisions;
  history: Array<{ decisions: Decisions; metrics: any; date: string }>;
}

const MetricsCharts = ({ decisions, history }: MetricsChartsProps) => {
  const currentMetrics = calculateMetrics(decisions);

  // Generate projected 10-year timeline based on current decisions
  const projectionData = Array.from({ length: 11 }, (_, year) => {
    const decay = decisions.socialMedia * 0.02 + decisions.screenTime * 0.015;
    const growth = decisions.studyTime * 0.03 + decisions.exercise * 0.025 + decisions.discipline * 0.02;
    const factor = 1 + (growth - decay) * year * 0.1;

    return {
      year: `Year ${year}`,
      wealth: Math.min(100, Math.max(0, Math.round(currentMetrics.wealth * factor))),
      happiness: Math.min(100, Math.max(0, Math.round(currentMetrics.happiness * (factor * 0.95)))),
      health: Math.min(100, Math.max(0, Math.round(currentMetrics.health * (factor * 0.9)))),
      impact: Math.min(100, Math.max(0, Math.round(currentMetrics.impact * factor))),
    };
  });

  // History data for past simulations
  const historyData = history.length > 0
    ? history.slice(-10).map((h, i) => ({
        session: `#${i + 1}`,
        ...h.metrics,
      }))
    : null;

  const chartColors = {
    wealth: "hsl(45, 100%, 50%)",
    happiness: "hsl(187, 100%, 50%)",
    health: "hsl(145, 100%, 45%)",
    impact: "hsl(348, 100%, 55%)",
  };

  return (
    <div className="space-y-6">
      {/* Projected Future */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-6"
      >
        <h3 className="font-display text-lg font-bold text-foreground mb-1">10-Year Projection</h3>
        <p className="text-xs text-muted-foreground font-body mb-4">How your metrics evolve based on current decisions</p>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={projectionData}>
              <defs>
                {Object.entries(chartColors).map(([key, color]) => (
                  <linearGradient key={key} id={`grad-${key}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity={0.3} />
                    <stop offset="100%" stopColor={color} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 18%)" />
              <XAxis dataKey="year" tick={{ fill: "hsl(215, 15%, 55%)", fontSize: 11 }} />
              <YAxis domain={[0, 100]} tick={{ fill: "hsl(215, 15%, 55%)", fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  background: "hsl(222, 40%, 10%)",
                  border: "1px solid hsl(222, 30%, 22%)",
                  borderRadius: "8px",
                  color: "hsl(200, 20%, 90%)",
                  fontSize: 12,
                }}
              />
              {Object.entries(chartColors).map(([key, color]) => (
                <Area
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={color}
                  fill={`url(#grad-${key})`}
                  strokeWidth={2}
                />
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

      {/* History chart */}
      {historyData && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-2xl p-6"
        >
          <h3 className="font-display text-lg font-bold text-foreground mb-1">Simulation History</h3>
          <p className="text-xs text-muted-foreground font-body mb-4">Track your progress across sessions</p>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={historyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 18%)" />
                <XAxis dataKey="session" tick={{ fill: "hsl(215, 15%, 55%)", fontSize: 11 }} />
                <YAxis domain={[0, 100]} tick={{ fill: "hsl(215, 15%, 55%)", fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    background: "hsl(222, 40%, 10%)",
                    border: "1px solid hsl(222, 30%, 22%)",
                    borderRadius: "8px",
                    color: "hsl(200, 20%, 90%)",
                    fontSize: 12,
                  }}
                />
                {Object.entries(chartColors).map(([key, color]) => (
                  <Line key={key} type="monotone" dataKey={key} stroke={color} strokeWidth={2} dot={{ r: 3 }} />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default MetricsCharts;
