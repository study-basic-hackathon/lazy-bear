import type { StepCreateApiDto, StepFormError } from "../types/api/step";
import type { StepCreateVM } from "../types/viewModel/step";
import { fail, success, Result } from "../utils/Result";

export const toStepCreateApiDto = (
  vm: StepCreateVM[]
): Result<StepCreateApiDto[], StepFormError> => {

  if (vm.some(s => s.title.trim() === "")) {
    return fail({ message: "タイトルを入力してください" });
  }

  if (vm.length < 3) {
    return fail({ message: "ステップは3件以上登録してください" });
  }

  return success(
    vm.map(s => ({
      title: s.title,
      theme: s.theme,
      index: s.index,
    }))
  );
};

export const toStepCreateVM = (
  dto: StepCreateApiDto[]
): StepCreateVM[] => {
  return dto.map((dto) => ({
    title: dto.title,
    theme: dto.theme,
    index: dto.index,
    })
  );
}
