"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { generateSteps, postSteps } from "@/frontend/api/step";
import { toStepCreateApiDto, toStepCreateVM } from "@/frontend/converts/step";
import type { StepFormError } from "@/frontend/types/api/step";
import type { StepCreateVM } from "@/frontend/types/viewModel/step";
import ApiError from "@/frontend/utils/ApiError";
import { generateTasks } from "@/frontend/api/task";

export default function StepsCreatePage() {
  const params = useParams<{
    personaId: string,
    projectId: string,
  }>();
  const { personaId, projectId } = params;
  const router = useRouter();
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const [steps, setSteps] = useState<StepCreateVM[]>([]);
  const [apiError, setApiError] = useState<ApiError | null>(null);
  const [error, setError] = useState<StepFormError | null>(null);

  useEffect(() => {
    const fetchSteps = async () => {
      const result = await generateSteps(projectId);
      if (!result.value) {
        setApiError(result.error);
        return;
      }
      setSteps(toStepCreateVM(result.value));
    };
    fetchSteps();
  }, [projectId]);

  const handleDelete = (index: number) => {
    const nextSteps = steps.filter((_, i) => i !== index);
    setSteps(nextSteps.map((s, i) => ({ ...s, index: i })));
  };

  const handleAdd = () => {
    setSteps([...steps, { index: steps.length, title: "", theme: "" }]);
  };

  const handleDrag = (fromIndex: number) => setDraggingIndex(fromIndex);
  const handleDrop = (toIndex: number) => {
    if (draggingIndex === null) return;

    const nextSteps = [...steps];
    const [dragItem] = nextSteps.splice(draggingIndex, 1);
    nextSteps.splice(toIndex, 0, dragItem);

    setSteps(nextSteps.map((s, i) => ({ ...s, index: i })));
    setDraggingIndex(null);
  };

  const handleChange = (index: number, field: keyof StepCreateVM, value: string) => {
    const nextSteps = [...steps];
    if (field === "index") {
      nextSteps[index][field] = Number(value);
    } else {
      nextSteps[index][field] = value;
    }
    setSteps(nextSteps);
  };

  const handleSubmit = async () => {
    setError(null);
    if (steps.some((s) => s.title.trim() === "")) {
      setError({ message: "タイトルを入力してください"});
      return;
    }
    const acceptedSteps = toStepCreateApiDto(steps);
    if (!acceptedSteps.success) {
      setError(acceptedSteps.error);
      return;
    }
    const stepResult = await postSteps(projectId, steps);
    if (!stepResult.success) {
      setApiError(stepResult.error);
      return;
    }

    const taskResult = await generateTasks(projectId);
    if (!taskResult.success) {
      setApiError(taskResult.error);
      return;
    }
    router.push(`/personas/${personaId}/projects/${projectId}/success`);
  };

  return (
    <div className={`min-h-screen min-w-screen bg-[#EBEEF1] flex justify-center text-gray-950`}>
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
            {/* ヘッダー */}
            <div className="grid font-semibold text-center border-b" style={{ gridTemplateColumns: "24px 24px 176px auto" }}>
              <div></div> {/* ドラッグ列 */}
              <div></div>
              <div>ステップ名</div>
              <div></div> {/* ゴミ箱列 */}
            </div>

            {/* ステップ一覧 */}
            <div style={{ overflowY: "auto", height: "calc(344px - 24px)" }}>
              {steps.map((s, index) => (
                <div
                  key={s.index}
                  className="p-2"
                  draggable
                  onDragStart={() => handleDrag(index)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => handleDrop(index)}
                >
                  <div className="grid items-center gap-2" style={{ gridTemplateColumns: "24px 24px 176px auto" }}>
                    {/* ドラッグボタン */}
                    <span className="cursor-grab text-center" style={{ minWidth: "24px" }}>≡</span>
                    {/* index 表示（UIは+1） */}
                    <span className="text-center" style={{ minWidth: "24px" }}>{s.index + 1}</span>
                    {/* タイトル */}
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

          {error && <p className="text-red-500 text-sm text-center">{error.message}</p>}

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