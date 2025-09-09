"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { components } from "@/types/apiSchema";

type ProjectCreate = components["schemas"]["ProjectCreate"];

export default function ProjectCreatePage() {
  const params = useParams<{ id: string }>();
  const personaId = params.id;

  const [form, setForm] = useState<ProjectCreate>({
    certificationName: "",
    startDate: "",
    examDate: "",
    baseMaterial: "TEXTBOOK",
  });

  const handleChange = (field: keyof ProjectCreate, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: ProjectCreate = {
      ...form,
    };

    console.log("プロジェクト作成 payload:", payload);

    // TODO: API に接続
    // await fetch(`/api/personas/${personaId}/projects`, {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(payload),
    // });
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
            }}
        >
            <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
                取得したい資格名を入力してください
            </label>
            <input
                type="text"
                value={form.certificationName}
                onChange={(e) => handleChange("certificationName", e.target.value)}
                className="w-full border border-[#EBEEF1] p-2 focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-[#A8A5AF]"
                style={{ borderRadius: "0px", backgroundColor: "#EFF0F4" }}
                placeholder="例: AWS SAA"
                required
            />
            </div>

            <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
                試験開始日を設定してください
            </label>
            <input
                type="date"
                value={form.startDate}
                onChange={(e) => handleChange("startDate", e.target.value)}
                className="w-full border border-[#EBEEF1] p-2 focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-[#A8A5AF]"
                style={{ borderRadius: "0px", backgroundColor: "#EFF0F4" }}
            />
            </div>

            <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
                試験日を設定してください
            </label>
            <input
                type="date"
                value={form.examDate}
                onChange={(e) => handleChange("examDate", e.target.value)}
                className="w-full border border-[#EBEEF1] p-2 focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-[#A8A5AF]"
                style={{ borderRadius: "0px", backgroundColor: "#EFF0F4" }}
            />
            </div>

            <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
                メインとなる学習媒体を選択してください
            </label>
            <select
                value={form.baseMaterial}
                onChange={(e) =>
                handleChange("baseMaterial", e.target.value as "textbook" | "video")
                }
                className="w-full border border-[#EBEEF1] p-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-[#A8A5AF]"
                style={{ borderRadius: "0px", backgroundColor: "#EFF0F4" }}
            >
                <option value="textbook">教科書ベース</option>
                <option value="video">動画ベース</option>
            </select>
            </div>
        </form>

        <button
            type="submit"
            className="font-semibold transition absolute"
            style={{
            width: "226px",
            height: "60px",
            borderRadius: "0px",
            backgroundColor: "#3C436D",
            color: "#FFFFFF",
            left: "75px",
            top: "680px",
            }}
        >
            決定
        </button>
        </div>
    </div>
    );
}
