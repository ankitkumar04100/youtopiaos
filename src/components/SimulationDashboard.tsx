import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft, Sliders, BarChart3, Eye, Bot, Trophy, TrendingUp, Save, LogOut, User,
  Brain, Sparkles, Calendar, Crown, Target, GitCompare, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import TimeAllocator from "./TimeAllocator";
import PriorityWeights from "./PriorityWeights";
import AdvancedMetrics from "./AdvancedMetrics";
import AdvancedFutures from "./AdvancedFutures";
import AdvancedCharts from "./AdvancedCharts";
import BehavioralIntelligence from "./BehavioralIntelligence";
import ButterflyEffect from "./ButterflyEffect";
import AiAdvisor from "./AiAdvisor";
import Gamification from "./Gamification";
import Leaderboard from "./Leaderboard";
import HabitTracker from "./HabitTracker";
import ScenarioComparison from "./ScenarioComparison";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  type TimeAllocation, type Priorities, type SimulationResult,
  defaultAllocation, defaultPriorities,
  runSimulation, runAISimulation,
} from "@/lib/simulation-engine";

interface SimulationDashboardProps {
  onBack: () => void;
}

type Tab = "allocation" | "priorities" | "metrics" | "behavior" | "futures" | "charts" | "butterfly" | "ai" | "achievements" | "leaderboard" | "habits" | "scenarios";

const tabs: { id: Tab; label: string; icon: any }[] = [
  { id: "allocation", label: "24h Allocation", icon: Sliders },
  { id: "priorities", label: "Priorities", icon: Target },
  { id: "metrics", label: "Metrics", icon: BarChart3 },
  { id: "behavior", label: "Behavioral", icon: Brain },
  { id: "futures", label: "Futures", icon: Eye },
  { id: "charts", label: "Charts", icon: TrendingUp },
  { id: "butterfly", label: "Butterfly", icon: Sparkles },
  { id: "ai", label: "AI Advisor", icon: Bot },
  { id: "scenarios", label: "Scenarios", icon: GitCompare },
  { id: "achievements", label: "Achievements", icon: Trophy },
  { id: "leaderboard", label: "Leaderboard", icon: Crown },
  { id: "habits", label: "Habits", icon: Calendar },
];

