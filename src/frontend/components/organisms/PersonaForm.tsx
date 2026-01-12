import HoursField from "@/frontend/components/molecules/HoursField";
import LearningPatternSelect from "@/frontend/components/molecules/LearningPatternSelect";
import Button from "@/frontend/components/atoms/Button";
import type { PersonaCreateViewModel } from "@/frontend/types/viewModel/persona";
import type { PersonaFormErrors } from "@/frontend/types/api/persona";

interface PersonaFormProps {
  form: PersonaCreateViewModel;
  errors: PersonaFormErrors;
  onChange: (partial: Partial<PersonaCreateViewModel>) => void;
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
    >
      <div className="flex flex-col gap-6">
        <HoursField
          label="平日の勉強時間"
          value={form.weekdayHours}
          onChange={(v) => onChange({ weekdayHours: v })}
          error={errors.weekdayHours.message}
        />

        <HoursField
          label="休日の勉強時間"
          value={form.weekendHours}
          onChange={(v) => onChange({ weekendHours: v })}
          error={errors.weekendHours.message}
        />

        <LearningPatternSelect
          value={form.learningPattern}
          onChange={(v) => onChange({ learningPattern: v })}
          error={errors.learningPattern.message}
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

