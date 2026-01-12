interface LabelProps {
  text: string;
  className?: string;
  style?: React.CSSProperties;
};

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
