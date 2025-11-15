import type { components } from "@/types/api/apiSchema";
type PersonaCreate = components["schemas"]["PersonaCreate"];

export type PersonaCreateViewModel = {
  weekdayHours: number | "";
  weekendHours: number | "";
  learningPattern: PersonaCreate["learningPattern"];
  errors: {
    learningPattern?: string;
    hours?: string;
  };
};
