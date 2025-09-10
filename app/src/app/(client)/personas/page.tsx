"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { components } from "@/types/apiSchema";

type PersonaCreate = components["schemas"]["PersonaCreate"];

// ラッパー型: learningPattern に undefined を許可
type PersonaCreateForm = Omit<PersonaCreate, "learningPattern"> & {
  learningPattern: PersonaCreate["learningPattern"] | undefined;
};

export default function PersonaCreatePage() {
  const router = useRouter();

  const [form, setForm] = useState<PersonaCreateForm>({
    weekdayHours: 0,
    weekendHours: 0,
    learningPattern: undefined,
  });

 const [errors, setErrors] = useState<{ learningPattern?: string; hours?: string }>({});

  const handleChange = (
    field: keyof PersonaCreateForm,
    value: string | number | undefined
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [field]: undefined,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.learningPattern) {
      setErrors({ learningPattern: "学習パターンを選択してください" });
      return;
    }

    const payload: PersonaCreate = {
      ...form,
      learningPattern: form.learningPattern,
    };

    console.log("ペルソナ作成 payload:", payload);

    // TODO: API に接続
    // const res = await fetch(`/api/personas`, {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(payload),
    // });
    // const data = await res.json();
    // const personaId = data.personaId;
    // router.push(`/personas/${personaId}`);
  };

  return (
    <div className="min-h-screen min-w-screen bg-[#EBEEF1] flex justify-center">
      <div
        className="p-6 bg-white relative"
        style={{ width: "335px", height: "752px", marginTop: "30px" }}
      >
        {/* ペルソナ作成フォーム */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (form.weekdayHours === 0 && form.weekendHours === 0) {
              setErrors({ ...errors, hours: "平日または休日の勉強時間を入力してください" });
              return;
            }
            handleSubmit(e);
          }}
          className="grid"
          style={{
            width: "295px",
            height: "423px",
            marginTop: "70px",
          }}
        >
          {/* 各要素の間隔を28pxに統一 */}
          <div className="flex flex-col" style={{ gap: "28px" }}>
            <div>
              <label className="block text-sm font-medium text-gray-700" style={{ marginBottom: "12px" }}>
                平日の勉強時間
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={0}
                  max={18}
                  step={1}
                  value={form.weekdayHours}
                  onChange={(e) =>
                    handleChange("weekdayHours", Number(e.target.value))
                  }
                  className="border border-[#EBEEF1] p-2 placeholder-[#A8A5AF]"
                  style={{
                    width: "80%",
                    borderRadius: "0px",
                    backgroundColor: "#EFF0F4",
                    color: "#000000",
                  }}
                  placeholder="例: 2"
                  required
                />
                <span>時間</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700" style={{ marginBottom: "12px" }}>
                休日の勉強時間
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={0}
                  max={18}
                  step={1}
                  value={form.weekendHours}
                  onChange={(e) =>
                    handleChange("weekendHours", Number(e.target.value))
                  }
                  className="border border-[#EBEEF1] p-2 placeholder-[#A8A5AF]"
                  style={{
                    width: "80%",
                    borderRadius: "0px",
                    backgroundColor: "#EFF0F4",
                    color: "#000000",
                  }}
                  placeholder="例: 5"
                  required
                />
                <span>時間</span>
              </div>
            </div>
            {errors.hours && (
              <p className="text-red-500 text-sm mt-1">{errors.hours}</p>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700" style={{ marginBottom: "12px" }}>
                好きな学習パターンを選択してください
              </label>
              <select
                value={form.learningPattern ?? ""}
                onChange={(e) =>
                  handleChange(
                    "learningPattern",
                    e.target.value === ""
                      ? undefined
                      : (e.target.value as PersonaCreate["learningPattern"])
                  )
                }
                className="w-full border border-[#EBEEF1] p-2"
                style={{
                  borderRadius: "0px",
                  backgroundColor: "#EFF0F4",
                  color: form.learningPattern ? "#000000" : "#A8A5AF",
                }}
              >
                <option value="" disabled>
                  学習パターン選択
                </option>
                <option value="INPUT_FIRST">インプット先行</option>
                <option value="OUTPUT_FIRST">アウトプット先行</option>
              </select>
              {errors.learningPattern && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.learningPattern}
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