import { components } from "@/contracts/api";

export type StepCreateApiDto = components["schemas"]["StepCreate"];

export interface StepFormError {
  message: string | null;
}