// ====== CORE TYPES & DEFAULTS ======

export interface TimeAllocation {
  work: number;
  sleep: number;
  exercise: number;
  social: number;
  entertainment: number;
  learning: number;
}

export interface Priorities {
  career: number;
  health: number;
  happiness: number;
  socialLife: number;
}

export interface BehavioralTraits {
  focusLevel: number;
  consistencyScore: number;
  disciplineLevel: number;
  riskTaking: number;
  stressTolerance: number;
}

export interface LifeMetrics {
  wealth: number;
  happiness: number;
  health: number;
  impact: number;
}

export interface ConstraintWarnings {
  burnoutRisk: number;
  healthDecline: number;
  isolationRisk: number;
  stagnationRisk: number;
}

export interface YearProjection {
  year: number;
  wealth: number;
  happiness: number;
  health: number;
  impact: number;
}

export interface AISimulationResult {
  metrics: LifeMetrics;
  traits: BehavioralTraits;
  warnings: ConstraintWarnings;
  yearProjections: YearProjection[];
  idealFutureNarrative: string;
  shadowFutureNarrative: string;
  idealHighlights: string[];
  shadowHighlights: string[];
  behavioralInsight: string;
}

export interface SimulationResult {
  metrics: LifeMetrics;
  traits: BehavioralTraits;
  warnings: ConstraintWarnings;
  yearProjections: YearProjection[];
  idealFutureNarrative?: string;
  shadowFutureNarrative?: string;
  idealHighlights?: string[];
  shadowHighlights?: string[];
  behavioralInsight?: string;
}

export interface ScenarioCompareResult {
  summary: string;
  recommendation: string;
  keyDifferences: string[];
  riskComparison: string;
  longTermWinner: "A" | "B" | "tie";
}

export const defaultAllocation: TimeAllocation = {
  work: 8,
  sleep: 7,
  exercise: 1,
  social: 2,
  entertainment: 3,
  learning: 1,
};

export const getRemainingHours = (a: TimeAllocation) =>
  24 - Object.values(a).reduce((s, v) => s + v, 0);

export const defaultPriorities: Priorities = {
  career: 30,
  health: 25,
  happiness: 25,
  socialLife: 20,
};

// ====== INSTANT LOCAL FALLBACK (used while AI loads) ======
function clamp(v: number, min = 0, max = 100) {
  return Math.min(max, Math.max(min, Math.round(v)));
}

export function inferTraits(a: TimeAllocation, p: Priorities): BehavioralTraits {
  const totalProductive = a.work + a.learning + a.exercise;
  const totalPassive = a.entertainment;
  return {
    focusLevel: clamp(((a.work + a.learning) / 12) * 100),
    consistencyScore: clamp(
      a.sleep >= 7 && a.sleep <= 9 ? 70 + (a.exercise > 0 ? 20 : 0) + (a.learning > 0 ? 10 : 0) : 30 + totalProductive * 3
    ),
    disciplineLevel: clamp(((totalProductive - totalPassive * 0.5) / 10) * 100),
    riskTaking: clamp(p.career > 40 ? 70 : p.career > 25 ? 50 : 30),
    stressTolerance: clamp(a.sleep >= 7 ? 60 + a.exercise * 8 - Math.max(0, a.work - 10) * 5 : 30 + a.exercise * 5),
  };
}

export function calculateWarnings(a: TimeAllocation, traits: BehavioralTraits): ConstraintWarnings {
  return {
    burnoutRisk: clamp((a.work > 12 ? 80 : a.work > 10 ? 50 : a.work > 8 ? 20 : 0) + (a.sleep < 6 ? 30 : a.sleep < 7 ? 10 : 0) - a.exercise * 5),
    healthDecline: clamp((a.sleep < 6 ? 40 : a.sleep < 7 ? 15 : 0) + (a.exercise < 0.5 ? 35 : a.exercise < 1 ? 15 : 0) + (a.entertainment > 5 ? 20 : 0) - traits.disciplineLevel * 0.2),
    isolationRisk: clamp((a.social < 1 ? 60 : a.social < 2 ? 25 : 0) + (a.work > 10 ? 15 : 0) - a.social * 10),
    stagnationRisk: clamp((a.learning < 0.5 ? 40 : a.learning < 1 ? 15 : 0) + (a.entertainment > 5 ? 30 : 0) + (a.work < 4 ? 20 : 0) - traits.focusLevel * 0.3),
  };
}

