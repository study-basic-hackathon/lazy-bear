import { PersonaCreateErrors } from "@/types/viewModel/personaCreate";

export function convertHoursField(raw: string): {
  value: number | null;
  error: PersonaCreateErrors["weekdayHours"] | PersonaCreateErrors["weekendHours"];
} {
  const hours = Number(raw);

  if (raw.trim() === "" || hours === 0) {
    return { value: null, error: "1時間以上入力してください" };
  }

  if (!Number.isFinite(hours) || hours < 0) {
    return { value: null, error: "無効な入力値です" };
  }

  return { value: hours, error: null };
}

export function convertLearningPattern(value: string): {
  value: string | null;
  error: PersonaCreateErrors["learningPattern"];
} {
  if (!value) {
    return { value: null, error: "学習パターンを選択してください" };
  }
  return { value, error: null };
}