const SimulationDashboard = ({ onBack }: SimulationDashboardProps) => {
  const { user, isGuest, signOut } = useAuth();
  const [allocation, setAllocation] = useState<TimeAllocation>(defaultAllocation);
  const [priorities, setPriorities] = useState<Priorities>(defaultPriorities);
  const [activeTab, setActiveTab] = useState<Tab>("allocation");
  const [streakCount, setStreakCount] = useState(1);
  const [achievements, setAchievements] = useState<string[]>(["first_sim"]);
  const [history, setHistory] = useState<Array<{ metrics: any; date: string }>>([]);
  const [saving, setSaving] = useState(false);

  // AI simulation state
  const [aiSim, setAiSim] = useState<SimulationResult | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const aiRequestRef = useRef(0);

  // Local instant fallback
  const localSim = runSimulation(allocation, priorities);

  // The active simulation: AI result if available, otherwise local
  const sim: SimulationResult = aiSim || localSim;

  // Trigger AI simulation on allocation/priority changes (debounced)
  useEffect(() => {
    const requestId = ++aiRequestRef.current;
    const timeout = setTimeout(async () => {
      setAiLoading(true);
      try {
        const result = await runAISimulation(allocation, priorities);
        if (aiRequestRef.current === requestId) {
          setAiSim({
            metrics: result.metrics,
            traits: result.traits,
            warnings: result.warnings,
            yearProjections: result.yearProjections,
            idealFutureNarrative: result.idealFutureNarrative,
            shadowFutureNarrative: result.shadowFutureNarrative,
            idealHighlights: result.idealHighlights,
            shadowHighlights: result.shadowHighlights,
            behavioralInsight: result.behavioralInsight,
          });
        }
      } catch (e: any) {
        console.error("AI simulation error:", e.message);
        // Keep using local fallback silently
      } finally {
        if (aiRequestRef.current === requestId) setAiLoading(false);
      }
    }, 800); // debounce 800ms

    return () => clearTimeout(timeout);
  }, [allocation, priorities]);

  // Load saved data
  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data: saves } = await supabase
        .from("simulation_saves")
        .select("*")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false })
        .limit(1);
      if (saves && saves.length > 0) {
        const save = saves[0];
        if (save.decisions && typeof save.decisions === "object") {
          const d = save.decisions as any;
          if (d.work !== undefined) setAllocation(d as TimeAllocation);
        }
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
        setHistory(hist.map((h) => ({ metrics: h.metrics, date: h.simulated_at })));
      }
    })();
  }, [user]);

  const saveProgress = useCallback(async () => {
    if (!user) {
      toast.error("Sign in to save your progress");
      return;
    }
    setSaving(true);

    const { data: existing } = await supabase
      .from("simulation_saves")
      .select("id")
      .eq("user_id", user.id)
      .limit(1);

    const payload = {
      decisions: JSON.parse(JSON.stringify(allocation)),
      metrics: JSON.parse(JSON.stringify(sim.metrics)),
      streak_count: streakCount,
      achievements,
    };

    if (existing && existing.length > 0) {
      await supabase.from("simulation_saves").update(payload).eq("id", existing[0].id);
    } else {
      await supabase.from("simulation_saves").insert([{ user_id: user.id, ...payload }]);
    }

    await supabase.from("simulation_history").insert([{
      user_id: user.id,
      decisions: JSON.parse(JSON.stringify(allocation)),
      metrics: JSON.parse(JSON.stringify(sim.metrics)),
    }]);

    setHistory((prev) => [...prev, { metrics: sim.metrics, date: new Date().toISOString() }]);
    toast.success("Progress saved!");
    setSaving(false);
  }, [user, allocation, sim.metrics, streakCount, achievements]);

  const renderTab = () => {
    switch (activeTab) {
      case "allocation":
        return (
          <div>
            <div className="mb-6">
              <h2 className="font-display text-2xl font-bold text-foreground mb-2">24-Hour Life Allocation</h2>
              <p className="text-sm text-muted-foreground font-body">Distribute your 24 hours. Every hour counts.</p>
            </div>
            <TimeAllocator allocation={allocation} onChange={setAllocation} />
          </div>
        );
      case "priorities":
        return (
          <div>
            <div className="mb-6">
              <h2 className="font-display text-2xl font-bold text-foreground mb-2">Priority Weights</h2>
              <p className="text-sm text-muted-foreground font-body">Define what matters most. Must total 100%.</p>
            </div>
            <PriorityWeights priorities={priorities} onChange={setPriorities} />
          </div>
        );
      case "metrics":
        return (
          <div>
            <div className="mb-6">
              <div className="flex items-center gap-2">
                <h2 className="font-display text-2xl font-bold text-foreground">Life Metrics</h2>
                {aiLoading && <Loader2 className="w-4 h-4 text-primary animate-spin" />}
                {aiSim && !aiLoading && <span className="text-[10px] font-display text-primary bg-primary/10 px-2 py-0.5 rounded-full">AI Generated</span>}
              </div>
              <p className="text-sm text-muted-foreground font-body">Your AI-projected life scores based on current configuration.</p>
            </div>
            <AdvancedMetrics metrics={sim.metrics} />
          </div>
        );
      case "behavior":
        return (
          <div>
            <div className="mb-6">
              <div className="flex items-center gap-2">
                <h2 className="font-display text-2xl font-bold text-foreground">Behavioral Intelligence</h2>
                {aiLoading && <Loader2 className="w-4 h-4 text-primary animate-spin" />}
                {aiSim && !aiLoading && <span className="text-[10px] font-display text-primary bg-primary/10 px-2 py-0.5 rounded-full">AI Inferred</span>}
              </div>
              <p className="text-sm text-muted-foreground font-body">AI-inferred personality traits and risk assessment.</p>
              {sim.behavioralInsight && (
                <div className="mt-3 glass rounded-xl p-3 border-primary/20">
                  <p className="text-sm text-foreground/90 font-body italic">💡 {sim.behavioralInsight}</p>
                </div>
              )}
            </div>
            <BehavioralIntelligence traits={sim.traits} warnings={sim.warnings} />
          </div>
        );
      case "futures":
        return (
          <div>
            <div className="mb-6">
              <div className="flex items-center gap-2">
                <h2 className="font-display text-2xl font-bold text-foreground">Dual Future Paths</h2>
                {aiLoading && <Loader2 className="w-4 h-4 text-primary animate-spin" />}
                {aiSim && !aiLoading && <span className="text-[10px] font-display text-primary bg-primary/10 px-2 py-0.5 rounded-full">AI Narratives</span>}
              </div>
              <p className="text-sm text-muted-foreground font-body">Your ideal vs shadow future — AI-generated narratives.</p>
            </div>
            <AdvancedFutures
              metrics={sim.metrics}
              warnings={sim.warnings}
              projections={sim.yearProjections}
              idealNarrative={sim.idealFutureNarrative}
              shadowNarrative={sim.shadowFutureNarrative}
              idealHighlights={sim.idealHighlights}
              shadowHighlights={sim.shadowHighlights}
            />
          </div>
        );
      case "charts":
        return (
          <div>
            <div className="mb-6">
              <h2 className="font-display text-2xl font-bold text-foreground">Projections & Analytics</h2>
              <p className="text-sm text-muted-foreground font-body">10-year AI projections, radar profiles, and simulation history.</p>
            </div>
            <AdvancedCharts projections={sim.yearProjections} metrics={sim.metrics} traits={sim.traits} history={history} />
          </div>
        );
      case "butterfly":
        return (
          <div>
            <div className="mb-6">
              <h2 className="font-display text-2xl font-bold text-foreground">Butterfly Effect</h2>
              <p className="text-sm text-muted-foreground font-body">See how tiny changes compound into massive differences.</p>
            </div>
            <ButterflyEffect allocation={allocation} priorities={priorities} metrics={sim.metrics} traits={sim.traits} />
          </div>
        );
      case "ai":
        return (
          <div>
            <div className="mb-6">
              <h2 className="font-display text-2xl font-bold text-foreground">AI Advisor Suite</h2>
              <p className="text-sm text-muted-foreground font-body">7 AI modes powered by real-time intelligence.</p>
            </div>
            <AiAdvisor allocation={allocation} priorities={priorities} metrics={sim.metrics} traits={sim.traits} warnings={sim.warnings} />
          </div>
        );
      case "achievements":
        return (
          <div>
            <div className="mb-6">
              <h2 className="font-display text-2xl font-bold text-foreground">Gamification</h2>
              <p className="text-sm text-muted-foreground font-body">Track streaks, unlock achievements, and hit milestones.</p>
            </div>
            <Gamification metrics={sim.metrics} allocation={allocation} streakCount={streakCount} achievements={achievements} />
          </div>
        );
      case "leaderboard":
        return (
          <div>
            <div className="mb-6">
              <h2 className="font-display text-2xl font-bold text-foreground">Global Leaderboard</h2>
              <p className="text-sm text-muted-foreground font-body">Compare your life scores anonymously with others.</p>
            </div>
            <Leaderboard currentMetrics={sim.metrics} />
          </div>
        );
      case "habits":
        return (
          <div>
            <div className="mb-6">
              <h2 className="font-display text-2xl font-bold text-foreground">Habit Tracker</h2>
              <p className="text-sm text-muted-foreground font-body">Log your daily habits and track consistency over time.</p>
            </div>
            <HabitTracker />
          </div>
        );
      case "scenarios":
        return (
          <div>
            <div className="mb-6">
              <h2 className="font-display text-2xl font-bold text-foreground">Compare Scenarios</h2>
              <p className="text-sm text-muted-foreground font-body">Save configurations and get AI-powered comparison analysis.</p>
            </div>
            <ScenarioComparison
              currentAllocation={allocation}
              currentPriorities={priorities}
              currentMetrics={sim.metrics}
              currentTraits={sim.traits}
            />
          </div>
        );
    }
  };

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
              {aiLoading ? (
                <span className="flex items-center gap-1.5">
                  <Loader2 className="w-3 h-3 animate-spin text-primary" /> AI Processing
                </span>
              ) : aiSim ? (
                <span className="flex items-center gap-1.5">
                  AI Active <span className="inline-block w-2 h-2 bg-primary rounded-full animate-pulse-glow" />
                </span>
              ) : (
                <span className="flex items-center gap-1.5">
                  Simulation Active <span className="inline-block w-2 h-2 bg-success rounded-full animate-pulse-glow" />
                </span>
              )}
            </div>
            {user && (
              <>
                <Button variant="ghost" size="sm" onClick={saveProgress} disabled={saving} className="text-primary hover:bg-primary/10">
                  <Save className="w-4 h-4 mr-1" /> {saving ? "..." : "Save"}
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
      <nav className="container mx-auto px-4 pt-4 pb-2">
        <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-thin">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-body text-xs transition-all whitespace-nowrap ${
                  isActive ? "bg-primary/10 text-primary border border-primary/30" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Content */}
      <main className="container mx-auto px-4 py-6 max-w-4xl">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          {renderTab()}
        </motion.div>
      </main>
    </div>
  );
};

export default SimulationDashboard;
