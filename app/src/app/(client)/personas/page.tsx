"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import PersonaCreateTemplate from "../components/templates/PersonaCreateTemplate";
import type { PersonaCreateViewModel } from "@/types/viewModel/persona";
import { toApiModel, toViewModel } from "../convertType/persona";
import type { ApiError } from "@/types/api/error.ts"

export default function PersonaCreatePage() {
  const router = useRouter();
  const [form, setForm] = useState<PersonaCreateViewModel>(
    toViewModel({
      weekdayHours: 1,
      weekendHours: 1,
      learningPattern: "インプット先行パターン",
    })
  );
    const handleChange = (partial: Partial<PersonaCreateViewModel>) => {
    setForm((prev) => ({
      ...prev,
      ...partial,
      errors: { ...prev.errors, ...(partial.errors ?? {}) },
    }));
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

    const postPersona = async (payload: ReturnType<typeof toApiModel>) => {
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
      if (!form.learningPattern) {
        handleChange({
          errors: { learningPattern: "学習パターンを選択してください" },
        });
        return;
      }
      if (Number(form.weekdayHours) === 0 && Number(form.weekendHours) === 0) {
        handleChange({
          errors: { hours: "平日または休日の勉強時間を入力してください" },
        });
        return;
      }
      const data = await postPersona(toApiModel(form));
      router.push(`/personas/${data.personas.personaId}/projects`);
    } catch (e: unknown) {
      const err = handleApiError(e);
      console.error(`エラー (${err.code}): ${err.message}`);
    }
  };

  return (
    <PersonaCreateTemplate
      form={form}
      onChange={handleChange}
      onSubmit={handleSubmit}
    />
  );
}

