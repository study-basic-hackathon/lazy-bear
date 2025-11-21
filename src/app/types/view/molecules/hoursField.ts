import type { PersonaCreateErrors } from "@/types/viewModel/personaCreate";

export type HoursFieldProps = {
  label: string;
  value: string | "";
  onChange: (value: string | "") => void;
  error: PersonaCreateErrors["weekdayHours"] | PersonaCreateErrors["weekendHours"];
  className?: string;
  style?: React.CSSProperties;
};
