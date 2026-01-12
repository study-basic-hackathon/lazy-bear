export interface ProjectListViewModel {
  projectId: string;
  certificationName: string;
  examDate: string;
}

export interface ProjectCreateViewModel {
  certificationName: string | "";
  startDate: string | "";
  examDate: string | "";
  baseMaterial: "教科書ベース" | "動画ベース";
}

export const baseMaterialMap = {
  "教科書ベース": "TEXTBOOK",
  "動画ベース": "VIDEO",
} as const;

type UiBaseMaterial = keyof typeof baseMaterialMap;
type ApiBaseMaterial = (typeof baseMaterialMap)[UiBaseMaterial];

export const reversebaseMaterialMap = Object.fromEntries(
  Object.entries(baseMaterialMap).map(([ui, api]) => [api, ui])
) as Record<ApiBaseMaterial, UiBaseMaterial>;

export const baseMaterialOptions = (
  Object.keys(baseMaterialMap) as UiBaseMaterial[]
).map((label) => ({ label, value: label }));