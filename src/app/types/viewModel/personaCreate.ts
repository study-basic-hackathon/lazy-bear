import type { components } from "@/types/api/apiSchema";
type PersonaCreateApiDto = components["schemas"]["PersonaCreate"];

export type PersonaCreateViewModel = {
  weekdayHours: number | "";
  weekendHours: number | "";
  learningPattern: PersonaCreateApiDto["learningPattern"];
};

export type PersonaCreateErrors = {
  learningPattern?: string;
  hours?: string;
};