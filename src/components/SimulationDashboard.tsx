import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Sliders, BarChart3, Eye, Bot, Trophy, TrendingUp, Save, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import DecisionSliders, { type Decisions } from "./DecisionSliders";
import MetricsDisplay, { calculateMetrics } from "./MetricsDisplay";
import FutureVisualization from "./FutureVisualization";
import AiFutureSelf from "./AiFutureSelf";
import Gamification from "./Gamification";
import MetricsCharts from "./MetricsCharts";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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

type Tab = "decisions" | "metrics" | "futures" | "charts" | "ai" | "achievements";

const tabs = [
  { id: "decisions" as Tab, label: "Decisions", icon: Sliders },
  { id: "metrics" as Tab, label: "Metrics", icon: BarChart3 },
  { id: "futures" as Tab, label: "Futures", icon: Eye },
  { id: "charts" as Tab, label: "Charts", icon: TrendingUp },
  { id: "ai" as Tab, label: "AI Advisor", icon: Bot },
  { id: "achievements" as Tab, label: "Achievements", icon: Trophy },
];

const SimulationDashboard = ({ onBack }: SimulationDashboardProps) => {
  const { user, isGuest, signOut } = useAuth();
  const [decisions, setDecisions] = useState<Decisions>(defaultDecisions);
  const [activeTab, setActiveTab] = useState<Tab>("decisions");
  const [streakCount, setStreakCount] = useState(1);
  const [achievements, setAchievements] = useState<string[]>(["first_sim"]);
  const [history, setHistory] = useState<Array<{ decisions: Decisions; metrics: any; date: string }>>([]);
  const [saving, setSaving] = useState(false);

  // Load saved data for authenticated users
  useEffect(() => {
    if (!user) return;
    const loadData = async () => {
      const { data: saves } = await supabase
        .from("simulation_saves")
        .select("*")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false })
        .limit(1);
      if (saves && saves.length > 0) {
        const save = saves[0];
        setDecisions(save.decisions as unknown as Decisions);
        setStreakCount(save.streak_count);
        setAchievements(save.achievements || []);
      }

      const { data: hist } = await supabase
        .from("simulation_history")
        .select("*")
        .eq("user_id", user.id)
        .order("simulated_at", { ascending: true })
        .limit(20);
      if (hist) {
        setHistory(hist.map((h) => ({
          decisions: h.decisions as unknown as Decisions,
          metrics: h.metrics,
          date: h.simulated_at,
        })));
      }
    };
    loadData();
  }, [user]);

  const saveProgress = useCallback(async () => {
    if (!user) {
      toast.error("Sign in to save your progress");
      return;
    }
    setSaving(true);
    const metrics = calculateMetrics(decisions);

    // Upsert simulation save
    const { data: existing } = await supabase
      .from("simulation_saves")
      .select("id")
      .eq("user_id", user.id)
      .limit(1);

    if (existing && existing.length > 0) {
      await supabase.from("simulation_saves").update({
        decisions: JSON.parse(JSON.stringify(decisions)),
        metrics: JSON.parse(JSON.stringify(metrics)),
        streak_count: streakCount,
        achievements,
      }).eq("id", existing[0].id);
    } else {
      await supabase.from("simulation_saves").insert([{
        user_id: user.id,
        decisions: JSON.parse(JSON.stringify(decisions)),
        metrics: JSON.parse(JSON.stringify(metrics)),
        streak_count: streakCount,
        achievements,
      }]);
    }

    // Add to history
    await supabase.from("simulation_history").insert([{
      user_id: user.id,
      decisions: JSON.parse(JSON.stringify(decisions)),
      metrics: JSON.parse(JSON.stringify(metrics)),
    }]);

    setHistory((prev) => [...prev, { decisions, metrics, date: new Date().toISOString() }]);
    toast.success("Progress saved!");
    setSaving(false);
  }, [user, decisions, streakCount, achievements]);

  return (
    <div className="min-h-screen bg-background grid-overlay">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-border/50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={onBack} className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4 mr-1" /> Back
            </Button>
            <div className="h-5 w-px bg-border" />
            <h1 className="font-display text-sm font-bold tracking-wider">
              <span className="text-foreground">YOU</span>
              <span className="text-primary">topia</span>
              <span className="text-muted-foreground ml-1">OS</span>
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="font-body text-xs text-muted-foreground uppercase tracking-widest hidden sm:block">
              Simulation Active
              <span className="inline-block w-2 h-2 bg-success rounded-full ml-2 animate-pulse-glow" />
            </div>
            {user && (
              <>
                <Button variant="ghost" size="sm" onClick={saveProgress} disabled={saving} className="text-primary hover:bg-primary/10">
                  <Save className="w-4 h-4 mr-1" /> {saving ? "Saving..." : "Save"}
                </Button>
                <Button variant="ghost" size="sm" onClick={signOut} className="text-muted-foreground hover:text-foreground">
                  <LogOut className="w-4 h-4" />
                </Button>
              </>
            )}
            {isGuest && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground font-body">
                <User className="w-3 h-3" /> Guest
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Tab nav */}
      <nav className="container mx-auto px-4 pt-6 pb-2">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-body text-sm transition-all whitespace-nowrap ${
                  isActive ? "bg-primary/10 text-primary border border-primary/30" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Content */}
      <main className="container mx-auto px-4 py-6 max-w-4xl">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          {activeTab === "decisions" && (
            <div>
              <div className="mb-6">
                <h2 className="font-display text-2xl font-bold text-foreground mb-2">Adjust Your Decisions</h2>
                <p className="text-sm text-muted-foreground font-body">Move the sliders to simulate different daily habits. Watch your future change in real-time.</p>
              </div>
              <DecisionSliders decisions={decisions} onChange={setDecisions} />
            </div>
          )}
          {activeTab === "metrics" && (
            <div>
              <div className="mb-6">
                <h2 className="font-display text-2xl font-bold text-foreground mb-2">Life Metrics</h2>
                <p className="text-sm text-muted-foreground font-body">Your projected life scores based on current decisions.</p>
              </div>
              <MetricsDisplay decisions={decisions} />
            </div>
          )}
          {activeTab === "futures" && (
            <div>
              <div className="mb-6">
                <h2 className="font-display text-2xl font-bold text-foreground mb-2">Dual Future Paths</h2>
                <p className="text-sm text-muted-foreground font-body">See the contrast between your ideal and shadow futures.</p>
              </div>
              <FutureVisualization decisions={decisions} />
            </div>
          )}
          {activeTab === "charts" && (
            <div>
              <div className="mb-6">
                <h2 className="font-display text-2xl font-bold text-foreground mb-2">Projections & History</h2>
                <p className="text-sm text-muted-foreground font-body">Animated charts showing how your decisions compound over time.</p>
              </div>
              <MetricsCharts decisions={decisions} history={history} />
            </div>
          )}
          {activeTab === "ai" && (
            <div>
              <div className="mb-6">
                <h2 className="font-display text-2xl font-bold text-foreground mb-2">AI Advisor</h2>
                <p className="text-sm text-muted-foreground font-body">Choose your Future Self or Life Mentor for AI-powered guidance.</p>
              </div>
              <AiFutureSelf decisions={decisions} />
            </div>
          )}
          {activeTab === "achievements" && (
            <div>
              <div className="mb-6">
                <h2 className="font-display text-2xl font-bold text-foreground mb-2">Gamification</h2>
                <p className="text-sm text-muted-foreground font-body">Track streaks, unlock achievements, and hit milestones.</p>
              </div>
              <Gamification decisions={decisions} streakCount={streakCount} achievements={achievements} />
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default SimulationDashboard;
