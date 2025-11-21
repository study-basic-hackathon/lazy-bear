import { HoursFieldProps } from "@/types/view/molecules/hoursField";
import Label from "../atoms/Label";
import Input from "../atoms/Input";

export default function HoursField({
  label,
  value,
  onChange,
  error,
  className = "",
  style = {},
}: HoursFieldProps) {
  return (
    <div className={className} style={style}>
      <Label text={label} />
      <div className="flex items-center gap-2">
        <Input
          type="text"
          value={value}
          onChange={(e) => {onChange(e.target.value);}}
          placeholder="例: 2"
        />
        <span className="text-stone-950">時間</span>
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}