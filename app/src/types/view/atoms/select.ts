export type Option<T extends string> = {
  label: string;
  value: T;
};

export type SelectProps<T extends string> = {
  value: T;
  options: Option<T>[];
  onChange: (value: T) => void;
  className?: string;
  style?: React.CSSProperties;
};