import Image from "next/image";

interface PlusButtonProps {
  size?: number;
  onClick?: () => void;
}

export default function PlusButton(
  { onClick, size = 45}: PlusButtonProps
) {
  return (
    <Image
      src="/getProjects/plusButton.svg"
      alt="Add"
      width={size}
      height={size}
      className="cursor-pointer hover:opacity-80"
      onClick={onClick}
    />
  );
}
