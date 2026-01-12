import { useState } from "react";
import type { ProjectCreateViewModel } from "@/frontend/types/viewModel/project";
import type { ProjectFormErrors } from "@/frontend/types/api/project";

export const useProjectForm = () => {
  const [form, setForm] = useState<ProjectCreateViewModel>({
    certificationName: "",
    startDate: "",
    examDate: "",
    baseMaterial: "教科書ベース",
  });

  const [errors, setErrors] = useState<ProjectFormErrors>({
    certificationName: { message: null },
    startDate: { message: null },
    examDate: { message: null },
    baseMaterial: { message: null },
  });

  const [apiError, setApiError] = useState<string | null>(null)

  const resetErrors = () => {
    setErrors({
      certificationName: { message: null },
      startDate: { message: null },
      examDate: { message: null },
      baseMaterial: { message: null },
    });
  };

  const handleChange = (partial: Partial<ProjectCreateViewModel>) => {
    setForm((prev) => ({ ...prev, ...partial }));
  };
  return {
    form,
    errors,
    apiError,
    setErrors,
    setApiError,
    resetErrors,
    handleChange,
  }
}