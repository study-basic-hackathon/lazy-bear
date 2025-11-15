"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import PersonaCreateTemplate from "../components/templates/PersonaCreateTemplate";
import { components } from "@/types/apiSchema";

type PersonaCreate = components["schemas"]["PersonaCreate"];

type ApiError = {
  code: string;
  message: string;
  details?: unknown;
};

export default function PersonaCreatePage() {
  const router = useRouter();
  const [form, setForm] = useState<PersonaCreate>({
    weekdayHours: 1,
    weekendHours: 1,
    learningPattern: "インプット先行パターン",
  });
  const [errors, setErrors] = useState<{ learningPattern?: string; hours?: string }>({});

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

  const postPersona = async (payload: PersonaCreate) => {
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
      setErrors({});
      if (!form.learningPattern) {
        setErrors({ learningPattern: "学習パターンを選択してください" });
        return;
      }
      if (form.weekdayHours === 0 && form.weekendHours === 0) {
        setErrors({ hours: "平日または休日の勉強時間を入力してください" });
        return;
      }
      const data = await postPersona(form);
      router.push(`/personas/${data.personas.personaId}/projects`);
    } catch (e: unknown) {
      const err = handleApiError(e);
      console.error(`エラーが発生しました (${err.code}): ${err.message}`);
      throw err;
    }
  };

  return (
    <PersonaCreateTemplate
      form={form}
      errors={errors}
      onChange={setForm}
      onSubmit={handleSubmit}
    />
  );
}

