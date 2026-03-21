import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const ADVISOR_PROMPTS: Record<string, string> = {
  "future-self": `You are the user's Future Self from 2035. Speak with urgency, deep care, and radical honesty. Reference their exact data. Show how small changes compound. Be emotionally engaging but practical. Use markdown. Sign off as "— You, from 2035 ✨"`,
  "mentor": `You are a world-class life optimization mentor — a blend of James Clear, Naval Ravikant, and a caring therapist. Reference the user's specific data for precise, actionable guidance. Include behavioral psychology and practical frameworks. Be direct but warm.`,
  "habit-analyzer": `You are a behavioral pattern analyzer. Analyze the user's time allocation and identify: 1) Weak habits, 2) Hidden patterns, 3) The biggest leverage point. Be data-driven and specific. Format as a clear report.`,
  "risk-detector": `You are a risk assessment AI. Analyze for: 1) Burnout risk, 2) Health decline, 3) Career stagnation, 4) Social isolation. Rate each 1-10 with mitigation strategies. Be honest and direct.`,
  "opportunity-detector": `You are a growth opportunity detector. Identify: 1) Untapped potential, 2) Quick wins, 3) Long-term growth paths, 4) Force-multiplying habits. Be specific and actionable.`,
  "daily-plan": `You are a daily action planner. Generate 3-5 specific tasks based on user data. Each must be concrete, measurable, 15-60 minutes, and target their weakest area. Numbered list with time estimates.`,
  "optimizer": `You are a life configuration optimizer. Suggest the OPTIMAL 24h allocation to maximize stated priorities. Show current vs recommended, expected improvements, and the science behind each change.`,
};

const SIMULATION_SYSTEM = `You are YOUtopia OS — an advanced AI life simulation intelligence system. You analyze human life decisions and generate realistic, personalized life projections.

You will receive a user's complete life configuration (24h time allocation, priority weights, and optionally habit history). You must analyze this deeply and return a structured JSON response.

RULES:
- Be realistic and nuanced — no generic advice
- Every score must be justified by the input data
- Projections must show compounding effects realistically
- Traits must be inferred from behavioral patterns, not assigned arbitrarily
- Warnings must be specific and evidence-based from the data
- Narratives must be personal, emotional, and reference specific numbers

Return ONLY valid JSON matching the exact schema requested. No markdown, no explanation outside JSON.`;

