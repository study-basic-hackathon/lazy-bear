import { PersonaFormProps } from "@/types/view/organisms/persona";
import HoursField from "../molecules/HoursField";
import LearningPatternSelect from "../molecules/LearningPatternSelect";
import Button from "../atoms/Button";

export default function PersonaForm({
  form,
  onChange,
  onSubmit,
}: PersonaFormProps) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <div className="flex flex-col gap-6">
        <HoursField
          label="平日の勉強時間"
          value={form.weekdayHours}
          onChange={(v) => onChange({ weekdayHours: v })}
          error={form.errors.hours}
        />

        <HoursField
          label="休日の勉強時間"
          value={form.weekendHours}
          onChange={(v) => onChange({ weekendHours: v })}
          error={form.errors.hours}
        />

        <LearningPatternSelect
          value={form.learningPattern}
          onChange={(v) => onChange({ learningPattern: v })}
          error={form.errors.learningPattern}
        />
      </div>

      <Button
        className="absolute left-1/2 -translate-x-1/2 top-[75%]"
        label="決定"
        type="submit"
      />
    </form>
  );
}

