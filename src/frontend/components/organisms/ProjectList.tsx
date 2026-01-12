import Link from "next/link";
import ProjectCard from "@/frontend/components/molecules/ProjectCard";
import Text from "@/frontend/components/atoms/Text";
import type { ProjectListViewModel } from "@/frontend/types/viewModel/project";

interface ProjectListProps {
  projects: ProjectListViewModel[];
}

export default function ProjectList({ projects }: ProjectListProps) {
  if (projects.length === 0) {
    return <Text className="text-black">プロジェクトは登録されていません。</Text>;
  }

  return (
    <ul className="space-y-2">
      {projects.map((project) => (
        <li key={project.projectId}>
          <Link href={`/projects/${project.projectId}`}>
            <ProjectCard
              certificationName={project.certificationName}
              examDate={project.examDate}
            />
          </Link>
        </li>
      ))}
    </ul>
  );
}

