"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";




export default function ProjectCreatedSuccessPage() {
  const params = useParams<{ id: string }>();
  const projectId = params.id; // ✅ URLからprojectIdを取得
  const router = useRouter();

  const [personaId, setPersonaId] = useState<string | null>(null);
  const [error, setError] = useState<string>("");

  // projectIdからpersonaIdを取得
  useEffect(() => {
    if (!projectId) return;

    const fetchProject = async () => {
      try {
        const res = await fetch(`/api/projects/${projectId}`);
        if (!res.ok) throw new Error("プロジェクト情報の取得に失敗しました");
        const project = await res.json();
        setPersonaId(project.personaId); // ✅ useStateでセット
      } catch (err) {
        console.error(err);
        setError("プロジェクト情報の取得に失敗しました");
      }
    };

    fetchProject();
  }, [projectId]);

  // TOPに戻る
  const handleGoTop = async () => {
    if (!personaId) return;
    try {
      router.push(`/personas/${personaId}/projects`);
    } catch (err) {
      console.error(err);
      setError("TOPに戻れませんでした");
    }
  };

  // 計画を見る
  const handleGoPlan = async () => {
    try {
      router.push(`/projects/${projectId}`);
    } catch (err) {
      console.error(err);
      setError("計画ページに遷移できませんでした");
    }
  };

  return (
    <div
      className={`min-h-screen min-w-screen bg-[#EBEEF1] flex justify-center text-gray-950`}
    >
      <div
        className="p-6 bg-white relative text-center"
        style={{ width: "335px", height: "752px", marginTop: "30px" }}
      >
        {/* 完了メッセージ */}
        <div
          style={{ marginTop: "200px" }}
          className="flex flex-col justify-center items-center"
        >
          <p className="font-medium">
            スケジュールが作成完了しました！
            <br />
            この調子で頑張りましょう！
          </p>
          <div className="mt-9">
            <Image
              src="/successCreation/checkMark.svg"
              alt="check mark"
              width={144}
              height={144}
            />
          </div>
        </div>

        {/* TOPに戻る */}
        <div
          className="absolute left-1/2 transform -translate-x-1/2"
          style={{ top: "527px" }}
        >
          <button
            type="button"
            onClick={handleGoTop}
            disabled={!personaId}
            className="font-semibold"
            style={{
              width: "226px",
              height: "60px",
              borderRadius: "0px",
              backgroundColor: "#A0AEC0",
              color: "#FFFFFF",
              opacity: personaId ? 1 : 0.6,
              marginBottom: "24px"
            }}
          >
            TOPに戻る
          </button>
        </div>

        {/* 計画を見る */}
        <div
          className="absolute left-1/2 transform -translate-x-1/2"
          style={{ top: "611px" }}
        >
          <button
            type="button"
            onClick={handleGoPlan}
            className="font-semibold"
            style={{
              width: "226px",
              height: "60px",
              borderRadius: "0px",
              backgroundColor: "#3C436D",
              color: "#FFFFFF"
            }}
          >
            計画を見る
          </button>
        </div>

        {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
      </div>
    </div>
  );
}