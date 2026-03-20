import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Loader2, GraduationCap, Send, Zap, AlertTriangle, Lightbulb, ListChecks, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import ReactMarkdown from "react-markdown";
import type { TimeAllocation, Priorities, LifeMetrics, BehavioralTraits, ConstraintWarnings } from "@/lib/simulation-engine";

interface AiAdvisorProps {
  allocation: TimeAllocation;
  priorities: Priorities;
  metrics: LifeMetrics;
  traits: BehavioralTraits;
  warnings: ConstraintWarnings;
}

type AiMode = "future-self" | "mentor" | "habit-analyzer" | "risk-detector" | "opportunity-detector" | "daily-plan" | "optimizer";

const modes = [
  { id: "future-self" as AiMode, label: "Future Self", icon: Bot, desc: "Advice from 2035" },
  { id: "mentor" as AiMode, label: "Life Mentor", icon: GraduationCap, desc: "Expert guidance" },
  { id: "habit-analyzer" as AiMode, label: "Habit Analyzer", icon: Zap, desc: "Find weak habits" },
  { id: "risk-detector" as AiMode, label: "Risk Detector", icon: AlertTriangle, desc: "Burnout & failure warnings" },
  { id: "opportunity-detector" as AiMode, label: "Opportunities", icon: Lightbulb, desc: "Growth paths" },
  { id: "daily-plan" as AiMode, label: "Daily Plan", icon: ListChecks, desc: "3-5 daily tasks" },
  { id: "optimizer" as AiMode, label: "Optimizer", icon: Settings2, desc: "Best life config" },
];

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-advisor`;

const AiAdvisor = ({ allocation, priorities, metrics, traits, warnings }: AiAdvisorProps) => {
  const [advice, setAdvice] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<AiMode>("future-self");
  const [customQuestion, setCustomQuestion] = useState("");
  const [hasResult, setHasResult] = useState(false);

  const getAdvice = async (question?: string) => {
    setLoading(true);
    setAdvice("");
    setHasResult(false);

    const avg = Math.round((metrics.wealth + metrics.happiness + metrics.health + metrics.impact) / 4);
    const contextMsg = `Current Life Configuration:
**Time Allocation (24h):**
- Work: ${allocation.work}h | Sleep: ${allocation.sleep}h | Exercise: ${allocation.exercise}h
- Social: ${allocation.social}h | Entertainment: ${allocation.entertainment}h | Learning: ${allocation.learning}h

**Priorities:** Career ${priorities.career}% | Health ${priorities.health}% | Happiness ${priorities.happiness}% | Social ${priorities.socialLife}%

**Life Metrics:** Wealth: ${Math.round(metrics.wealth)} | Happiness: ${Math.round(metrics.happiness)} | Health: ${Math.round(metrics.health)} | Impact: ${Math.round(metrics.impact)} | Overall: ${avg}/100

**Behavioral Traits:** Focus: ${traits.focusLevel} | Consistency: ${traits.consistencyScore} | Discipline: ${traits.disciplineLevel} | Risk-Taking: ${traits.riskTaking} | Stress Tolerance: ${traits.stressTolerance}

**Risk Levels:** Burnout: ${warnings.burnoutRisk}% | Health Decline: ${warnings.healthDecline}% | Isolation: ${warnings.isolationRisk}% | Stagnation: ${warnings.stagnationRisk}%

${question ? `My question: ${question}` : "Analyze my complete life configuration and provide specific, actionable guidance."}`;

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: [{ role: "user", content: contextMsg }], mode }),
      });

      if (!resp.ok || !resp.body) {
        const errData = await resp.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to get advice");
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let newlineIdx: number;
        while ((newlineIdx = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, newlineIdx);
          buffer = buffer.slice(newlineIdx + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              fullText += content;
              setAdvice(fullText);
            }
          } catch {
            buffer = line + "\n" + buffer;
            break;
          }
        }
      }
      setHasResult(true);
    } catch (e: any) {
      setAdvice(`**Error:** ${e.message}`);
      setHasResult(true);
    }
    setLoading(false);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      {/* Mode Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {modes.map((m) => {
          const Icon = m.icon;
          return (
            <button
              key={m.id}
              onClick={() => { setMode(m.id); setAdvice(""); setHasResult(false); }}
              className={`flex flex-col items-center gap-1 p-3 rounded-xl text-center transition-all ${
                mode === m.id
                  ? "bg-primary/10 text-primary border border-primary/30"
                  : "glass text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-display font-bold">{m.label}</span>
              <span className="text-[10px] font-body opacity-70">{m.desc}</span>
            </button>
          );
        })}
      </div>

      {/* AI Card */}
      <div className="glass rounded-2xl p-6 glow-primary border-primary/20">
        <AnimatePresence mode="wait">
          {!hasResult && !loading && (
            <motion.div key="input" exit={{ opacity: 0 }} className="space-y-3">
              <Textarea
                placeholder={`Ask the ${modes.find(m => m.id === mode)?.label || 'AI'}...`}
                value={customQuestion}
                onChange={(e) => setCustomQuestion(e.target.value)}
                className="bg-muted/50 border-border/50 text-foreground resize-none h-20"
              />
              <Button
                onClick={() => getAdvice(customQuestion || undefined)}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-display text-sm tracking-wider"
              >
                <Send className="w-4 h-4 mr-2" /> ANALYZE
              </Button>
            </motion.div>
          )}

          {loading && (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-4">
              <div className="flex items-center gap-3 mb-3">
                <Loader2 className="w-5 h-5 text-primary animate-spin" />
                <span className="text-sm text-muted-foreground font-body">Processing...</span>
              </div>
              {advice && (
                <div className="bg-muted/50 rounded-xl p-4 border border-primary/10 prose prose-sm prose-invert max-w-none">
                  <ReactMarkdown>{advice}</ReactMarkdown>
                </div>
              )}
            </motion.div>
          )}

          {hasResult && advice && (
            <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="bg-muted/50 rounded-xl p-4 border border-primary/10 prose prose-sm prose-invert max-w-none max-h-96 overflow-y-auto">
                <ReactMarkdown>{advice}</ReactMarkdown>
              </div>
              <Button
                onClick={() => { setAdvice(""); setHasResult(false); setCustomQuestion(""); }}
                variant="outline"
                className="mt-4 w-full border-primary/30 text-primary hover:bg-primary/10 font-body text-sm"
              >
                Ask Again
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default AiAdvisor;
