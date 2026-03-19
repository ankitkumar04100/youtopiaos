import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Loader2, MessageCircle, GraduationCap, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import ReactMarkdown from "react-markdown";
import type { Decisions } from "./DecisionSliders";
import { calculateMetrics } from "./MetricsDisplay";

interface AiFutureSelfProps {
  decisions: Decisions;
}

type AiMode = "future-self" | "mentor";

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-advisor`;

const AiFutureSelf = ({ decisions }: AiFutureSelfProps) => {
  const [advice, setAdvice] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<AiMode>("future-self");
  const [customQuestion, setCustomQuestion] = useState("");
  const [hasResult, setHasResult] = useState(false);

  const getAdvice = async (question?: string) => {
    setLoading(true);
    setAdvice("");
    setHasResult(false);

    const metrics = calculateMetrics(decisions);
    const avg = Math.round((metrics.wealth + metrics.happiness + metrics.health + metrics.impact) / 4);

    const contextMsg = `Here are my current life decisions and metrics:
- Study/Work: ${decisions.studyTime}hrs, Sleep: ${decisions.sleepHours}hrs
- Social Media: ${decisions.socialMedia}hrs, Exercise: ${decisions.exercise}hrs
- Discipline: ${decisions.discipline}/10, Screen Time: ${decisions.screenTime}hrs
- Metrics → Wealth: ${Math.round(metrics.wealth)}, Happiness: ${Math.round(metrics.happiness)}, Health: ${Math.round(metrics.health)}, Impact: ${Math.round(metrics.impact)}
- Overall Score: ${avg}/100

${question ? `My question: ${question}` : "Analyze my life trajectory and give me specific, actionable advice."}`;

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: [{ role: "user", content: contextMsg }],
          mode,
        }),
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
      {/* Mode selector */}
      <div className="flex gap-2">
        {([
          { id: "future-self" as AiMode, label: "Future Self", icon: Bot },
          { id: "mentor" as AiMode, label: "Life Mentor", icon: GraduationCap },
        ]).map((m) => {
          const Icon = m.icon;
          return (
            <button
              key={m.id}
              onClick={() => { setMode(m.id); setAdvice(""); setHasResult(false); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-body transition-all flex-1 ${
                mode === m.id
                  ? "bg-primary/10 text-primary border border-primary/30"
                  : "glass text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="w-4 h-4" /> {m.label}
            </button>
          );
        })}
      </div>

      {/* Main card */}
      <div className="glass rounded-2xl p-6 glow-primary border-primary/20">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-primary/10">
            {mode === "mentor" ? <GraduationCap className="w-5 h-5 text-primary" /> : <Bot className="w-5 h-5 text-primary" />}
          </div>
          <div>
            <h3 className="font-display text-lg font-bold text-primary">
              {mode === "mentor" ? "Life Mentor" : "Your Future Self"}
            </h3>
            <p className="text-xs text-muted-foreground font-body">AI-powered {mode === "mentor" ? "mentorship" : "life guidance"}</p>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {!hasResult && !loading && (
            <motion.div key="input" exit={{ opacity: 0 }} className="space-y-3">
              <Textarea
                placeholder={mode === "mentor" ? "Ask your mentor anything about life optimization..." : "Ask your future self a specific question, or leave blank for a full analysis..."}
                value={customQuestion}
                onChange={(e) => setCustomQuestion(e.target.value)}
                className="bg-muted/50 border-border/50 text-foreground resize-none h-20"
              />
              <Button
                onClick={() => getAdvice(customQuestion || undefined)}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-display text-sm tracking-wider"
              >
                <Send className="w-4 h-4 mr-2" />
                {mode === "mentor" ? "ASK MENTOR" : "CONNECT TO FUTURE"}
              </Button>
            </motion.div>
          )}

          {loading && (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-4">
              <div className="flex items-center gap-3 mb-3">
                <Loader2 className="w-5 h-5 text-primary animate-spin" />
                <span className="text-sm text-muted-foreground font-body">
                  {mode === "mentor" ? "Consulting the mentor..." : "Connecting to your future timeline..."}
                </span>
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
              <div className="flex gap-2 mt-4">
                <Button
                  onClick={() => { setAdvice(""); setHasResult(false); setCustomQuestion(""); }}
                  variant="outline"
                  className="border-primary/30 text-primary hover:bg-primary/10 font-body text-sm flex-1"
                >
                  Ask Again
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default AiFutureSelf;
