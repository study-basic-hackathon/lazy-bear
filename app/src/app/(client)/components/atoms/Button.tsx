/**
 * Atomic Designのatom層においては、
 * ロジックや制御を持たず、propsをそのまま通す。
 */
type ButtonProps = { label: string; };

export default function Button({ label }: ButtonProps) {
  return (
    <button
      type="submit"
      className="font-semibold transition absolute left-1/2 transform -translate-x-1/2"
      style={{
        width: "226px",
        height: "60px",
        borderRadius: "0px",
        backgroundColor: "#3C436D",
        color: "#FFFFFF",
        top: "611px",
      }}
    >
      {label}
    </button>
  );
}