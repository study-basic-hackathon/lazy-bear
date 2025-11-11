import Label from "../atoms/Label";
import Select from "../atoms/Select";

type LearningPattern = "インプット先行パターン" | "アウトプット先行パターン";

type LearningPatternSelectProps = {
  value: LearningPattern;
  onChange: (value: LearningPattern) => void;
  error?: string;
};

export default function LearningPatternSelect({
  value,
  onChange,
  error,
}: LearningPatternSelectProps) {
  const options: { value: LearningPattern; label: string }[] = [
    { value: "インプット先行パターン", label: "インプット先行" },
    { value: "アウトプット先行パターン", label: "アウトプット先行" },
  ];

  return (
    <div>
      <Label text="好きな学習パターンを選択してください" />
      <Select
        value={value}
        onChange={onChange}
        options={options}
        placeholder="選択してください"
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
