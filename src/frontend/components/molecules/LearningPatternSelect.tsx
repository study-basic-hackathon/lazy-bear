import Label from "@/frontend/components/atoms/Label";
import Select from "@/frontend/components/atoms/Select";
import type { PersonaCreateViewModel } from "@/frontend/types/viewModel/persona";
import { learningPatternOptions } from "@/frontend/types/viewModel/persona";

interface LearningPatternSelectProps {
  value: PersonaCreateViewModel["learningPattern"];
  onChange:(value: PersonaCreateViewModel["learningPattern"]) => void;
  error: string | null;
};

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
        options={learningPatternOptions}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
