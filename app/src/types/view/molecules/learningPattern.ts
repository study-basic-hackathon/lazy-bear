import type { components } from "@/types/api/apiSchema";
type PersonaCreateApiDto = components["schemas"]["PersonaCreate"];
type LearningPattern = PersonaCreateApiDto["learningPattern"];

export type LearningPatternSelectProps = {
  value: LearningPattern;
  onChange: (value: LearningPattern) => void;
  error?: string;
};