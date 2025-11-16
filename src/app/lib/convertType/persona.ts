import type { components } from "@/types/api/apiSchema";
import type { PersonaCreateViewModel } from "@/types/viewModel/personaCreate";

type PersonaCreateApiDto = components["schemas"]["PersonaCreate"];

export function apiToViewModel(
  api: Partial<PersonaCreateApiDto>
): PersonaCreateViewModel {
  return {
    weekdayHours: api.weekdayHours ?? "",
    weekendHours: api.weekendHours ?? "",
    learningPattern:
      api.learningPattern ?? "インプット先行パターン",
  };
}

export function viewModelToApi(
  vm: PersonaCreateViewModel
): PersonaCreateApiDto {
  return {
    weekdayHours: Number(vm.weekdayHours),
    weekendHours: Number(vm.weekendHours),
    learningPattern: vm.learningPattern,
  };
}