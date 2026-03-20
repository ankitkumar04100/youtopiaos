import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trophy, Crown, Medal, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import type { LifeMetrics } from "@/lib/simulation-engine";

interface LeaderboardProps {
  currentMetrics: LifeMetrics;
}

interface LeaderboardEntry {
  id: string;
  display_alias: string;
  overall_score: number;
  wealth_score: number;
  happiness_score: number;
  health_score: number;
  impact_score: number;
}

const rankIcons = [Crown, Trophy, Medal];
const rankColors = ["text-accent", "text-primary", "text-success"];

const Leaderboard = ({ currentMetrics }: LeaderboardProps) => {
  const { user } = useAuth();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [myRank, setMyRank] = useState<number | null>(null);
  const [publishing, setPublishing] = useState(false);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    const { data } = await supabase
      .from("leaderboard_entries")
      .select("*")
      .order("overall_score", { ascending: false })
      .limit(50);

    if (data) {
      setEntries(data as LeaderboardEntry[]);
      if (user) {
        const idx = data.findIndex((e: any) => e.user_id === user.id);
        setMyRank(idx >= 0 ? idx + 1 : null);
      }
    }
  };

  const publishScore = async () => {
    if (!user) {
      toast.error("Sign in to publish your score");
      return;
    }
    setPublishing(true);
    const overall = Math.round(
      (currentMetrics.wealth + currentMetrics.happiness + currentMetrics.health + currentMetrics.impact) / 4
    );

    // Check if entry exists
    const { data: existing } = await supabase
      .from("leaderboard_entries")
      .select("id")
      .eq("user_id", user.id)
      .limit(1);

    const alias = `Player_${user.id.slice(0, 6)}`;

    if (existing && existing.length > 0) {
      await supabase.from("leaderboard_entries").update({
        wealth_score: Math.round(currentMetrics.wealth),
        happiness_score: Math.round(currentMetrics.happiness),
        health_score: Math.round(currentMetrics.health),
        impact_score: Math.round(currentMetrics.impact),
        overall_score: overall,
        display_alias: alias,
      }).eq("id", existing[0].id);
    } else {
      await supabase.from("leaderboard_entries").insert([{
        user_id: user.id,
        display_alias: alias,
        wealth_score: Math.round(currentMetrics.wealth),
        happiness_score: Math.round(currentMetrics.happiness),
        health_score: Math.round(currentMetrics.health),
        impact_score: Math.round(currentMetrics.impact),
        overall_score: overall,
      }]);
    }

    toast.success("Score published!");
    fetchLeaderboard();
    setPublishing(false);
  };

  const myOverall = Math.round(
    (currentMetrics.wealth + currentMetrics.happiness + currentMetrics.health + currentMetrics.impact) / 4
  );

  return (
    <div className="space-y-5">
      {/* My Score Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-5 glow-primary border-primary/20"
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-muted-foreground font-body uppercase tracking-wider mb-1">Your Score</div>
            <div className="font-display text-3xl font-black text-primary">{myOverall}</div>
            {myRank && (
              <div className="text-xs text-accent font-body mt-1">Rank #{myRank}</div>
            )}
          </div>
          <Button
            onClick={publishScore}
            disabled={publishing || !user}
            className="bg-primary text-primary-foreground hover:bg-primary/90 font-display text-xs"
          >
            <Upload className="w-4 h-4 mr-1" /> {publishing ? "Publishing..." : "Publish Score"}
          </Button>
        </div>
      </motion.div>

      {/* Leaderboard List */}
      <div className="space-y-2">
        <h3 className="font-display text-lg font-bold text-foreground flex items-center gap-2">
          <Trophy className="w-5 h-5 text-accent" /> Global Leaderboard
        </h3>
        {entries.length === 0 ? (
          <div className="glass rounded-xl p-8 text-center">
            <Trophy className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground font-body">No entries yet. Be the first!</p>
          </div>
        ) : (
          entries.slice(0, 20).map((entry, i) => {
            const RankIcon = rankIcons[i] || null;
            const isMe = user && entries[i] && (entry as any).user_id === user.id;
            return (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className={`glass rounded-xl p-3 flex items-center gap-3 ${isMe ? "border-primary/30 glow-primary" : ""}`}
              >
                <div className="w-8 text-center">
                  {RankIcon ? (
                    <RankIcon className={`w-5 h-5 mx-auto ${rankColors[i]}`} />
                  ) : (
                    <span className="font-display text-sm text-muted-foreground">{i + 1}</span>
                  )}
                </div>
                <div className="flex-1">
                  <span className="font-body text-sm text-foreground">{entry.display_alias}</span>
                  {isMe && <span className="text-xs text-primary ml-2 font-display">YOU</span>}
                </div>
                <div className="flex gap-3 text-xs font-body text-muted-foreground">
                  <span>💰{entry.wealth_score}</span>
                  <span>😊{entry.happiness_score}</span>
                  <span>💪{entry.health_score}</span>
                  <span>🌍{entry.impact_score}</span>
                </div>
                <div className="font-display text-sm font-bold text-primary w-10 text-right">{entry.overall_score}</div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
