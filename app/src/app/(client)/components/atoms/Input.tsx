import { InputHTMLAttributes } from "react";

/**
 * Atomic Designのatom層においては、
 * ロジックや制御を持たず、propsをそのまま通す。
 */
type InputProps = InputHTMLAttributes<HTMLInputElement>;

export default function Input(props: InputProps) {
  return (
    <input
      {...props}
      className="border border-[#EBEEF1] p-2 placeholder-[#A8A5AF] w-4/5"
      style={{ backgroundColor: "#EFF0F4", color: "#000000" }}
    />
  );
}
