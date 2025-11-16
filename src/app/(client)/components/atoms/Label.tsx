import { LabelProps } from "../../../types/view/atoms/label";

export default function Label({
  text,
  className = "",
  style = {},
}: LabelProps) {
  return (
    <label
      className={`block text-sm font-medium text-gray-700 mb-3 ${className}`}
      style={style}
    >
      {text}
    </label>
  );
}
