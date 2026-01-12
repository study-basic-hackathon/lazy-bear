"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import Sidebar, { StepWithTasks } from "@/frontend/components/Sidebar";
import GanttChart from "@/frontend/components/GanttChart";
import { M_PLUS_1p } from "next/font/google";

const mplus = M_PLUS_1p({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

import { components } from "@/contracts/api";

type Project = components["schemas"]["Project"];
type Step = components["schemas"]["Step"];
type Task = components["schemas"]["Task"];

export default function ProjectPage() {
  const params = useParams<{ personaId: string, projectId: string }>();
  const { projectId } = params;

  const [project, setProject] = useState<Project | null>(null);
  const [steps, setSteps] = useState<StepWithTasks[]>([]);
  const [openSteps, setOpenSteps] = useState<Record<string, boolean>>({});

  // ★ Sidebar と GanttChart の参照
  const sidebarRef = useRef<HTMLDivElement | null>(null);
  const ganttRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!projectId) return;

    // プロジェクト情報は別途必要なら fetch
    fetch(`/api/projects/${projectId}`)
      .then((res) => res.json())
      .then((data: Project) => setProject(data))
      .catch((err) => console.error("プロジェクト取得エラー:", err));

    // ステップを取得
    fetch(`/api/projects/${projectId}/steps`)
      .then((res) => res.json())
      .then(async (stepsData: Step[]) => {
        // 各ステップごとにタスクを取得
        const stepsWithTasks: StepWithTasks[] = await Promise.all(
          stepsData.map(async (step) => {
            try {
              const res = await fetch(`/api/steps/${step.stepId}/tasks`);
              const tasks: Task[] = await res.json();
              return { ...step, tasks };
            } catch (err) {
              console.error(`タスク取得エラー (stepId=${step.stepId}):`, err);
              return { ...step, tasks: [] };
            }
          })
        );
        setSteps(stepsWithTasks);
      })
      .catch((err) => console.error("ステップ取得エラー:", err));
  }, [projectId]);

  const toggleStep = (id: string) => {
    setOpenSteps((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // ★ スクロール同期処理
  const syncScroll = (source: "sidebar" | "gantt", scrollTop: number) => {
    if (source === "sidebar" && ganttRef.current) {
      ganttRef.current.scrollTop = scrollTop;
    }
    if (source === "gantt" && sidebarRef.current) {
      sidebarRef.current.scrollTop = scrollTop;
    }
  };

  return (
    <div className={`${mplus.className} text-stone-950 flex`}>
      {/* Sidebar */}
      <div ref={sidebarRef} className="bg-gray-100">
        <div className={`${mplus.className} text-stone-950`}>
          <Sidebar
            project={project}
            steps={steps}
            toggleStep={toggleStep}
            openSteps={openSteps}
            syncScroll={(scrollTop: number) => syncScroll("sidebar", scrollTop)}
          />
        </div>
      </div>

      {/* GanttChart */}
      <div ref={ganttRef} className="overflow-y-auto flex-1 min-h-dvh">
        <div className={`${mplus.className} text-stone-950 h-full`}>
          <GanttChart
            steps={steps}
            openSteps={openSteps}
            syncScroll={(scrollTop: number) => syncScroll("gantt", scrollTop)}
          />
        </div>
      </div>
    </div>
  );
}
