import type { ProjectApiDto, ProjectCreateApiDto, ProjectFormErrors } from "@/frontend/types/api/project";
import type { ProjectListViewModel, ProjectCreateViewModel } from "@/frontend/types/viewModel/project";
import type { Result } from "@/frontend/utils/Result";
import { success, fail } from "@/frontend/utils/Result";
import { baseMaterialMap } from "@/frontend/types/viewModel/project";

export const convertProjectCreateVM = (
  vm: ProjectCreateViewModel
): Result<ProjectCreateApiDto, ProjectFormErrors> => {
  const errors: ProjectFormErrors = {
    certificationName: { message: null },
    startDate: { message: null },
    examDate: { message: null },
    baseMaterial: { message: null },
  };

  if (!vm.certificationName) {
    errors.certificationName.message = "資格名を入力してください";
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const oneWeekLater = new Date(today);
  oneWeekLater.setDate(today.getDate() + 7);

  const startDate = new Date(vm.startDate);
  const examDate = new Date(vm.examDate)

  if (Number.isNaN(startDate.getTime()) || startDate < today ) {
    errors.startDate.message = "開始日は本日以降の日付を入力してください";
  }

  if (Number.isNaN(examDate.getTime()) || examDate < oneWeekLater ) {
    errors.examDate.message = "試験日は本日から1週間以降の日付を入力してください";
  }

  if (!vm.baseMaterial) {
    errors.baseMaterial.message = "学習媒体を選択してください";
  }

  if (
    errors.certificationName.message ||
    errors.startDate.message ||
    errors.examDate.message ||
    errors.baseMaterial.message
  ) {
    return fail(errors);
  }

  return success({
    certificationName: vm.certificationName,
    startDate: String(startDate),
    examDate: String(examDate),
    baseMaterial: baseMaterialMap[vm.baseMaterial],
  });
};

export const convertToViewModel = (
  dto: ProjectApiDto[]
): ProjectListViewModel[] => {
  if (dto.length === 0) {
    return [];
  }
  return dto.map((dto) => ({
    projectId:dto.projectId,
    certificationName: dto.certificationName,
    examDate: new Date(dto.examDate).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })})
  )
};