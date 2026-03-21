
-- Create saved_scenarios table for scenario comparison feature
CREATE TABLE public.saved_scenarios (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL DEFAULT 'Untitled Scenario',
  allocation JSONB NOT NULL,
  priorities JSONB NOT NULL,
  metrics JSONB NOT NULL,
  traits JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.saved_scenarios ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own scenarios" ON public.saved_scenarios FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own scenarios" ON public.saved_scenarios FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own scenarios" ON public.saved_scenarios FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own scenarios" ON public.saved_scenarios FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER update_saved_scenarios_updated_at
  BEFORE UPDATE ON public.saved_scenarios
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
