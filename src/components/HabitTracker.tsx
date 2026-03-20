import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, CheckCircle2, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, parseISO } from "date-fns";

const HabitTracker = () => {
  const { user } = useAuth();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [logs, setLogs] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [editForm, setEditForm] = useState({
    hours_work: 0, hours_sleep: 0, hours_exercise: 0,
    hours_social: 0, hours_entertainment: 0, hours_learning: 0, notes: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    const start = format(startOfMonth(currentMonth), "yyyy-MM-dd");
    const end = format(endOfMonth(currentMonth), "yyyy-MM-dd");
    supabase
      .from("habit_logs")
      .select("*")
      .eq("user_id", user.id)
      .gte("log_date", start)
      .lte("log_date", end)
      .then(({ data }) => {
        if (data) setLogs(data);
      });
  }, [user, currentMonth]);

  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  const startDow = startOfMonth(currentMonth).getDay();

  const getLogForDate = (date: Date) =>
    logs.find((l) => isSameDay(parseISO(l.log_date), date));

  const openDay = (date: Date) => {
    setSelectedDate(date);
    const existing = getLogForDate(date);
    if (existing) {
      setEditForm({
        hours_work: existing.hours_work,
        hours_sleep: existing.hours_sleep,
        hours_exercise: existing.hours_exercise,
        hours_social: existing.hours_social,
        hours_entertainment: existing.hours_entertainment,
        hours_learning: existing.hours_learning,
        notes: existing.notes || "",
      });
    } else {
      setEditForm({
        hours_work: 0, hours_sleep: 0, hours_exercise: 0,
        hours_social: 0, hours_entertainment: 0, hours_learning: 0, notes: "",
      });
    }
  };

  const saveLog = async () => {
    if (!user || !selectedDate) return;
    setSaving(true);
    const dateStr = format(selectedDate, "yyyy-MM-dd");
    const existing = getLogForDate(selectedDate);

    if (existing) {
      await supabase.from("habit_logs").update({
        ...editForm,
      }).eq("id", existing.id);
    } else {
      await supabase.from("habit_logs").insert([{
        user_id: user.id,
        log_date: dateStr,
        ...editForm,
      }]);
    }

    toast.success("Habit log saved!");
    setSelectedDate(null);
    setSaving(false);
    // Refresh
    const start = format(startOfMonth(currentMonth), "yyyy-MM-dd");
    const end = format(endOfMonth(currentMonth), "yyyy-MM-dd");
    const { data } = await supabase
      .from("habit_logs")
      .select("*")
      .eq("user_id", user.id)
      .gte("log_date", start)
      .lte("log_date", end);
    if (data) setLogs(data);
  };

  const loggedCount = logs.length;
  const streak = logs.length; // Simplified streak

  if (!user) {
    return (
      <div className="glass rounded-2xl p-8 text-center">
        <Calendar className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
        <p className="text-sm text-muted-foreground font-body">Sign in to track your daily habits</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-xl p-4 text-center">
          <div className="font-display text-2xl font-bold text-primary">{loggedCount}</div>
          <div className="text-xs text-muted-foreground font-body">Days Logged</div>
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="glass rounded-xl p-4 text-center">
          <div className="font-display text-2xl font-bold text-accent">{streak}</div>
          <div className="text-xs text-muted-foreground font-body">This Month</div>
        </motion.div>
      </div>

      {/* Month nav */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}>
          ←
        </Button>
        <span className="font-display text-sm text-foreground">{format(currentMonth, "MMMM yyyy")}</span>
        <Button variant="ghost" size="sm" onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}>
          →
        </Button>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
          <div key={d} className="text-center text-xs text-muted-foreground font-body py-1">{d}</div>
        ))}
        {Array.from({ length: startDow }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {days.map((day) => {
          const log = getLogForDate(day);
          const today = isToday(day);
          return (
            <motion.button
              key={day.toISOString()}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => openDay(day)}
              className={`aspect-square rounded-lg flex items-center justify-center text-xs font-body relative transition-colors ${
                log
                  ? "bg-primary/20 text-primary border border-primary/30"
                  : today
                  ? "bg-accent/10 text-accent border border-accent/30"
                  : "text-muted-foreground hover:bg-muted/50"
              }`}
            >
              {format(day, "d")}
              {log && (
                <div className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-primary" />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Edit Modal */}
      {selectedDate && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-5 border-primary/20"
        >
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-display text-sm font-bold text-foreground">
              {format(selectedDate, "EEEE, MMMM d")}
            </h4>
            <button onClick={() => setSelectedDate(null)}>
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { key: "hours_work", label: "Work" },
              { key: "hours_sleep", label: "Sleep" },
              { key: "hours_exercise", label: "Exercise" },
              { key: "hours_social", label: "Social" },
              { key: "hours_entertainment", label: "Entertainment" },
              { key: "hours_learning", label: "Learning" },
            ].map((field) => (
              <div key={field.key}>
                <label className="text-xs text-muted-foreground font-body">{field.label}</label>
                <input
                  type="number"
                  min={0}
                  max={24}
                  step={0.5}
                  value={(editForm as any)[field.key]}
                  onChange={(e) => setEditForm({ ...editForm, [field.key]: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-muted/50 border border-border/50 rounded-lg px-3 py-1.5 text-sm text-foreground font-body mt-1"
                />
              </div>
            ))}
          </div>
          <textarea
            placeholder="Notes..."
            value={editForm.notes}
            onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
            className="w-full bg-muted/50 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground font-body mt-3 resize-none h-16"
          />
          <Button
            onClick={saveLog}
            disabled={saving}
            className="w-full mt-3 bg-primary text-primary-foreground hover:bg-primary/90 font-display text-xs"
          >
            <CheckCircle2 className="w-4 h-4 mr-1" /> {saving ? "Saving..." : "Save Log"}
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default HabitTracker;
