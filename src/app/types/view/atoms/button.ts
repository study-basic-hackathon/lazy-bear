export type ButtonProps = {
  className?: string;
  style?: React.CSSProperties;
  label: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
};