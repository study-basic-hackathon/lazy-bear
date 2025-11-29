import type { components } from "@/types/api/apiSchema";
import type { PersonaCreateErrors } from "@/types/viewModel/personaCreate";
type PersonaCreateApiDto = components["schemas"]["PersonaCreate"];
type LearningPattern = PersonaCreateApiDto["learningPattern"];

export type LearningPatternSelectProps = {
  value: LearningPattern;
  onChange: (value: LearningPattern) => void;
  error: PersonaCreateErrors["learningPattern"];
};