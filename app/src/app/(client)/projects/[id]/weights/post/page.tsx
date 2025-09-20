"use client";

import Image from "next/image";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { components } from "@/types/apiSchema";


type WeightCreate = components["schemas"]["WeightCreate"];



export default function WeightsCreatePage() {
  const params = useParams<{ id: string }>();
  const projectId = params.id;
  const router = useRouter();
  // モックデータ（APIから取得される想定、テスト終了後は削除）
  const [weights, setWeights] = useState<WeightCreate[]>([
    { area: "ネットワーク", weightPercent: 30 },
    { area: "データベース", weightPercent: 25 },
    { area: "セキュリティ", weightPercent: 20 },
    { area: "アルゴリズム", weightPercent: 25 },
  ]);

  const [error, setError] = useState<string>("");

  // フィールドの更新
  const handleChange = (index: number, field: keyof WeightCreate, value: string) => {
    const updated = [...weights];
    if (field === "weightPercent") {
      updated[index][field] = parseInt(value) || 0;
    } else {
      updated[index][field] = value;
    }
    setWeights(updated);
  };

  // 行の削除
  const handleDelete = (index: number) => {
    const updated = weights.filter((_, i) => i !== index);
    setWeights(updated);
  };

  // 行の追加
  const handleAdd = () => {
    setWeights([...weights, { area: "", weightPercent: 0 }]);
  };

  // 保存時の検証 & fetch
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // 空白チェック
    const hasEmpty = weights.some((w) => w.area.trim() === "");
    if (hasEmpty) {
      setError("対象分野を入力してください");
      return;
    }
    // 合計チェック
    const total = weights.reduce((sum, w) => sum + w.weightPercent, 0);
    if (total !== 100) {
      const diff = total - 100;
      if (diff > 0) {
        setError(`配点割合の合計が100%を超えています（+${diff}%）`);
      } else {
        setError(`配点割合の合計が100%に不足しています（${diff}%）`);
      }
      return;
    }
    setError("");

    try {
      // weightの保存
      await fetch(`/api/projects/${projectId}/weight`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(weights),
      });

      // stepの生成結果を取得（モックデータで一時対応）
      const steps = [
        { index: 1, title: "準備ステップ", description: "環境を整える" },
        { index: 2, title: "学習ステップ", description: "教科書を読む" },
        { index: 3, title: "演習ステップ", description: "問題を解く" },
      ];

      console.log("取得したsteps（モック）:", steps);

      router.push(`/projects/${projectId}/steps/post`);
    } catch (err) {
      console.error("保存または取得エラー:", err);
      setError("保存または生成に失敗しました");
    }
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
              {weights.map((w, index) => (
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
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

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