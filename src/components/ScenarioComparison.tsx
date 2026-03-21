import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GitCompare, Save, Trash2, Copy, Plus, X, ArrowUp, ArrowDown, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import type { TimeAllocation, Priorities, LifeMetrics, BehavioralTraits } from "@/lib/simulation-engine";
import { runSimulation } from "@/lib/simulation-engine";

interface ScenarioComparisonProps {
  currentAllocation: TimeAllocation;
  currentPriorities: Priorities;
  currentMetrics: LifeMetrics;
  currentTraits: BehavioralTraits;
}

interface SavedScenario {
  id: string;
  name: string;
  allocation: TimeAllocation;
  priorities: Priorities;
  metrics: LifeMetrics;
  traits: BehavioralTraits;
}

const Delta = ({ value, suffix = "" }: { value: number; suffix?: string }) => {
  if (value === 0) return <Minus className="w-3 h-3 text-muted-foreground" />;
  return (
    <span className={`flex items-center gap-0.5 text-xs font-display font-bold ${value > 0 ? "text-success" : "text-destructive"}`}>
      {value > 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
      {Math.abs(value)}{suffix}
    </span>
  );
};

const ScenarioComparison = ({ currentAllocation, currentPriorities, currentMetrics, currentTraits }: ScenarioComparisonProps) => {
  const { user } = useAuth();
  const [scenarios, setScenarios] = useState<SavedScenario[]>([]);
  const [scenarioName, setScenarioName] = useState("My Scenario");
  const [compareA, setCompareA] = useState<string | null>(null);
  const [compareB, setCompareB] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("saved_scenarios")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data) {
          setScenarios(data.map((d: any) => ({
            id: d.id,
            name: d.name,
            allocation: d.allocation as TimeAllocation,
            priorities: d.priorities as Priorities,
            metrics: d.metrics as LifeMetrics,
            traits: d.traits as BehavioralTraits,
          })));
        }
      });
  }, [user]);

  const saveCurrentScenario = async () => {
    if (!user) { toast.error("Sign in to save scenarios"); return; }
    setSaving(true);
    const { error } = await supabase.from("saved_scenarios").insert([{
      user_id: user.id,
      name: scenarioName,
      allocation: JSON.parse(JSON.stringify(currentAllocation)),
      priorities: JSON.parse(JSON.stringify(currentPriorities)),
      metrics: JSON.parse(JSON.stringify(currentMetrics)),
      traits: JSON.parse(JSON.stringify(currentTraits)),
    }]);
    if (error) toast.error("Failed to save");
    else {
      toast.success("Scenario saved!");
      // Refresh
      const { data } = await supabase.from("saved_scenarios").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
      if (data) setScenarios(data.map((d: any) => ({ id: d.id, name: d.name, allocation: d.allocation, priorities: d.priorities, metrics: d.metrics, traits: d.traits })));
    }
    setSaving(false);
  };

  const deleteScenario = async (id: string) => {
    await supabase.from("saved_scenarios").delete().eq("id", id);
    setScenarios((s) => s.filter((x) => x.id !== id));
    if (compareA === id) setCompareA(null);
    if (compareB === id) setCompareB(null);
    toast.success("Scenario deleted");
  };

  const duplicateScenario = async (scenario: SavedScenario) => {
    if (!user) return;
    const { error } = await supabase.from("saved_scenarios").insert([{
      user_id: user.id,
      name: `${scenario.name} (Copy)`,
      allocation: JSON.parse(JSON.stringify(scenario.allocation)),
      priorities: JSON.parse(JSON.stringify(scenario.priorities)),
      metrics: JSON.parse(JSON.stringify(scenario.metrics)),
      traits: JSON.parse(JSON.stringify(scenario.traits)),
    }]);
    if (!error) {
      const { data } = await supabase.from("saved_scenarios").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
      if (data) setScenarios(data.map((d: any) => ({ id: d.id, name: d.name, allocation: d.allocation, priorities: d.priorities, metrics: d.metrics, traits: d.traits })));
      toast.success("Scenario duplicated");
    }
  };

  const scA = scenarios.find((s) => s.id === compareA);
  const scB = scenarios.find((s) => s.id === compareB);

  const allocKeys: (keyof TimeAllocation)[] = ["work", "sleep", "exercise", "social", "entertainment", "learning"];
  const prioKeys: (keyof Priorities)[] = ["career", "health", "happiness", "socialLife"];
  const metricKeys: (keyof LifeMetrics)[] = ["wealth", "happiness", "health", "impact"];

  return (
    <div className="space-y-5">
      {/* Save Current */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-5 border-primary/20">
        <h3 className="font-display text-sm font-bold text-foreground mb-3 flex items-center gap-2">
          <Save className="w-4 h-4 text-primary" /> Save Current Configuration
        </h3>
        <div className="flex gap-2">
          <Input value={scenarioName} onChange={(e) => setScenarioName(e.target.value)}
            className="bg-muted/50 border-border/50 text-foreground text-sm" placeholder="Scenario name..." />
          <Button onClick={saveCurrentScenario} disabled={saving || !user}
            className="bg-primary text-primary-foreground hover:bg-primary/90 font-display text-xs shrink-0">
            <Plus className="w-4 h-4 mr-1" /> {saving ? "..." : "Save"}
          </Button>
        </div>
      </motion.div>

      {/* Saved Scenarios List */}
      {scenarios.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-display text-sm font-bold text-foreground flex items-center gap-2">
            <GitCompare className="w-4 h-4 text-primary" /> Saved Scenarios ({scenarios.length})
          </h3>
          {scenarios.map((sc, i) => {
            const avg = Math.round((sc.metrics.wealth + sc.metrics.happiness + sc.metrics.health + sc.metrics.impact) / 4);
            const isA = compareA === sc.id;
            const isB = compareB === sc.id;
            return (
              <motion.div key={sc.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className={`glass rounded-xl p-3 flex items-center gap-3 ${isA ? "border-primary/40 glow-primary" : isB ? "border-accent/40 glow-accent" : ""}`}>
                <div className="flex-1 min-w-0">
                  <div className="font-body text-sm text-foreground truncate">{sc.name}</div>
                  <div className="text-xs text-muted-foreground font-body">Score: {avg} | W{Math.round(sc.metrics.wealth)} H{Math.round(sc.metrics.happiness)} Hl{Math.round(sc.metrics.health)} I{Math.round(sc.metrics.impact)}</div>
                </div>
                <div className="flex gap-1 shrink-0">
                  <Button variant="ghost" size="sm" onClick={() => setCompareA(isA ? null : sc.id)}
                    className={`text-xs px-2 ${isA ? "text-primary bg-primary/10" : "text-muted-foreground"}`}>A</Button>
                  <Button variant="ghost" size="sm" onClick={() => setCompareB(isB ? null : sc.id)}
                    className={`text-xs px-2 ${isB ? "text-accent bg-accent/10" : "text-muted-foreground"}`}>B</Button>
                  <Button variant="ghost" size="sm" onClick={() => duplicateScenario(sc)} className="text-muted-foreground px-1.5">
                    <Copy className="w-3 h-3" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => deleteScenario(sc.id)} className="text-destructive px-1.5">
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Comparison View */}
      <AnimatePresence>
        {scA && scB && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="space-y-4">
            <h3 className="font-display text-sm font-bold text-foreground flex items-center gap-2">
              <GitCompare className="w-4 h-4 text-primary" />
              Comparing: <span className="text-primary">{scA.name}</span> vs <span className="text-accent">{scB.name}</span>
            </h3>

            {/* Time Allocation Comparison */}
            <div className="glass rounded-xl p-4">
              <h4 className="font-display text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Time Allocation</h4>
              <div className="space-y-2">
                {allocKeys.map((key) => {
                  const aVal = scA.allocation[key];
                  const bVal = scB.allocation[key];
                  const diff = Math.round((bVal - aVal) * 10) / 10;
                  return (
                    <div key={key} className="flex items-center gap-3 text-sm">
                      <span className="w-28 text-muted-foreground font-body capitalize">{key}</span>
                      <span className="w-12 text-right font-display text-primary">{aVal}h</span>
                      <Delta value={diff} suffix="h" />
                      <span className="w-12 text-right font-display text-accent">{bVal}h</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Priorities Comparison */}
            <div className="glass rounded-xl p-4">
              <h4 className="font-display text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Priorities</h4>
              <div className="space-y-2">
                {prioKeys.map((key) => {
                  const aVal = scA.priorities[key];
                  const bVal = scB.priorities[key];
                  const diff = bVal - aVal;
                  return (
                    <div key={key} className="flex items-center gap-3 text-sm">
                      <span className="w-28 text-muted-foreground font-body capitalize">{key === "socialLife" ? "Social" : key}</span>
                      <span className="w-12 text-right font-display text-primary">{aVal}%</span>
                      <Delta value={diff} suffix="%" />
                      <span className="w-12 text-right font-display text-accent">{bVal}%</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Metrics Comparison */}
            <div className="glass rounded-xl p-4">
              <h4 className="font-display text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Life Metrics</h4>
              <div className="grid grid-cols-2 gap-3">
                {metricKeys.map((key) => {
                  const aVal = Math.round(scA.metrics[key]);
                  const bVal = Math.round(scB.metrics[key]);
                  const diff = bVal - aVal;
                  return (
                    <div key={key} className="glass rounded-lg p-3 text-center">
                      <div className="text-xs text-muted-foreground font-body capitalize mb-1">{key}</div>
                      <div className="flex items-center justify-center gap-2">
                        <span className="font-display text-lg font-bold text-primary">{aVal}</span>
                        <Delta value={diff} />
                        <span className="font-display text-lg font-bold text-accent">{bVal}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!user && (
        <div className="glass rounded-xl p-6 text-center">
          <GitCompare className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground font-body">Sign in to save and compare scenarios</p>
        </div>
      )}
    </div>
  );
};

export default ScenarioComparison;
