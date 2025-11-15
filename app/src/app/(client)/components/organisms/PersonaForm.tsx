import HoursField from "../molecules/HoursField";
import Button from "../atoms/Button";
import LearningPatternSelect from "../molecules/LearningPatternSelect";
import { components } from "@/types/apiSchema";

type PersonaCreate = components["schemas"]["PersonaCreate"];

type PersonaFormProps = {
  form: PersonaCreate;
  errors: {
    learningPattern?: string;
    hours?: string;
  };
  onChange: React.Dispatch<React.SetStateAction<PersonaCreate>>;
  onSubmit: () => void;
};

export default function PersonaForm({
  form,
  errors,
  onChange,
  onSubmit,
}: PersonaFormProps) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="relative grid mx-auto"
      style={{ width: "295px", height: "423px", marginTop: "70px" }}
    >
      <div className="flex flex-col" style={{ gap: "24px" }}>
        <HoursField
          label="平日の勉強時間"
          value={form.weekdayHours}
          onChange={(v) => onChange((prev) => ({ ...prev, weekdayHours: v }))}
          error={errors.hours}
        />
        <HoursField
          label="休日の勉強時間"
          value={form.weekendHours}
          onChange={(v) => onChange((prev) => ({ ...prev, weekendHours: v }))}
          error={errors.hours}
        />
        <LearningPatternSelect
          value={form.learningPattern}
          onChange={(v) => onChange((prev) => ({ ...prev, learningPattern: v }))}
          error={errors.learningPattern}
        />
      </div>
      <Button
        className="absolute left-1/2 transform -translate-x-1/2"
        style={{ top: "581px" }}
        label="決定"
        onClick={onSubmit}
      />
    </form>
  );
}

