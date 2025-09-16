"use client";

import { useState, useEffect, useRef } from "react";
import Sidebar, { StepWithTasks } from "../../components/Sidebar";
import GanttChart from "../../components/GanttChart";

import { components } from "@/types/apiSchema";

type Project = components["schemas"]["Project"];

// モックデータ
const mockProject: Project = {
  projectId: "mock-project-1",
  personaId: "mock-persona-1",
  certificationName: "AWS SAA",
  examDate: "2025-10-01",
  baseMaterial: "TEXTBOOK",
};

const mockSteps: StepWithTasks[] = [
  {
    stepId: "step-1",
    projectId: "mock-project-1",
    title: "ステップ1",
    theme: "テーマ1",
    startDate: "2025-09-01",
    endDate: "2025-09-05",
    tasks: [
      {
        taskId: "task-1",
        stepId: "step-1",
        title: "タスク1-1",
        description: "タスク1-1の概要です",
        startDate: "2025-09-01",
        endDate: "2025-09-03",
      },
      {
        taskId: "task-2",
        stepId: "step-1",
        title: "タスク1-2",
        description: "タスク1-2の概要です",
        startDate: "2025-09-03",
        endDate: "2025-09-05",
      },
    ],
  },
  {
    stepId: "step-2",
    projectId: "mock-project-1",
    title: "ステップ2",
    theme: "テーマ2",
    startDate: "2025-09-06",
    endDate: "2025-09-10",
    tasks: [
      {
        taskId: "task-3",
        stepId: "step-2",
        title: "タスク2-1",
        description: "タスク2-1の概要です",
        startDate: "2025-09-06",
        endDate: "2025-09-08",
      },
    ],
  },
];

export default function ProjectPage() {
  const [project, setProject] = useState<Project | null>(null);
  const [steps, setSteps] = useState<StepWithTasks[]>([]);
  const [openSteps, setOpenSteps] = useState<Record<string, boolean>>({});

  // ★ Sidebar と GanttChart の参照
  const sidebarRef = useRef<HTMLDivElement | null>(null);
  const ganttRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // 将来的にAPIから取得予定
    setProject(mockProject);
    setSteps(mockSteps);
  }, []);

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