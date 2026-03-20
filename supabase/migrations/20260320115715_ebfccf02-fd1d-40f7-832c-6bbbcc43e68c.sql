
-- Leaderboard table for anonymous score comparison
CREATE TABLE public.leaderboard_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  display_alias text NOT NULL DEFAULT 'Anonymous',
  wealth_score integer NOT NULL DEFAULT 0,
  happiness_score integer NOT NULL DEFAULT 0,
  health_score integer NOT NULL DEFAULT 0,
  impact_score integer NOT NULL DEFAULT 0,
  overall_score integer NOT NULL DEFAULT 0,
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.leaderboard_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view leaderboard" ON public.leaderboard_entries FOR SELECT USING (true);
CREATE POLICY "Users can insert own entry" ON public.leaderboard_entries FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own entry" ON public.leaderboard_entries FOR UPDATE USING (auth.uid() = user_id);

-- Habit tracking table
CREATE TABLE public.habit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  log_date date NOT NULL DEFAULT CURRENT_DATE,
  hours_work numeric NOT NULL DEFAULT 0,
  hours_sleep numeric NOT NULL DEFAULT 0,
  hours_exercise numeric NOT NULL DEFAULT 0,
  hours_social numeric NOT NULL DEFAULT 0,
  hours_entertainment numeric NOT NULL DEFAULT 0,
  hours_learning numeric NOT NULL DEFAULT 0,
  notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, log_date)
);

ALTER TABLE public.habit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own habits" ON public.habit_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own habits" ON public.habit_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own habits" ON public.habit_logs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own habits" ON public.habit_logs FOR DELETE USING (auth.uid() = user_id);