export function calculateLifeMetrics(a: TimeAllocation, p: Priorities, traits: BehavioralTraits): LifeMetrics {
  const cW = p.career / 100, hW = p.health / 100, haW = p.happiness / 100, sW = p.socialLife / 100;
  return {
    wealth: clamp(a.work * 8 * cW * 2 + a.learning * 10 * cW * 2 + traits.disciplineLevel * 0.3 + traits.focusLevel * 0.2 - a.entertainment * 3),
    happiness: clamp(a.exercise * 10 * hW + a.social * 12 * sW * 2 + a.sleep * 6 * hW + traits.stressTolerance * 0.2 + a.entertainment * 4 * haW - Math.max(0, a.work - 10) * 5),
    health: clamp(a.exercise * 15 + (a.sleep >= 7 && a.sleep <= 9 ? 30 : a.sleep * 3) + traits.stressTolerance * 0.3 - Math.max(0, a.work - 10) * 4 - a.entertainment * 2),
    impact: clamp(a.work * 5 * cW + a.learning * 12 + a.social * 8 * sW * 2 + traits.consistencyScore * 0.3 + traits.disciplineLevel * 0.2 - a.entertainment * 2),
  };
}

export function simulateYears(metrics: LifeMetrics, a: TimeAllocation, traits: BehavioralTraits, years = 10): YearProjection[] {
  const projections: YearProjection[] = [];
  for (let y = 0; y <= years; y++) {
    const cm = 1 + (traits.consistencyScore / 100) * 0.05;
    const bd = a.work > 10 && a.sleep < 7 ? 0.97 : 1;
    const lb = 1 + a.learning * 0.02;
    const compound = Math.pow(cm * bd * lb, y);
    const hd = a.exercise < 1 && a.sleep < 7 ? Math.pow(0.97, y) : 1;
    const sc = a.social >= 2 ? Math.pow(1.03, y) : Math.pow(0.98, y);
    projections.push({
      year: y,
      wealth: clamp(metrics.wealth * compound),
      happiness: clamp(metrics.happiness * compound * sc * 0.98),
      health: clamp(metrics.health * hd * (a.exercise >= 1 ? Math.pow(1.01, y) : 1)),
      impact: clamp(metrics.impact * compound * sc),
    });
  }
  return projections;
}

/** Quick local simulation (instant, used as fallback while AI processes) */
export function runSimulation(a: TimeAllocation, p: Priorities): SimulationResult {
  const traits = inferTraits(a, p);
  const warnings = calculateWarnings(a, traits);
  const metrics = calculateLifeMetrics(a, p, traits);
  const yearProjections = simulateYears(metrics, a, traits, 10);
  return { metrics, traits, warnings, yearProjections };
}

// ====== AI SIMULATION API ======
const AI_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-advisor`;

export async function runAISimulation(
  allocation: TimeAllocation,
  priorities: Priorities,
  habitHistory?: any[]
): Promise<AISimulationResult> {
  const resp = await fetch(AI_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
    },
    body: JSON.stringify({
      mode: "simulate",
      simulationData: {
        allocation,
        priorities,
        totalHours: Object.values(allocation).reduce((s, v) => s + v, 0),
        habitHistory: habitHistory?.slice(-7) || [],
      },
    }),
  });

  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    throw new Error(err.error || `AI simulation failed (${resp.status})`);
  }

  return resp.json();
}

export async function compareScenarios(
  scenarioA: { name: string; allocation: TimeAllocation; priorities: Priorities; metrics: LifeMetrics },
  scenarioB: { name: string; allocation: TimeAllocation; priorities: Priorities; metrics: LifeMetrics }
): Promise<ScenarioCompareResult> {
  const resp = await fetch(AI_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
    },
    body: JSON.stringify({
      mode: "compare-scenarios",
      scenarioA,
      scenarioB,
    }),
  });

  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    throw new Error(err.error || `Scenario comparison failed (${resp.status})`);
  }

  return resp.json();
}
