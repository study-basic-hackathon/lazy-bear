import { SelectProps } from "../../../types/view/atoms/select";

export default function Select<T extends string>({
  value,
  options,
  onChange,
  className = "",
  style = {},
}: SelectProps<T>) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as T)}
      className={`border rounded-md p-2 w-full ${className}`}
      style={style}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}