import Text from "@/frontend/components/atoms/Text";
import DateText from "@/frontend/components/atoms/DateText";

interface ProjectCardProps {
  certificationName: string;
  examDate: string;
}

export default function ProjectCard(
  { certificationName, examDate }: ProjectCardProps
) {
  return (
    <div className="p-4 rounded-lg border border-[#EBEEF1] shadow-sm bg-white hover:shadow-md w-[295px] h-[91px]">
      <Text>{certificationName}</Text>
      <DateText value={examDate} />
    </div>
  );
}