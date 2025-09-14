"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/app/(client)/components/Sidebar";
import GanttChart from "@/app/(client)/components/GanttChart";
import { components } from "@/types/apiSchema";

// OpenAPIから生成された型を利用
type Project = components["schemas"]["Project"];
type Step = components["schemas"]["Step"];
type Task = components["schemas"]["Task"];

// Step に tasks を追加した型
type StepWithTasks = Step & { tasks: Task[] };

export default function GanttPage() {
  const projectId = "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa";

  // Project は単一オブジェクト
  const [project, setProject] = useState<Project | null>(null);

  // Step はタスク込みの配列
  const [steps, setSteps] = useState<StepWithTasks[]>([]);

  // --- 本番用 fetch（コメントアウト） ---
  /*
  useEffect(() => {
    const fetchProjectData = async () => {
      // 1. プロジェクト情報
      const resProject = await fetch(`/api/project/${projectId}`);
      const projectData = await resProject.json();
      setProject(projectData);

      // 2. ステップ一覧
      const resSteps = await fetch(`/api/project/${projectId}/steps`);
      const stepsData: Step[] = await resSteps.json();

      // 3. 各ステップごとのタスク一覧
      const stepsWithTasks: StepWithTasks[] = await Promise.all(
        stepsData.map(async (step) => {
          const resTasks = await fetch(`/api/steps/${step.stepId}/tasks`);
          const tasks: Task[] = await resTasks.json();
          return { ...step, tasks };
        })
      );

      setSteps(stepsWithTasks);
    };

    fetchProjectData();
  }, [projectId]);
  */

  // --- モックデータ（暫定表示用） ---
  useEffect(() => {
    const mockProject: Project = {
      projectId,
      certificationName: "IT資格試験対策",
    } as Project;

    const mockSteps: StepWithTasks[] = [
      {
        stepId: "s1",
        projectId,
        title: "第1章",
        theme: "基礎学習",
        startDate: "2025-09-01",
        endDate: "2025-09-03",
        index: 1,
        tasks: [
          {
            taskId: "t1",
            stepId: "s1",
            title: "1.1 基本理解",
            description: "AI生成タスク",
            startDate: "2025-09-01",
            dueDate: "2025-09-02",
            taskStatus: "undo",
          },
          {
            taskId: "t2",
            stepId: "s1",
            title: "1.2 演習問題",
            description: "AI生成タスク",
            startDate: "2025-09-02",
            dueDate: "2025-09-03",
            taskStatus: "doing",
          },
        ],
      },
      {
        stepId: "s2",
        projectId,
        title: "第2章",
        theme: "応用演習",
        startDate: "2025-09-05",
        endDate: "2025-09-07",
        index: 2,
        tasks: [
          {
            taskId: "t3",
            stepId: "s2",
            title: "2.1 実践問題",
            description: "AI生成タスク",
            startDate: "2025-09-05",
            dueDate: "2025-09-06",
            taskStatus: "undo",
          },
        ],
      },
    ];

    setProject(mockProject);
    setSteps(mockSteps);
  }, []);

  return (
    <div className="flex h-screen">
      {/* サイドバー */}
      <Sidebar steps={steps} />

      {/* メインビュー */}
      <div className="flex-1 flex flex-col p-4">
        {/* 資格名 */}
        <h1 className="text-xl font-bold mb-4">
          {project?.certificationName ?? "Loading..."}
        </h1>
        {/* ガントチャート */}
        <GanttChart steps={steps} />
      </div>
    </div>
  );
}