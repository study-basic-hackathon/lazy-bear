/**
 * Atomic Designのatom層においては、
 * ロジックや制御を持たず、propsをそのまま通す。
 */
type Option<T extends string> = {
  label: string;
  value: T;
};

type SelectProps<T extends string> = {
  value: T;
  options: Option<T>[];
  onChange: (value: T) => void;
};

export default function Select<T extends string>({
  value,
  options,
  onChange,
}: SelectProps<T>) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as T)}
      className="border rounded-md p-2 w-full"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
