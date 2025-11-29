import type { PersonaCreateErrors } from "@/types/viewModel/personaCreate";
import type { PersonaCreateApiDto } from "@/types/viewModel/personaCreate";

export type Result<T, E> =
  | { ok: true; value: T }
  | { ok: false; error: E };

export function convertHoursField(
  raw: string
): Result<string, PersonaCreateErrors["weekdayHours"] | PersonaCreateErrors["weekendHours"]> {
  const trimmed = raw.trim();

  if (trimmed === "") {
    return { ok: false, error: "1時間以上入力してください" };
  }

  const hours = Number(trimmed);

  if (!Number.isFinite(hours) || hours < 0) {
    return { ok: false, error: "無効な入力値です" };
  }

  if (hours === 0) {
    return { ok: false, error: "1時間以上入力してください" };
  }

  return { ok: true, value: trimmed };
}

export function convertLearningPattern(
  raw: PersonaCreateApiDto["learningPattern"] | null
): Result<PersonaCreateApiDto["learningPattern"], PersonaCreateErrors["learningPattern"]> {
  if (!raw) {
    return { ok: false, error: "学習パターンを選択してください" };
  }
  return { ok: true, value: raw };
}



