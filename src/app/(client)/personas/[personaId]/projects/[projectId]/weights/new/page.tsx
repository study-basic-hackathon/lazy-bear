"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { generateWeights, postWeights } from "@/frontend/api/weight";
import type { WeightCreateVM } from "@/frontend/types/viewModel/weight";
import ApiError from "@/frontend/utils/ApiError";
import { toWeightCreateApiDto, toWeightCreateVM } from "@/frontend/converts/weight";
import { WeightFormError } from "@/frontend/types/api/weight";

export default function WeightsCreatePage() {
  const params = useParams<{
    personaId: string,
    projectId: string,
  }>();
  const { personaId, projectId } = params;
  const router = useRouter();
  const [weights, setWeights] = useState<WeightCreateVM[]>([]);
  const [apiError, setApiError] = useState<ApiError | null>(null);
  const [error, setError] = useState<WeightFormError | null>(null);

  useEffect(() => {
    const fetchWeights = async () => {
      const result = await generateWeights(projectId);
      if (!result.success) {
        setApiError(result.error);
        return;
      }
      setWeights(toWeightCreateVM(result.value));
      };
      fetchWeights();
    }, [projectId]);

  const handleChange = (index: number, field: keyof WeightCreateVM, value: string) => {
    const nextWeights = [...weights];
    nextWeights[index][field] = value
    setWeights(nextWeights);
  };

  const handleDelete = (index: number) => {
    const nextWeights = weights.filter((_, i) => i !== index);
    setWeights(nextWeights);
  };

  const handleAdd = () => {
    setWeights([...weights, { area: "", weightPercent: "0" }]);
  };

  const handleSubmit = async () => {
    setError(null);
    const result = toWeightCreateApiDto(weights);
    if (!result.success) {
      setError(result.error);
      return;
    }
    const fetchResult = await postWeights(projectId, result.value);
    if (!fetchResult.success) {
      setApiError(fetchResult.error);
    }
    router.push(`/personas/${personaId}/projects/${projectId}/steps/new`);
  };

  return (
    <div className={`min-h-screen min-w-screen bg-[#EBEEF1] flex justify-center text-gray-950`}>
      <div
        className="p-6 bg-white relative"
        style={{ width: "335px", height: "752px", marginTop: "30px" }}
      >
        {/* レイアウトC */}
        <form
          onSubmit={handleSubmit}
          className="grid"
          style={{
            width: "295px",
            rowGap: "24px",
            marginTop: "30px",
          }}
        >
          {/* row1: レイアウトA */}
          <div className="text-center font-medium">
            スケジュール生成のために<br />
            試験の配点割合を<br />
            教えてください
          </div>

          {/* row2: レイアウトB */}
          <div
            className="grid"
            style={{
              gridTemplateRows: "auto auto",
              rowGap: "8px",
              borderRadius: "0px",
              height: "344px",
            }}
          >
            {/* タイトル行 */}
            <div className="grid grid-cols-2 font-semibold text-center border-b">
              <div>対象分野</div>
              <div>配点割合</div>
            </div>

            {/* 入力フォーム行（スクロール可能） */}
            <div
              style={{
                overflowY: "auto",
                height: "calc(344px - 24px)",
              }}
            >
              {Array.isArray(weights) &&
                weights.map((w, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-2"
                  >
                    {/* 対象分野 */}
                    <input
                      type="text"
                      value={w.area}
                      onChange={(e) => handleChange(index, "area", e.target.value)}
                      placeholder="分野名"
                      className="p-2 border text-gray-950"
                      style={{ borderRadius: "0px", width: "144px" }}
                    />

                    {/* 配点割合 + ゴミ箱 */}
                    <div className="flex items-center">
                      <input
                        type="number"
                        value={w.weightPercent}
                        onChange={(e) => handleChange(index, "weightPercent", e.target.value)}
                        className="p-2 border text-right text-gray-950"
                        style={{ borderRadius: "0px", width: "56px" }}
                        min={0}
                        max={100}
                      />
                      <span className="ml-1">%</span>
                      {/* ゴミ箱（非表示時もスペース確保） */}
                      <div style={{ minWidth: "24px", marginLeft: "4px" }}>
                        {weights.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleDelete(index)}
                            className="text-red-500 font-bold"
                            style={{ minWidth: "24px" }}
                          >
                            <Image
                              src="/createWeights/trashBox.svg"
                              alt="delete Weight"
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

          {/* row3: 追加ボタン */}
          <div className="flex justify-center">
            <button
              type="button"
              onClick={handleAdd}
              className="font-semibold"
              style={{ borderRadius: "0px" }}
            >
              <Image
                src="/createWeights/plusButton.svg"
                alt="Add Weight"
                width={45}
                height={45}
                className="cursor-pointer hover:opacity-80"
              />
            </button>
          </div>

          {/* エラー */}
          {error && <p className="text-red-500 text-sm text-center">{error.message}</p>}

          {/* 決定ボタン */}
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