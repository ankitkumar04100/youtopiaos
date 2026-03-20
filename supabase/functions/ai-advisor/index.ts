import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, mode } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompts: Record<string, string> = {
      "future-self": `You are the user's Future Self, speaking from 10 years in the future (2035). You have lived through the consequences of their current decisions. Speak with urgency, deep care, and radical honesty. Reference their exact metrics and time allocation. Use the butterfly effect — show how small changes compound. Be emotionally engaging but practical. Use markdown with headers and bullet points. Include specific numbers from their data. Sign off as "— You, from 2035 ✨"`,
      
      "mentor": `You are a world-class life optimization mentor — a blend of James Clear, Naval Ravikant, and a caring therapist. You speak with wisdom, empathy, and clarity. Reference the user's specific data to give precise, actionable guidance. Include habit science, behavioral psychology, and practical frameworks. Use markdown formatting. Be direct but warm. Include specific action items with timeframes.`,
      
      "habit-analyzer": `You are a behavioral pattern analyzer. Analyze the user's time allocation and identify: 1) Weak habits that need fixing, 2) Hidden patterns they might not notice, 3) The biggest leverage point for improvement. Be data-driven and specific. Reference their exact hours and metrics. Format as a clear report with sections.`,
      
      "risk-detector": `You are a risk assessment AI. Analyze the user's lifestyle data for: 1) Burnout risk factors, 2) Health decline indicators, 3) Career stagnation signals, 4) Social isolation patterns. Rate each risk 1-10 and explain why. Be honest and direct. Provide specific mitigation strategies.`,
      
      "opportunity-detector": `You are a growth opportunity detector. Based on the user's current allocation and metrics, identify: 1) Untapped potential areas, 2) Quick wins (small changes, big impact), 3) Long-term growth paths, 4) Skills or habits that would multiply their results. Be specific and actionable.`,
      
      "daily-plan": `You are a daily action planner. Based on the user's current time allocation and goals, generate a specific daily action plan with 3-5 tasks. Each task should: 1) Be concrete and measurable, 2) Take 15-60 minutes, 3) Target their weakest metric, 4) Be immediately actionable. Format as a numbered list with time estimates.`,
      
      "optimizer": `You are a life configuration optimizer. Given the user's priorities and constraints, suggest the OPTIMAL time allocation across their 24 hours to maximize their stated priorities. Show: 1) Current vs Recommended allocation, 2) Expected metric improvements, 3) The science behind each recommendation. Be specific with hours and percentages.`,
    };

    const systemPrompt = systemPrompts[mode] || systemPrompts["future-self"];

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited. Please try again in a moment." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("ai-advisor error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
