import Label from "../atoms/Label";
import Input from "../atoms/Input";

type HoursFieldProps = {
  label: string;
  value: number;
  onChange: (value: number) => void;
  error?: string;
};

export default function HoursField({
  label,
  value,
  onChange,
  error,
}: HoursFieldProps) {
  return (
    <div>
      <Label text={label} />
      <div className="flex items-center gap-2">
        <Input
          type="number"
          value={value}
          onChange={(e) => {
            const num = Number(e.target.value);
            onChange(isNaN(num) ? 0 : num);
          }}
          placeholder="例: 2"
        />
        <span className="text-stone-950">時間</span>
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
