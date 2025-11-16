import { PersonaCreateTemplateProps } from "../../../types/view/organisms/persona";
import PersonaForm from "../organisms/PersonaForm";

export default function PersonaCreateTemplate({
  form,
  onChange,
  onSubmit,
}: PersonaCreateTemplateProps) {
  return (
    <div className="relative min-h-screen min-w-screen bg-[#EBEEF1] flex justify-center items-center">
      <div
        className="relative bg-white w-[335px] h-[752px] mt-[30px]"
      >
        <div className="relative grid mx-auto w-[295px] h-[682px] mt-[70px]">
          <PersonaForm
            form={form}
            onChange={onChange}
            onSubmit={onSubmit}
          />
        </div>
      </div>
    </div>
  );
}
