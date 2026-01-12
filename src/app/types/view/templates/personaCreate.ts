import type { PersonaCreateViewModel } from "@/types/viewModel/personaCreate";
import type { PersonaCreateErrors } from "@/types/viewModel/personaCreate";

export type PersonaCreateTemplateProps = {
  form: PersonaCreateViewModel;
  errors: PersonaCreateErrors;
  onChange: (partial: Partial<PersonaCreateViewModel>) => void;
  onSubmit: () => void;
};