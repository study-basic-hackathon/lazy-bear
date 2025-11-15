/**
 * Atomic Designのatom層においては、
 * ロジックや制御を持たず、propsをそのまま通す。
 */
type ButtonProps = {
  className?: string;
  style?: React.CSSProperties;
  label: string;
  onClick?: () => void;
};

export default function Button({
  className = "",
  style = {},
  label,
  onClick,
}: ButtonProps) {
  return (
    <button
      type="submit"
      onClick={onClick}
      className={`font-semibold transition ${className}`}
      style={{
        width: "226px",
        height: "60px",
        borderRadius: "0px",
        backgroundColor: "#3C436D",
        color: "#FFFFFF",
        ...style,
      }}
    >
      {label}
    </button>
  );
}
