import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Sliders, BarChart3, Eye, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import DecisionSliders, { type Decisions } from "./DecisionSliders";
import MetricsDisplay from "./MetricsDisplay";
import FutureVisualization from "./FutureVisualization";
import AiFutureSelf from "./AiFutureSelf";

interface SimulationDashboardProps {
  onBack: () => void;
}

const defaultDecisions: Decisions = {
  studyTime: 4,
  sleepHours: 7,
  socialMedia: 3,
  exercise: 3,
  discipline: 5,
  screenTime: 4,
};

type Tab = "decisions" | "metrics" | "futures" | "ai";

const tabs = [
  { id: "decisions" as Tab, label: "Decisions", icon: Sliders },
  { id: "metrics" as Tab, label: "Metrics", icon: BarChart3 },
  { id: "futures" as Tab, label: "Futures", icon: Eye },
  { id: "ai" as Tab, label: "AI Self", icon: Bot },
];

const SimulationDashboard = ({ onBack }: SimulationDashboardProps) => {
  const [decisions, setDecisions] = useState<Decisions>(defaultDecisions);
  const [activeTab, setActiveTab] = useState<Tab>("decisions");

  return (
    <div className="min-h-screen bg-background grid-overlay">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-border/50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back
            </Button>
            <div className="h-5 w-px bg-border" />
            <h1 className="font-display text-sm font-bold tracking-wider">
              <span className="text-foreground">YOU</span>
              <span className="text-primary">topia</span>
              <span className="text-muted-foreground ml-1">OS</span>
            </h1>
          </div>
          <div className="font-body text-xs text-muted-foreground uppercase tracking-widest">
            Simulation Active
            <span className="inline-block w-2 h-2 bg-success rounded-full ml-2 animate-pulse-glow" />
          </div>
        </div>
      </header>

      {/* Tab nav */}
      <nav className="container mx-auto px-4 pt-6 pb-2">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-body text-sm transition-all whitespace-nowrap ${
                  isActive
                    ? "bg-primary/10 text-primary border border-primary/30"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Content */}
      <main className="container mx-auto px-4 py-6 max-w-4xl">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === "decisions" && (
            <div>
              <div className="mb-6">
                <h2 className="font-display text-2xl font-bold text-foreground mb-2">Adjust Your Decisions</h2>
                <p className="text-sm text-muted-foreground font-body">
                  Move the sliders to simulate different daily habits. Watch your future change in real-time.
                </p>
              </div>
              <DecisionSliders decisions={decisions} onChange={setDecisions} />
            </div>
          )}

          {activeTab === "metrics" && (
            <div>
              <div className="mb-6">
                <h2 className="font-display text-2xl font-bold text-foreground mb-2">Life Metrics</h2>
                <p className="text-sm text-muted-foreground font-body">
                  Your projected life scores based on current decisions.
                </p>
              </div>
              <MetricsDisplay decisions={decisions} />
            </div>
          )}

          {activeTab === "futures" && (
            <div>
              <div className="mb-6">
                <h2 className="font-display text-2xl font-bold text-foreground mb-2">Dual Future Paths</h2>
                <p className="text-sm text-muted-foreground font-body">
                  See the contrast between your ideal and shadow futures.
                </p>
              </div>
              <FutureVisualization decisions={decisions} />
            </div>
          )}

          {activeTab === "ai" && (
            <div>
              <div className="mb-6">
                <h2 className="font-display text-2xl font-bold text-foreground mb-2">AI Future Self</h2>
                <p className="text-sm text-muted-foreground font-body">
                  Receive personalized guidance from your future timeline.
                </p>
              </div>
              <AiFutureSelf decisions={decisions} />
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default SimulationDashboard;
