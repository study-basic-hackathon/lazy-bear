import type { components } from "@/types/api/apiSchema";
type PersonaCreate = components["schemas"]["PersonaCreate"];
type LearningPattern = PersonaCreate["learningPattern"];

export type LearningPatternSelectProps = {
  value: LearningPattern;
  onChange: (value: LearningPattern) => void;
  error?: string;
};