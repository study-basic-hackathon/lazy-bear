import { components } from "@/contracts/api";

export type WeightCreateApiDto = components["schemas"]["WeightCreate"];

export interface WeightFormError {
  message: string | null;
}