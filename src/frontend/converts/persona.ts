import type { PersonaCreateApiDto } from "@/frontend/types/api/persona";
import type { PersonaFormErrors } from "@/frontend/types/api/persona";
import type { PersonaCreateViewModel } from "@/frontend/types/viewModel/persona";
import { learningPatternMap, reverseLearningPatternMap } from "@/frontend/types/viewModel/persona";
import type { Result } from "@/frontend/utils/Result";
import { success, fail } from "@/frontend/utils/Result";

export const convertToApi = (
  vm: PersonaCreateViewModel
): Result<PersonaCreateApiDto, PersonaFormErrors> => {
  const errors: PersonaFormErrors = {
    weekdayHours: { message: null },
    weekendHours: { message: null },
    learningPattern: { message: null },
  };

  const weekday = Number(vm.weekdayHours);
  if (!vm.weekdayHours.trim() || Number.isNaN(weekday) || weekday <= 0) {
    errors.weekdayHours.message = "1時間以上の数値を入力してください";
  }

  const weekend = Number(vm.weekendHours);
  if (!vm.weekendHours.trim() || Number.isNaN(weekend) || weekend <= 0) {
    errors.weekendHours.message = "1時間以上の数値を入力してください";
  }

  if (!vm.learningPattern) {
    errors.learningPattern.message = "学習方法を入力してください";
  }

  if (
    errors.weekdayHours.message ||
    errors.weekendHours.message ||
    errors.learningPattern.message
  ) {
    return fail(errors);
  }

  return success({
    weekdayHours: weekday,
    weekendHours: weekend,
    learningPattern:
      learningPatternMap[vm.learningPattern],
  });
};

export const convertToViewModel = (
  dto: PersonaCreateApiDto
): PersonaCreateViewModel => {
  return {
    weekdayHours: String(dto.weekdayHours),
    weekendHours: String(dto.weekendHours),
    learningPattern:
      reverseLearningPatternMap[dto.learningPattern] ?? "インプット先行",
  };
};