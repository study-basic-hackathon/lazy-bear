"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { components } from "@/types/apiSchema";

type ProjectCreate = components["schemas"]["ProjectCreate"];

type ProjectCreateForm = Omit<ProjectCreate, "baseMaterial"> & {
  baseMaterial: ProjectCreate["baseMaterial"] | undefined;
};

export default function ProjectCreatePage() {
  const params = useParams<{ id: string }>();
  const personaId = params.id;
  const router = useRouter();

  const [form, setForm] = useState<ProjectCreateForm>({
    certificationName: "",
    startDate: "",
    examDate: "",
    baseMaterial: undefined,
  });

  const [errors, setErrors] = useState<{ baseMaterial?: string; date?: string }>({});

  const handleChange = (field: keyof ProjectCreateForm, value: string | undefined) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [field]: undefined, // 入力があればエラーをクリア
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // バリデーション
    if (!form.baseMaterial) {
      setErrors({ baseMaterial: "学習媒体を選択してください" });
      return;
    }

    if (form.startDate && form.examDate) {
      const start = new Date(form.startDate);
      const exam = new Date(form.examDate);
      if (start >= exam) {
        setErrors({ date: "開始日は試験日より前である必要があります" });
        return;
      }
    }

    const payload: ProjectCreate = {
      ...form,
      baseMaterial: form.baseMaterial,
    };

    console.log("プロジェクト作成 payload:", payload);

    try {
      // 1. プロジェクト作成
      const res = await fetch(`/api/personas/${personaId}/projects`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("プロジェクト作成に失敗しました");

      // body から projectId を取得
      const json = await res.json();
      const projectId = json.project.projectId;

      // 2. 直接遷移（weights生成は遷移後に行う）
      router.push(`/projects/${projectId}/weights/post`);
    } catch (err) {
      console.error(err);
      alert("登録処理に失敗しました");
    }
  };

  return (
    <div className="min-h-screen min-w-screen bg-[#EBEEF1] flex justify-center">
      <div
        className="p-6 bg-white relative"
        style={{ width: "335px", height: "752px", marginTop: "30px" }}
      >
        {/* プロジェクト作成フォーム */}
        <form
          onSubmit={handleSubmit}
          className="grid"
          style={{
            width: "295px",
            height: "423px",
            rowGap: "24px",
            marginTop: "70px",
          }}
        >
          {/* フォーム入力欄（資格名, 開始日, 試験日, 学習方法） */}
          <div
            className="grid"
            style={{
              height: "100px",
              rowGap: "24px",
            }}
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                何の資格を目標にしていますか
              </label>
              <input
                type="text"
                value={form.certificationName}
                onChange={(e) =>
                  handleChange("certificationName", e.target.value)
                }
                className="w-full border border-[#EBEEF1] p-2 placeholder-[#A8A5AF]"
                style={{
                  borderRadius: "0px",
                  backgroundColor: "#EFF0F4",
                  color: form.certificationName ? "#000000" : "#A8A5AF",
                }}
                placeholder="例: AWS SAA"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                何日から開始しますか
              </label>
              <input
                type="date"
                value={form.startDate}
                onChange={(e) => handleChange("startDate", e.target.value)}
                className="w-full border border-[#EBEEF1] p-2 placeholder-[#A8A5AF]"
                style={{
                  borderRadius: "0px",
                  backgroundColor: "#EFF0F4",
                  color: form.startDate ? "#000000" : "#A8A5AF",
                }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                何日に試験を受けたいですか
              </label>
              <input
                type="date"
                value={form.examDate}
                onChange={(e) => handleChange("examDate", e.target.value)}
                className="w-full border border-[#EBEEF1] p-2 placeholder-[#A8A5AF]"
                style={{
                  borderRadius: "0px",
                  backgroundColor: "#EFF0F4",
                  color: form.examDate ? "#000000" : "#A8A5AF",
                }}
              />
              {errors.date && (
                <p className="text-red-500 text-sm mt-1">{errors.date}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                メインとなる学習媒体を教えてください
              </label>
              <select
                value={form.baseMaterial ?? ""}
                onChange={(e) =>
                  handleChange(
                    "baseMaterial",
                    e.target.value === "" ? undefined : (e.target.value as "TEXTBOOK" | "VIDEO")
                  )
                }
                className="w-full border border-[#EBEEF1] p-2"
                style={{
                  borderRadius: "0px",
                  backgroundColor: "#EFF0F4",
                  color: form.baseMaterial ? "#000000" : "#A8A5AF",
                }}
              >
                <option value="" disabled>
                  学習媒体選択
                </option>
                <option value="TEXTBOOK">教科書ベース</option>
                <option value="VIDEO">動画ベース</option>
              </select>
              {errors.baseMaterial && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.baseMaterial}
                </p>
              )}
            </div>
          </div>
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
