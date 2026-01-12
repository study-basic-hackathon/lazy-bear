import { useState } from "react";
import type { PersonaCreateViewModel } from "@/frontend/types/viewModel/persona";
import type { PersonaFormErrors } from "@/frontend/types/api/persona";

export function usePersonaForm() {
  const [form, setForm] = useState<PersonaCreateViewModel>({
    weekdayHours: "1",
    weekendHours: "1",
    learningPattern: "インプット先行",
  });

  const [errors, setErrors] = useState<PersonaFormErrors>({
    weekdayHours: { message: null },
    weekendHours: { message: null },
    learningPattern: { message: null },
  });

  const [apiError, setApiError] = useState<string | null>(null);

  const resetErrors = () => {
    setErrors({
      weekdayHours: { message: null },
      weekendHours: { message: null },
      learningPattern: { message: null },
    });
  };

  const handleChange = (partial: Partial<PersonaCreateViewModel>) => {
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
  };
}
