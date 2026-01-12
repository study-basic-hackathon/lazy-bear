import ProjectHeader from "@/frontend/components/organisms/ProjectHeader";
import ProjectList from "@/frontend/components/organisms/ProjectList";
import  PlusButton from "@/frontend/components/atoms/PlusButton";
import Link from "next/link";
import type { ProjectListViewModel } from "@/frontend/types/viewModel/project";

interface ProjectListTemplateProps {
  personaId: string;
  projects: ProjectListViewModel[];
}

export default function ProjectListTemplate({
  personaId,
  projects,
}: ProjectListTemplateProps) {
  return (
    <div className="min-h-screen min-w-screen bg-[#EBEEF1] flex justify-center items-center">
      <div className="p-6 bg-white w-[335px] h-[752px] mt-[30px]">
        <ProjectHeader personaId={personaId} />
        <div className="grid gap-6">
          <ProjectList projects={projects} />
          <div className="flex justify-center">
            <Link href={`/personas/${personaId}/projects/new`}>
              <PlusButton />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}