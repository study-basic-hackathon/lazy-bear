import { ButtonProps } from "../../../types/view/atoms/button";

export default function Button({
  className = "",
  style = {},
  label,
  onClick,
  type,
}: ButtonProps) {
  return (
    <button
      type={type}
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
