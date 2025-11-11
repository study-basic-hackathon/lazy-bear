"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import PersonaCreateTemplate from "../components/templates/PersonaCreateTemplate";
import { components } from "@/types/apiSchema";

type PersonaCreate = components["schemas"]["PersonaCreate"];

export default function PersonaCreatePage() {
  const router = useRouter();
  const [form, setForm] = useState<PersonaCreate>({
    weekdayHours: 1,
    weekendHours: 1,
    learningPattern: "インプット先行パターン",
  });
  const [errors, setErrors] = useState<{ learningPattern?: string; hours?: string }>({});

  const handleSubmit = async () => {
    if (!form.learningPattern) {
      setErrors({ learningPattern: "学習パターンを選択してください" });
      return;
    }
    if (form.weekdayHours === 0 && form.weekendHours === 0) {
      setErrors({ hours: "平日または休日の勉強時間を入力してください" });
      return;
    }

    const payload: PersonaCreate = {...form};

    const res = await fetch(`/api/personas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    router.push(`/personas/${data.personas.personaId}/projects`);
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
