interface TextProps {
  children: React.ReactNode;
  className?: string;
}

export default function Text({
  children,
  className = "text-[20px] font-semibold text-black",
}: TextProps) {
  return <p className={className}>{children}</p>;
}
