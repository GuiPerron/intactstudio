export type StepId =
  | "intro"
  | "discovery"
  | "features"
  | "surprise"
  | "priorities"
  | "summary";

export interface Step {
  id: StepId;
  label: string;
  number: number;
}

export const STEPS: Step[] = [
  { id: "intro", label: "Introduction", number: 1 },
  { id: "discovery", label: "Découverte", number: 2 },
  { id: "features", label: "Features", number: 3 },
  { id: "surprise", label: "Démos", number: 4 },
  { id: "priorities", label: "Priorités", number: 5 },
  { id: "summary", label: "Résumé", number: 6 },
];

export interface PainPoint {
  id: string;
  label: string;
  severity: "high" | "medium" | "low";
  selected: boolean;
}

export interface FeatureOption {
  id: string;
  title: string;
  description: string;
  icon: string;
  reaction?: "love" | "like" | "neutral" | "skip";
}

export interface SessionData {
  painPoints: PainPoint[];
  features: FeatureOption[];
  priorities: string[];
  freeNotes: string[];
  clientName?: string;
}

export type BlockType =
  | { type: "agent-message"; content: string; id: string }
  | { type: "user-message"; content: string; id: string }
  | { type: "choices"; id: string; question: string; options: ChoiceOption[]; multiSelect: boolean }
  | { type: "feature-cards"; id: string; features: FeatureOption[] }
  | { type: "demo-brand-voice"; id: string }
  | { type: "priority-ranker"; id: string; items: string[] }
  | { type: "summary-export"; id: string; data: SessionData };

export interface ChoiceOption {
  id: string;
  label: string;
  description?: string;
  icon?: string;
}
