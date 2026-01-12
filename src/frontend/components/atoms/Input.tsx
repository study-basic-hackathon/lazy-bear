import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  style?: React.CSSProperties;
}

export default function Input({
  className = "",
  style = {},
  ...props
}: InputProps) {
  return (
    <input
      {...props}
      className={`border border-[#EBEEF1] p-2 placeholder-[#A8A5AF] w-4/5 ${className}`}
      style={{
        backgroundColor: "#EFF0F4",
        color: "#000000",
        ...style
      }}
    />
  );
}
