import Link from "next/link";
import AvatarImage from "@/frontend/components/atoms/AvatarImage";

interface PersonaHeaderProps {
  personaId: string;
}

export default function PersonaHeader({ personaId }: PersonaHeaderProps) {
  return (
    <div className="flex justify-end">
      <Link href={`/personas/${personaId}`}>
        <AvatarImage />
      </Link>
    </div>
  );
}