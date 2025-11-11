import { components } from "@/types/apiSchema";
import PersonaForm from "../organisms/PersonaForm";

type PersonaCreate = components["schemas"]["PersonaCreate"];

type PersonaCreateTemplateProps = {
  form: PersonaCreate;
  errors: {
    learningPattern?: string;
    hours?: string;
  };
  onChange: React.Dispatch<React.SetStateAction<PersonaCreate>>;
  onSubmit: () => void;
};

export default function PersonaCreateTemplate({
  form,
  errors,
  onChange,
  onSubmit,
}: PersonaCreateTemplateProps) {
  return (
    <div className="min-h-screen min-w-screen bg-[#EBEEF1] flex justify-center">
      <div className="p-6 bg-white" style={{ width: "335px", height: "752px", marginTop: "30px" }}>
        <PersonaForm form={form} errors={errors} onChange={onChange} onSubmit={onSubmit} />
      </div>
    </div>
  );
}