import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Loader2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";
import type { Decisions } from "./DecisionSliders";
import { calculateMetrics } from "./MetricsDisplay";

interface AiFutureSelfProps {
  decisions: Decisions;
}

const AiFutureSelf = ({ decisions }: AiFutureSelfProps) => {
  const [advice, setAdvice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAdvice = async () => {
    setLoading(true);
    setError(null);
    setAdvice(null);

    const metrics = calculateMetrics(decisions);
    const avgScore = Math.round((metrics.wealth + metrics.happiness + metrics.health + metrics.impact) / 4);

    // Build a local AI advice since we don't have backend yet
    // This will be replaced with real AI when Cloud is enabled
    const adviceText = generateLocalAdvice(decisions, metrics, avgScore);
    
    // Simulate a slight delay for UX
    await new Promise(r => setTimeout(r, 1500));
    setAdvice(adviceText);
    setLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl p-6 glow-primary border-primary/20"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-primary/10">
          <Bot className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-display text-lg font-bold text-primary">Your Future Self</h3>
          <p className="text-xs text-muted-foreground font-body">AI-powered life guidance</p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!advice && !loading && (
          <motion.div key="prompt" exit={{ opacity: 0 }}>
            <p className="text-sm text-muted-foreground font-body mb-4">
              Get personalized advice from your AI future self based on your current life decisions.
            </p>
            <Button
              onClick={getAdvice}
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-display text-sm tracking-wider"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              ASK YOUR FUTURE SELF
            </Button>
          </motion.div>
        )}

        {loading && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-3 py-8"
          >
            <Loader2 className="w-5 h-5 text-primary animate-spin" />
            <span className="text-sm text-muted-foreground font-body">Connecting to your future timeline...</span>
          </motion.div>
        )}

        {error && (
          <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <p className="text-sm text-destructive font-body">{error}</p>
          </motion.div>
        )}

        {advice && (
          <motion.div
            key="advice"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="prose prose-sm prose-invert max-w-none"
          >
            <div className="bg-muted/50 rounded-xl p-4 border border-primary/10">
              <ReactMarkdown>{advice}</ReactMarkdown>
            </div>
            <Button
              onClick={getAdvice}
              variant="outline"
              className="mt-4 border-primary/30 text-primary hover:bg-primary/10 font-body text-sm"
            >
              Ask Again
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

function generateLocalAdvice(
  d: Decisions,
  metrics: { wealth: number; happiness: number; health: number; impact: number },
  avg: number
): string {
  const parts: string[] = [];

  parts.push(`## 📡 Transmission from 2035\n`);
  parts.push(`*Hey, it's you—10 years from now.*\n`);

  if (avg > 70) {
    parts.push(`I'm proud of the path you're on. Your **overall life score of ${avg}/100** shows real commitment. Keep compounding these habits.\n`);
  } else if (avg > 40) {
    parts.push(`You're at a **crossroads** right now with a score of ${avg}/100. The decisions you make in the next 90 days will define the next decade.\n`);
  } else {
    parts.push(`I need you to hear this: with a score of ${avg}/100, you're heading somewhere you don't want to be. But the good news? **It's not too late.**\n`);
  }

  parts.push(`### 🔍 What I See\n`);

  if (d.socialMedia > 5) {
    parts.push(`- **Social media at ${d.socialMedia}hrs/day** is silently destroying your focus. Cut it to 1hr. Your future self will thank you.`);
  }
  if (d.sleepHours < 5) {
    parts.push(`- **${d.sleepHours}hrs of sleep** is a ticking time bomb. Your brain consolidates learning during sleep. You're sabotaging yourself.`);
  }
  if (d.exercise < 3) {
    parts.push(`- **Low physical activity** means your energy, mood, and cognitive performance are all declining. Even 30 min/day changes everything.`);
  }
  if (d.studyTime > 6) {
    parts.push(`- **${d.studyTime}hrs of deep work** is exceptional. This alone puts you in the top 5% of achievers.`);
  }
  if (d.discipline > 7) {
    parts.push(`- **Discipline at ${d.discipline}/10** is your superpower. It's the one metric that multiplies everything else.`);
  }
  if (d.screenTime > 5) {
    parts.push(`- **${d.screenTime}hrs of mindless screen time** is the #1 thief of your potential. Replace it with anything intentional.`);
  }

  parts.push(`\n### 🦋 The Butterfly Effect\n`);
  parts.push(`Remember: a 1% improvement daily = **37x better in one year**. Your smallest decisions are your most powerful ones.\n`);

  parts.push(`\n*— You, from the future* ✨`);

  return parts.join("\n");
}

export default AiFutureSelf;
