import type { WeightCreateApiDto, WeightFormError } from "../types/api/weight";
import type { WeightCreateVM } from "../types/viewModel/weight";
import { Result } from "../utils/Result";
import { success, fail } from "../utils/Result";

export const toWeightCreateApiDto = (
  vm: WeightCreateVM[]
): Result<WeightCreateApiDto[], WeightFormError> => {
  const error: WeightFormError = { message: null };

  const hasEmptyArea = vm.some((w) => w.area.trim() === "");
  if (hasEmptyArea) {
    error.message = "対象分野を入力してください";
    return fail(error);
  }

  const total = vm.reduce((sum, w) => sum + Number(w.weightPercent), 0);
  const diff = total - 100;

  if (diff > 0) {
    error.message = `配点割合の合計が100%を超えています（+${diff}%）`;
    return fail(error);
  }
  if (diff < 0) {
    error.message = `配点割合の合計が100%に不足しています（${diff}%）`;
    return fail(error);
  }

  return success(
    vm.map((vm) => ({
      area: vm.area,
      weightPercent: Number(vm.weightPercent),
    }))
  );
};

export const toWeightCreateVM = (
  dto: WeightCreateApiDto[]
): WeightCreateVM[] => {
  return dto.map((dto) => ({
    area: dto.area,
    weightPercent: String(dto.weightPercent),
    })
  );
}
