import PersonaForm from "@/frontend/components/organisms/PersonaForm";
import type { PersonaCreateViewModel } from "@/frontend/types/viewModel/persona";
import type { PersonaFormErrors } from "@/frontend/types/api/persona";

interface PersonaCreateTemplateProps {
  form: PersonaCreateViewModel;
  errors: PersonaFormErrors;
  onChange: (partial: Partial<PersonaCreateViewModel>) => void;
  onSubmit: () => void;
};

export default function PersonaCreateTemplate({
  form,
  errors,
  onChange,
  onSubmit,
}: PersonaCreateTemplateProps) {
  return (
    <div className="relative min-h-screen min-w-screen bg-[#EBEEF1] flex justify-center items-center">
      <div className="relative bg-white w-[335px] h-[752px] mt-[30px]">
        <div className="relative grid mx-auto w-[295px] h-[682px] mt-[70px]">
          <PersonaForm
            form={form}
            errors={errors}
            onChange={onChange}
            onSubmit={onSubmit}
          />
        </div>
      </div>
    </div>
  );
}
