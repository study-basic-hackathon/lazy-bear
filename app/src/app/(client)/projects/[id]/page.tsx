"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import Sidebar, { StepWithTasks } from "../../components/Sidebar";
import GanttChart from "../../components/GanttChart";

import { components } from "@/types/apiSchema";

type Project = components["schemas"]["Project"];
type Step = components["schemas"]["Step"];
type Task = components["schemas"]["Task"];

export default function ProjectPage() {
  const params = useParams<{ id: string }>();
  const projectId = params.id;

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
    <div className="flex">
      {/* Sidebar */}
      <div ref={sidebarRef} className="overflow-y-auto">
        <Sidebar
          project={project}
          steps={steps}
          toggleStep={toggleStep}
          openSteps={openSteps}
          syncScroll={(scrollTop: number) => syncScroll("sidebar", scrollTop)}
        />
      </div>

      {/* GanttChart */}
      <div ref={ganttRef} className="overflow-y-auto flex-1">
        <GanttChart
          steps={steps}
          openSteps={openSteps}
          syncScroll={(scrollTop: number) => syncScroll("gantt", scrollTop)}
        />
      </div>
    </div>
  );
}