import Image from "next/image";

interface AvatarImageProps {
  size?: number;
};

export default function AvatarImage(
  { size = 52 }: AvatarImageProps) {
  return (
    <Image
      src="/getProjects/avatar.svg"
      alt="userIcon"
      width={size}
      height={size}
      className="rounded-full"
      loading="eager"
    />
  );
}

