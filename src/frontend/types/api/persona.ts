import type { components } from "@/contracts/api";

export type PersonaCreateApiDto = components["schemas"]["PersonaCreate"];

export interface PersonaFormErrors {
  weekdayHours: {
    message: string | null;
  },
  weekendHours: {
    message: string | null;
  },
  learningPattern: {
    message: string | null;
  },
};