import type { components } from "@/types/api/apiSchema";
import type { PersonaCreateViewModel } from "@/types/viewModel/persona";

type PersonaCreate = components["schemas"]["PersonaCreate"];

// API → ViewModel
export const toViewModel = (
  api: Partial<PersonaCreate>
): PersonaCreateViewModel => ({
  weekdayHours: api.weekdayHours ?? "",
  weekendHours: api.weekendHours ?? "",
  learningPattern:
    api.learningPattern ?? "インプット先行パターン",
  errors: {},
});

// ViewModel → API
export const toApiModel = (vm: PersonaCreateViewModel): PersonaCreate => ({
  weekdayHours: Number(vm.weekdayHours),
  weekendHours: Number(vm.weekendHours),
  learningPattern: vm.learningPattern,
});