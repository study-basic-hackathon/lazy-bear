import Label from "../atoms/Label";
import Select from "../atoms/Select";
import type { components } from "@/types/api/apiSchema";
import { LearningPatternSelectProps } from "@/types/view/molecules/learningPattern";

type PersonaCreate = components["schemas"]["PersonaCreate"];
type LearningPattern = PersonaCreate["learningPattern"];

const options: { value: LearningPattern; label: string }[] = [
  { value: "インプット先行パターン", label: "インプット先行" },
  { value: "アウトプット先行パターン", label: "アウトプット先行" },
];

export default function LearningPatternSelect({
  value,
  onChange,
  error,
}: LearningPatternSelectProps) {
  return (
    <div>
      <Label text="学習方法を教えてください" />
      <Select
        value={value}
        onChange={onChange}
        options={options}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
