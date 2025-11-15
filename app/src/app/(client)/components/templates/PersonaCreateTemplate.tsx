import { PersonaCreateTemplateProps } from "@/types/view/organisms/persona";
import PersonaForm from "../organisms/PersonaForm";

export default function PersonaCreateTemplate({
  form,
  onChange,
  onSubmit,
}: PersonaCreateTemplateProps) {
  return (
    <div className="relative min-h-screen min-w-screen bg-[#EBEEF1] flex justify-center items-center">
      <div
        className="relative bg-white"
        style={{ width: "335px", height: "752px", marginTop: "30px" }}
      >
        <PersonaForm
          form={form}
          onChange={onChange}
          onSubmit={onSubmit}
        />
      </div>
    </div>
  );
}
