import type { components } from "@/types/api/apiSchema";
export type PersonaCreateApiDto = components["schemas"]["PersonaCreate"];

export type PersonaCreateViewModel = {
  weekdayHours: string | "";
  weekendHours: string | "";
  learningPattern: PersonaCreateApiDto["learningPattern"];
};

export type PersonaCreateErrors = {
  weekdayHours: string | null;
  weekendHours: string | null;
  learningPattern: string | null;
};