const SCENARIO_COMPARE_SYSTEM = `You are YOUtopia OS scenario comparison engine. You receive two life configurations and must provide deep, intelligent analysis of their differences and which leads to better outcomes.

Return ONLY valid JSON. Be specific, reference exact numbers, and explain the WHY behind each difference's impact.`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json();
    const { mode, messages, simulationData, scenarioA, scenarioB } = body;
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    // === SIMULATION MODE (structured JSON output via tool calling) ===
    if (mode === "simulate") {
      const prompt = `Analyze this life configuration and generate a complete simulation:

${JSON.stringify(simulationData, null, 2)}

Generate realistic scores (0-100) for each metric. Infer behavioral traits from patterns. Calculate risk warnings. Project 10-year outcomes with compounding effects. Write a brief narrative for the ideal and shadow futures.`;

      const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: SIMULATION_SYSTEM },
            { role: "user", content: prompt },
          ],
          tools: [{
            type: "function",
            function: {
              name: "simulation_result",
              description: "Return the complete life simulation analysis",
              parameters: {
                type: "object",
                properties: {
                  metrics: {
                    type: "object",
                    properties: {
                      wealth: { type: "number", description: "0-100 wealth/financial score" },
                      happiness: { type: "number", description: "0-100 happiness score" },
                      health: { type: "number", description: "0-100 health score" },
                      impact: { type: "number", description: "0-100 social impact score" },
                    },
                    required: ["wealth", "happiness", "health", "impact"],
                  },
                  traits: {
                    type: "object",
                    properties: {
                      focusLevel: { type: "number", description: "0-100" },
                      consistencyScore: { type: "number", description: "0-100" },
                      disciplineLevel: { type: "number", description: "0-100" },
                      riskTaking: { type: "number", description: "0-100" },
                      stressTolerance: { type: "number", description: "0-100" },
                    },
                    required: ["focusLevel", "consistencyScore", "disciplineLevel", "riskTaking", "stressTolerance"],
                  },
                  warnings: {
                    type: "object",
                    properties: {
                      burnoutRisk: { type: "number", description: "0-100 percentage" },
                      healthDecline: { type: "number", description: "0-100 percentage" },
                      isolationRisk: { type: "number", description: "0-100 percentage" },
                      stagnationRisk: { type: "number", description: "0-100 percentage" },
                    },
                    required: ["burnoutRisk", "healthDecline", "isolationRisk", "stagnationRisk"],
                  },
                  yearProjections: {
                    type: "array",
                    description: "11 entries for years 0-10",
                    items: {
                      type: "object",
                      properties: {
                        year: { type: "number" },
                        wealth: { type: "number" },
                        happiness: { type: "number" },
                        health: { type: "number" },
                        impact: { type: "number" },
                      },
                      required: ["year", "wealth", "happiness", "health", "impact"],
                    },
                  },
                  idealFutureNarrative: { type: "string", description: "2-3 sentence emotional narrative of their best future path" },
                  shadowFutureNarrative: { type: "string", description: "2-3 sentence warning narrative of their worst path" },
                  idealHighlights: { type: "array", items: { type: "string" }, description: "4 bullet points for ideal future" },
                  shadowHighlights: { type: "array", items: { type: "string" }, description: "4 bullet points for shadow future" },
                  behavioralInsight: { type: "string", description: "1-2 sentence AI insight about their behavioral pattern" },
                },
                required: ["metrics", "traits", "warnings", "yearProjections", "idealFutureNarrative", "shadowFutureNarrative", "idealHighlights", "shadowHighlights", "behavioralInsight"],
                additionalProperties: false,
              },
            },
          }],
          tool_choice: { type: "function", function: { name: "simulation_result" } },
        }),
      });

      if (!response.ok) {
        const status = response.status;
        const t = await response.text();
        console.error("AI gateway error:", status, t);
        if (status === 429) return new Response(JSON.stringify({ error: "Rate limited. Please try again." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
        if (status === 402) return new Response(JSON.stringify({ error: "AI credits exhausted." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
        return new Response(JSON.stringify({ error: "AI gateway error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      const data = await response.json();
      const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
      if (!toolCall) throw new Error("No tool call in response");

      const result = JSON.parse(toolCall.function.arguments);
      return new Response(JSON.stringify(result), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // === SCENARIO COMPARE MODE ===
    if (mode === "compare-scenarios") {
      const prompt = `Compare these two life scenarios and provide deep analysis:

SCENARIO A: ${JSON.stringify(scenarioA, null, 2)}

SCENARIO B: ${JSON.stringify(scenarioB, null, 2)}

Analyze differences, impact, risks, and recommend the better scenario with reasoning.`;

      const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: SCENARIO_COMPARE_SYSTEM },
            { role: "user", content: prompt },
          ],
          tools: [{
            type: "function",
            function: {
              name: "scenario_comparison",
              description: "Return scenario comparison analysis",
              parameters: {
                type: "object",
                properties: {
                  summary: { type: "string", description: "2-3 sentence overview of key differences" },
                  recommendation: { type: "string", description: "Which scenario is better and why (2-3 sentences)" },
                  keyDifferences: { type: "array", items: { type: "string" }, description: "3-5 key difference points" },
                  riskComparison: { type: "string", description: "Which has more risk and why" },
                  longTermWinner: { type: "string", enum: ["A", "B", "tie"], description: "Which scenario wins long-term" },
                },
                required: ["summary", "recommendation", "keyDifferences", "riskComparison", "longTermWinner"],
                additionalProperties: false,
              },
            },
          }],
          tool_choice: { type: "function", function: { name: "scenario_comparison" } },
        }),
      });

      if (!response.ok) {
        const t = await response.text();
        console.error("AI compare error:", response.status, t);
        return new Response(JSON.stringify({ error: "AI error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      const data = await response.json();
      const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
      if (!toolCall) throw new Error("No tool call in response");

      const result = JSON.parse(toolCall.function.arguments);
      return new Response(JSON.stringify(result), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // === STREAMING ADVISOR MODES ===
    const systemPrompt = ADVISOR_PROMPTS[mode] || ADVISOR_PROMPTS["future-self"];

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) return new Response(JSON.stringify({ error: "Rate limited. Please try again." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      if (response.status === 402) return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    return new Response(response.body, { headers: { ...corsHeaders, "Content-Type": "text/event-stream" } });
  } catch (e) {
    console.error("ai-advisor error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
