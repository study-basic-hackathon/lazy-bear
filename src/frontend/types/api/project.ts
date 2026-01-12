import { components } from "@/contracts/api";

export type ProjectApiDto = components["schemas"]["Project"];
export type ProjectCreateApiDto = components["schemas"]["ProjectCreate"];

export interface ProjectFormErrors {
  certificationName: {
    message: string | null;
  },
  startDate: {
    message: string | null;
  },
  examDate: {
    message: string | null;
  },
  baseMaterial: {
    message: string | null;
  },
};