interface DateProps {
  value: string;
  className?: string;
}

export default function DateText({
  value,
  className = "text-gray-700 text-xs",
}: DateProps) {
  return (
    <span className={`inline-block px-2 py-1 rounded-full bg-[#EBEEF1] ${className}`}>
      {value}
    </span>
  );
}