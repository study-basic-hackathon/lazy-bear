"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { components } from "@/types/apiSchema";


type Project = components["schemas"]["Project"];



export default function PersonaProjectsPage() {
  const params = useParams<{ id: string }>();
  const personaId = params.id;
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    if (!personaId) return;
    const fetchProjects = async () => {
      try {
        const res = await fetch(`/api/personas/${personaId}/projects`);
        if (!res.ok) throw new Error("Failed to fetch projects");
        const json = await res.json();
        setProjects(json.projects); // ✅ 配列部分だけをセット
      } catch (err) {
        console.error(err);
        setProjects([]);
      }
    };
    fetchProjects();
  }, [personaId]);

  return (
    <div
      className={`min-h-screen min-w-screen bg-[#EBEEF1] flex justify-center`}
    >
      <div
        className="p-6 bg-white"
        style={{ width: "335px", height: "752px", marginTop: "30px" }}
      >
        {/* ユーザマーク */}
        <div className="mb-6 flex justify-end">
          <Link href={`/personas/${personaId}`}>
            <Image
              src="/getProjects/avatar.svg"
              alt="userIcon"
              width={52}
              height={52}
              className="rounded-full"
              priority
            />
          </Link>
        </div>

        {/* グリッドレイアウト：カード一覧 + ⊕ボタン */}
        <div className="grid grid-cols-1 gap-6">
          {/* カード一覧 */}
          {projects.length === 0 ? (
            <p className="text-black">プロジェクトは登録されていません。</p>
          ) : (
            <ul className="space-y-[7px]">
              {projects.map((project) => {
                const formattedDate = project.examDate
                  ? new Date(project.examDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })
                  : "Undecided";

                return (
                  <li key={project.projectId}>
                    <Link href={`/projects/${project.projectId}`}>
                      <div className="p-4 rounded-[8px] border border-[#EBEEF1] shadow-sm bg-white hover:shadow-md w-[295px] h-[91px]">
                        <h2 className="text-[20px] font-semibold text-black">
                          {project.certificationName ?? "未設定の資格"}
                        </h2>
                        <p className="inline-block px-2 py-1 mt-[8px] rounded-[100px] bg-[#EBEEF1] text-gray-700 text-[12px]">
                          {formattedDate}
                        </p>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}

          {/* ⊕ボタン */}
          <div className="flex justify-center">
            <Link href={`/personas/${personaId}/projects/post`}>
              <Image
                src="/getProjects/plusButton.svg"
                alt="Add Project"
                width={45}
                height={45}
                className="cursor-pointer hover:opacity-80"
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}