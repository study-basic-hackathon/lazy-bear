"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import PersonaCreateTemplate from "../components/templates/PersonaCreateTemplate";
import { apiToViewModel, viewModelToApi } from "../converts/types/persona";
import { convertHoursField, convertLearningPattern } from "../converts/personaCreate";
import type { PersonaCreateViewModel, PersonaCreateErrors } from "@/types/viewModel/personaCreate";
import type { ApiError } from "@/types/api/error";

export default function PersonaCreatePage() {
  const router = useRouter();
  const [errors, setErrors] = useState<PersonaCreateErrors>({
    weekdayHours: null,
    weekendHours: null,
    learningPattern: null,
  });
  const [form, setForm] = useState<PersonaCreateViewModel>(
    apiToViewModel({
      weekdayHours: 1,
      weekendHours: 1,
      learningPattern: "インプット先行パターン",
    })
  );
  const handleChange = (partial: Partial<PersonaCreateViewModel>) => {
    setForm((prev) => ({...prev, ...partial,}));
  };
  const handleApiError = (e: unknown): ApiError => {
    if (e instanceof TypeError && e.message.includes("fetch")) {
      return {
        code: "NETWORK_ERROR",
        message: "ネットワーク接続に問題があります。再試行してください。",
      };
    }
    if ((e as ApiError)?.code) return e as ApiError;
    return {
      code: "UNKNOWN_ERROR",
      message: "予期しないエラーが発生しました。",
      details: e,
    };
  };

  const postPersona = async (payload: ReturnType<typeof viewModelToApi>) => {
    const res = await fetch(`/api/personas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const errorBody = (await res.json().catch(() => null)) || {};
      throw {
        code: errorBody.code || `HTTP_${res.status}`,
        message:
          errorBody.message ||
          `Unexpected response: ${res.status} ${res.statusText}`,
        details: errorBody.details,
      } satisfies ApiError;
    }
    return res.json();
  };

  const handleSubmit = async () => {
    try {
      setErrors({
        weekdayHours: null,
        weekendHours: null,
        learningPattern: null,
      });
      const learningPattern = convertLearningPattern(form.learningPattern);
      const weekdayHours = convertHoursField(form.weekdayHours);
      const weekendHours = convertHoursField(form.weekendHours);

      const nextErrors: PersonaCreateErrors = {
        weekdayHours: weekdayHours.error,
        weekendHours: weekendHours.error,
        learningPattern: learningPattern.error,
      };

      function hasError(errors: PersonaCreateErrors): boolean {
        return Object.values(errors).some(error => error !== null);
      }

      if (hasError(nextErrors)) {
        setErrors(nextErrors);
        return;
      }
      const data = await postPersona(viewModelToApi(form));
      router.push(`/personas/${data.personas.personaId}/projects`);
    } catch (e: unknown) {
      const err = handleApiError(e);
      console.error(`エラー (${err.code}): ${err.message}`);
    }
  };

  return (
    <PersonaCreateTemplate
      form={form}
      errors={errors}
      onChange={handleChange}
      onSubmit={handleSubmit}
    />
  );
}

