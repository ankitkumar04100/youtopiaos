// ====== CORE SIMULATION ENGINE ======
// Handles all calculations: 24h allocation, priorities, behavioral intelligence,
// constraint engine, time simulation, and butterfly effect.

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

export interface SimulationResult {
  metrics: LifeMetrics;
  traits: BehavioralTraits;
  warnings: ConstraintWarnings;
  yearProjections: YearProjection[];
}

export interface YearProjection {
  year: number;
  wealth: number;
  happiness: number;
  health: number;
  impact: number;
}

// Default allocations
export const defaultAllocation: TimeAllocation = {
  work: 8,
  sleep: 7,
  exercise: 1,
  social: 2,
  entertainment: 3,
  learning: 1,
};

// Remaining = 24 - sum
export const getRemainingHours = (a: TimeAllocation) =>
  24 - Object.values(a).reduce((s, v) => s + v, 0);

export const defaultPriorities: Priorities = {
  career: 30,
  health: 25,
  happiness: 25,
  socialLife: 20,
};

// ====== BEHAVIORAL INTELLIGENCE (AI-inferred) ======
export function inferTraits(a: TimeAllocation, p: Priorities): BehavioralTraits {
  const totalProductive = a.work + a.learning + a.exercise;
  const totalPassive = a.entertainment;

  return {
    focusLevel: clamp(((a.work + a.learning) / 12) * 100),
    consistencyScore: clamp(
      a.sleep >= 7 && a.sleep <= 9 ? 70 + (a.exercise > 0 ? 20 : 0) + (a.learning > 0 ? 10 : 0) : 30 + totalProductive * 3
    ),
    disciplineLevel: clamp(
      ((totalProductive - totalPassive * 0.5) / 10) * 100
    ),
    riskTaking: clamp(p.career > 40 ? 70 : p.career > 25 ? 50 : 30),
    stressTolerance: clamp(
      a.sleep >= 7 ? 60 + a.exercise * 8 - Math.max(0, a.work - 10) * 5 : 30 + a.exercise * 5
    ),
  };
}

// ====== CONSTRAINT ENGINE ======
export function calculateWarnings(a: TimeAllocation, traits: BehavioralTraits): ConstraintWarnings {
  return {
    burnoutRisk: clamp(
      (a.work > 12 ? 80 : a.work > 10 ? 50 : a.work > 8 ? 20 : 0) +
      (a.sleep < 6 ? 30 : a.sleep < 7 ? 10 : 0) -
      a.exercise * 5
    ),
    healthDecline: clamp(
      (a.sleep < 6 ? 40 : a.sleep < 7 ? 15 : 0) +
      (a.exercise < 0.5 ? 35 : a.exercise < 1 ? 15 : 0) +
      (a.entertainment > 5 ? 20 : 0) -
      traits.disciplineLevel * 0.2
    ),
    isolationRisk: clamp(
      (a.social < 1 ? 60 : a.social < 2 ? 25 : 0) +
      (a.work > 10 ? 15 : 0) -
      a.social * 10
    ),
    stagnationRisk: clamp(
      (a.learning < 0.5 ? 40 : a.learning < 1 ? 15 : 0) +
      (a.entertainment > 5 ? 30 : 0) +
      (a.work < 4 ? 20 : 0) -
      traits.focusLevel * 0.3
    ),
  };
}

// ====== LIFE METRICS CALCULATION ======
export function calculateLifeMetrics(
  a: TimeAllocation,
  p: Priorities,
  traits: BehavioralTraits
): LifeMetrics {
  const careerW = p.career / 100;
  const healthW = p.health / 100;
  const happyW = p.happiness / 100;
  const socialW = p.socialLife / 100;

  const wealth = clamp(
    a.work * 8 * careerW * 2 +
    a.learning * 10 * careerW * 2 +
    traits.disciplineLevel * 0.3 +
    traits.focusLevel * 0.2 -
    a.entertainment * 3
  );

  const happiness = clamp(
    a.exercise * 10 * healthW +
    a.social * 12 * socialW * 2 +
    a.sleep * 6 * healthW +
    traits.stressTolerance * 0.2 +
    a.entertainment * 4 * happyW -
    Math.max(0, a.work - 10) * 5
  );

  const health = clamp(
    a.exercise * 15 +
    (a.sleep >= 7 && a.sleep <= 9 ? 30 : a.sleep * 3) +
    traits.stressTolerance * 0.3 -
    Math.max(0, a.work - 10) * 4 -
    a.entertainment * 2
  );

  const impact = clamp(
    a.work * 5 * careerW +
    a.learning * 12 +
    a.social * 8 * socialW * 2 +
    traits.consistencyScore * 0.3 +
    traits.disciplineLevel * 0.2 -
    a.entertainment * 2
  );

  return { wealth, happiness, health, impact };
}

// ====== TIME SIMULATION (1/5/10 years) ======
export function simulateYears(
  metrics: LifeMetrics,
  a: TimeAllocation,
  traits: BehavioralTraits,
  years: number = 10
): YearProjection[] {
  const projections: YearProjection[] = [];

  for (let y = 0; y <= years; y++) {
    // Compounding: consistency drives exponential growth
    const consistencyMultiplier = 1 + (traits.consistencyScore / 100) * 0.05;
    const burnoutDrag = a.work > 10 && a.sleep < 7 ? 0.97 : 1;
    const learningBoost = 1 + a.learning * 0.02;

    const compound = Math.pow(consistencyMultiplier * burnoutDrag * learningBoost, y);

    // Health degrades if neglected
    const healthDecay = a.exercise < 1 && a.sleep < 7 ? Math.pow(0.97, y) : 1;

    // Social compounds slowly
    const socialCompound = a.social >= 2 ? Math.pow(1.03, y) : Math.pow(0.98, y);

    projections.push({
      year: y,
      wealth: clamp(metrics.wealth * compound),
      happiness: clamp(metrics.happiness * compound * socialCompound * 0.98),
      health: clamp(metrics.health * healthDecay * (a.exercise >= 1 ? Math.pow(1.01, y) : 1)),
      impact: clamp(metrics.impact * compound * socialCompound),
    });
  }

  return projections;
}

// ====== BUTTERFLY EFFECT ======
export function butterflyEffect(
  baseMetrics: LifeMetrics,
  tweakedMetrics: LifeMetrics,
  baseAlloc: TimeAllocation,
  tweakedAlloc: TimeAllocation,
  baseTraits: BehavioralTraits,
  tweakedTraits: BehavioralTraits
): { base10: YearProjection; tweaked10: YearProjection; percentDiff: LifeMetrics } {
  const base10 = simulateYears(baseMetrics, baseAlloc, baseTraits, 10)[10];
  const tweaked10 = simulateYears(tweakedMetrics, tweakedAlloc, tweakedTraits, 10)[10];

  return {
    base10,
    tweaked10,
    percentDiff: {
      wealth: Math.round(tweaked10.wealth - base10.wealth),
      happiness: Math.round(tweaked10.happiness - base10.happiness),
      health: Math.round(tweaked10.health - base10.health),
      impact: Math.round(tweaked10.impact - base10.impact),
    },
  };
}

// Full simulation
export function runSimulation(a: TimeAllocation, p: Priorities): SimulationResult {
  const traits = inferTraits(a, p);
  const warnings = calculateWarnings(a, traits);
  const metrics = calculateLifeMetrics(a, p, traits);
  const yearProjections = simulateYears(metrics, a, traits, 10);
  return { metrics, traits, warnings, yearProjections };
}

function clamp(v: number, min = 0, max = 100) {
  return Math.min(max, Math.max(min, Math.round(v)));
}
