"use client";
import { useRouter } from "next/navigation";
import PersonaCreateTemplate from "@/frontend/components/templates/PersonaCreateTemplate";
import { convertToApi } from "@/frontend/converts/persona";
import { handleApiResult } from "@/frontend/utils/handleApiResult";
import { postPersona } from "@/frontend/api/persona";
import { usePersonaForm } from "@/frontend/hooks/persona/personaCreate";

export default function PersonaCreatePage() {
  const router = useRouter();
  const {
    form,
    errors,
    apiError,
    setErrors,
    setApiError,
    resetErrors,
    handleChange,
  } = usePersonaForm()

  const handleSubmit = async () => {
    resetErrors();

    const result = convertToApi(form);
    if (result.success) {
      handleApiResult(
        await postPersona(result.value),
        (id) => router.push(`/personas/${id}/projects`),
        (error) => setApiError(error.message)
      );
    } else {
    setErrors(result.error);
    }
  }

  return (
    <div>
      {apiError && (
        <div
          className="mb-4 w-full rounded bg-red-50 border border-red-300 px-4 py-3 text-red-800"
          role="alert"
        >
          {apiError}
        </div>
      )}
      <PersonaCreateTemplate
        form={form}
        errors={errors}
        onChange={handleChange}
        onSubmit={handleSubmit}
      />
    </div>
  );
};
