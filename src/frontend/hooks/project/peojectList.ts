import { useState, useEffect } from "react";
import type { ProjectListViewModel } from "../../types/viewModel/project";
import { convertToViewModel } from "@/frontend/convert/project";
import { getProjectList } from "../../api/project";

interface UseProjectList {
  projects: ProjectListViewModel[];
  apiError: string | null;
}

export const useProjectList = (personaId: string): UseProjectList => {
  const [apiError, setApiError] = useState<string | null>(null);
  const [projects, setProjects] = useState<ProjectListViewModel[]>([]);
  useEffect(() => {
    async function fetchProjects(personaId: string) {
      const result = await getProjectList(personaId);

      if (!result.success) {
        setApiError(result.error.message);
        return;
      }
      const projects = convertToViewModel(result.value);
      setProjects(projects);
  }
  fetchProjects(personaId);
  }, [personaId]);
  return { projects, apiError };
}