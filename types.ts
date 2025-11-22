export interface SimulationState {
  computeBudget: number; // 1 to 100 scale
  modelSize: number; // Derived or user set
  datasetSize: number; // Derived or user set
  loss: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export enum Section {
  INTRO = 'intro',
  PROBLEM = 'problem',
  FORMULA = 'formula',
  ISOFLOP = 'isoflop',
  COMPARISON = 'comparison',
  CALCULATOR = 'calculator',
}

export type ViewState = 'HOME' | 'GAME';

export interface GameLevel {
  id: number;
  name: string;
  budgetLabel: string; // e.g., "1M FLOPs (Prototype)"
  budgetExponent: number; // Power of 10
  description: string;
}