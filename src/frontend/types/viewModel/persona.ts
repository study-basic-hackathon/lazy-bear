export interface PersonaCreateViewModel {
  weekdayHours: string | "",
  weekendHours: string | "",
  learningPattern: "インプット先行" | "アウトプット先行"
};

export const learningPatternMap = {
  "インプット先行": "インプット先行パターン",
  "アウトプット先行": "アウトプット先行パターン",
} as const;

type UiLearningPattern = keyof typeof learningPatternMap;
type ApiLearningPattern = (typeof learningPatternMap)[UiLearningPattern];

export const reverseLearningPatternMap = Object.fromEntries(
  Object.entries(learningPatternMap).map(([ui, api]) => [api, ui])
) as Record<ApiLearningPattern, UiLearningPattern>;

export const learningPatternOptions = (
  Object.keys(learningPatternMap) as UiLearningPattern[]
).map((label) => ({ label, value: label }));

