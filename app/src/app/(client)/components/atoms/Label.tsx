/**
 * Atomic Designのatom層においては、
 * ロジックや制御を持たず、propsをそのまま通す。
 */
type LabelProps = { text: string; };

export default function Label({ text }: LabelProps) {
  return (
    <label className="block text-sm font-medium text-gray-700 mb-3">
      {text}
    </label>
  );
}
