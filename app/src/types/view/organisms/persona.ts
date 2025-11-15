import type { PersonaCreateViewModel } from "@/types/viewModel/persona";

export type PersonaFormProps = {
  form: PersonaCreateViewModel;
  onChange: (partial: Partial<PersonaCreateViewModel>) => void;
  onSubmit: () => void;
};

export type PersonaCreateTemplateProps = {
  form: PersonaCreateViewModel;
  onChange: (partial: Partial<PersonaCreateViewModel>) => void;
  onSubmit: () => void;
};