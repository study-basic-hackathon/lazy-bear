export type HoursFieldProps = {
  label: string;
  value: number | "";
  onChange: (value: number | "") => void;
  error?: string;
  className?: string;
  style?: React.CSSProperties;
};
