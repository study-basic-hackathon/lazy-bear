"use client";

import Image from "next/image";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { components } from "@/types/apiSchema";
import { M_PLUS_1p } from "next/font/google";

type StepCreate = components["schemas"]["StepCreate"];

const mplus = M_PLUS_1p({
  subsets: ["latin"],
  weight: ["400", "500", "700"]
});

export default function StepsPostPage() {
  const params = useParams<{ id: string }>();
  const projectId = params.id;
  const router = useRouter();

  // モックデータ
  const [steps, setSteps] = useState<StepCreate[]>([
    { index: 0, title: "準備ステップ", theme: "環境を整える" },
    { index: 1, title: "学習ステップ", theme: "教科書を読む" },
    { index: 2, title: "演習ステップ", theme: "問題を解く" },
  ]);

  const [error, setError] = useState<string>("");
  const [expanded, setExpanded] = useState<boolean[]>(steps.map(() => false));
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);

  // 削除
  const handleDelete = (index: number) => {
    const updated = steps.filter((_, i) => i !== index);
    setSteps(updated.map((s, i) => ({ ...s, index: i })));
    setExpanded(expanded.filter((_, i) => i !== index));
  };

  // 追加
  const handleAdd = () => {
    setSteps([...steps, { index: steps.length, title: "", theme: "" }]);
    setExpanded([...expanded, false]);
  };

  // ドラッグ
  const handleDragStart = (index: number) => setDraggingIndex(index);
  const handleDrop = (index: number) => {
    if (draggingIndex === null) return;
    const reordered = [...steps];
    const [removed] = reordered.splice(draggingIndex, 1);
    reordered.splice(index, 0, removed);
    setSteps(reordered.map((s, i) => ({ ...s, index: i })));

    const expReordered = [...expanded];
    const [expRemoved] = expReordered.splice(draggingIndex, 1);
    expReordered.splice(index, 0, expRemoved);
    setExpanded(expReordered);

    setDraggingIndex(null);
  };

  // 値変更
  const handleChange = (index: number, field: keyof StepCreate, value: string) => {
    const updated = [...steps];
    if (field === "index") {
      updated[index][field] = Number(value) as StepCreate[typeof field];
    } else {
      updated[index][field] = value as StepCreate[typeof field];
    }
    setSteps(updated);
  };

  // 折り畳み
  const toggleExpand = (index: number) => {
    const updated = [...expanded];
    updated[index] = !updated[index];
    setExpanded(updated);
  };

  // 保存
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (steps.some((s) => s.title.trim() === "" || s.theme.trim() === "")) {
      setError("タイトルと説明を入力してください");
      return;
    }
    setError("");

    try {
      await fetch(`/api/project/${projectId}/steps`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(steps),
      });

      await fetch(`/api/project/${projectId}/tasks/generate`, { method: "POST" });

      router.push(`/project/${projectId}/created-success`);
    } catch (err) {
      console.error("保存または生成エラー:", err);
      setError("保存または生成に失敗しました");
    }
  };

  return (
    <div className={`min-h-screen min-w-screen bg-[#EBEEF1] flex justify-center ${mplus.className} text-gray-950`}>
      <div
        className="p-6 bg-white relative"
        style={{ width: "335px", height: "752px", marginTop: "30px" }}
      >
        <form
          onSubmit={handleSubmit}
          className="grid"
          style={{ width: "295px", rowGap: "24px", marginTop: "30px" }}
        >
          {/* row1 */}
          <div className="text-center font-medium">
            スケジュール生成のために<br />ステップを編集してください
          </div>

          {/* row2 */}
          <div
            className="grid"
            style={{ gridTemplateRows: "auto auto", rowGap: "8px", borderRadius: "0px", height: "344px" }}
          >
            <div className="grid grid-cols-1 font-semibold text-center border-b">
              <div>ステップタイトルと説明</div>
            </div>

            <div style={{ overflowY: "auto", height: "calc(344px - 24px)" }}>
              {steps.map((s, index) => (
                <div
                  key={s.index}
                  className="p-2"
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => handleDrop(index)}
                >
                  <div className="flex items-center gap-2">
                    {/* ドラッグボタン */}
                    <span className="cursor-grab" style={{ minWidth: "24px" }}>≡</span>
                    {/* 折り畳みボタン */}
                    <button
                      type="button"
                      onClick={() => toggleExpand(index)}
                      className="text-gray-950"
                      style={{ minWidth: "24px" }}
                    >
                      {expanded[index] ? "▼" : "▽"}
                    </button>
                    <input
                      type="text"
                      value={s.title}
                      onChange={(e) => handleChange(index, "title", e.target.value)}
                      placeholder="タイトル"
                      className="p-2 border"
                      style={{ borderRadius: "0px", width: "176px" }}
                    />
                    {/* ゴミ箱 */}
                    <div style={{ minWidth: "24px", marginLeft: "4px" }}>
                      {steps.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleDelete(index)}
                          className="text-red-500 font-bold"
                          style={{ minWidth: "24px" }}
                        >
                          <Image
                            src="/createWeights/trashBox.svg"
                            alt="delete Step"
                            width={24}
                            height={24}
                            className="cursor-pointer hover:opacity-80"
                          />
                        </button>
                      )}
                    </div>
                  </div>

                  {expanded[index] && (
                    <div className="mt-2">
                      <textarea
                        value={s.theme}
                        onChange={(e) => handleChange(index, "theme", e.target.value)}
                        placeholder="説明"
                        className="p-2 border"
                        style={{
                          borderRadius: "0px",
                          width: "280px",
                          whiteSpace: "pre-wrap",
                          wordWrap: "break-word",
                        }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* row3 */}
          <div className="flex justify-center">
            <button type="button" onClick={handleAdd} className="font-semibold" style={{ borderRadius: "0px" }}>
              <Image
                src="/createWeights/plusButton.svg"
                alt="Add Step"
                width={45}
                height={45}
                className="cursor-pointer hover:opacity-80"
              />
            </button>
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

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
            決定
          </button>
        </form>
      </div>
    </div>
  );
}