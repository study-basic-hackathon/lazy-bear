"use client";
import { useParams } from "next/navigation";
import { useProjectList } from "@/frontend/hooks/project/peojectList";
import ProjectListTemplate from "@/frontend/components/templates/ProjectListTemplate";

export default function PersonaProjectsPage() {
  const params = useParams<{ personaId: string }>();
  const { personaId } = params;
  const {
    projects,
    apiError,
  } = useProjectList(personaId);

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
      <ProjectListTemplate
        personaId={personaId}
        projects={projects}
      />
    </div>
  );
}
