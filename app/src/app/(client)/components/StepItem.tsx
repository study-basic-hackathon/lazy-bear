"use client";

import { useEffect, useState } from "react";
import { components } from "@/types/apiSchema";
import TaskItem from "./TaskItem";

type Step = components["schemas"]["Step"];
type Task = components["schemas"]["Task"];

type StepItemProps = {
  step: Step;
};

export default function StepItem({ step }: StepItemProps) {
  const [open, setOpen] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [tasks, setTasks] = useState<Task[] | null>(null);
  const [lastFetchedAt, setLastFetchedAt] = useState<Date | null>(null);

  const CACHE_DURATION = 5 * 60 * 1000; // 5分

  // --- 本番用 fetch（コメントアウト） ---
  /*
  const fetchTasks = async () => {
    const res = await fetch(`/api/steps/${step.stepId}/tasks`);
    const data: Task[] = await res.json();
    setTasks(data);
    setLastFetchedAt(new Date());
  };
  */

  // open の切り替えでチェック
  useEffect(() => {
    if (open) {
      const now = new Date();
      const shouldFetch =
        tasks === null ||
        (lastFetchedAt && now.getTime() - lastFetchedAt.getTime() > CACHE_DURATION);

      if (shouldFetch) {
        // --- 本番用 ---
        // fetchTasks();

        // --- モック ---
        const mockTasks: Task[] = [
          {
            taskId: "t1",
            stepId: step.stepId,
            title: "演習問題 1",
            description: "AI生成タスク",
            startDate: "2025-09-01",
            dueDate: "2025-09-02",
            taskStatus: "undo",
          },
          {
            taskId: "t2",
            stepId: step.stepId,
            title: "演習問題 2",
            description: "AI生成タスク",
            startDate: "2025-09-03",
            dueDate: "2025-09-04",
            taskStatus: "doing",
          },
        ];
        setTasks(mockTasks);
        setLastFetchedAt(now);
      }
    }
  }, [open, step.stepId]); // openがtrueになったときだけチェック

  return (
    <div className="mb-4">
      {/* ステップ名 */}
      <div
        className="cursor-pointer font-semibold flex items-center"
        onClick={() => setShowDetail(!showDetail)}
      >
        <span
          onClick={(e) => {
            e.stopPropagation();
            setOpen(!open);
          }}
        >
          {open ? "▽" : "▷"}
        </span>
        <span className="ml-1">{step.title}</span>
      </div>

      {/* ステップ詳細 */}
      {showDetail && (
        <div className="ml-5 text-sm text-gray-600">{step.theme}</div>
      )}

      {/* タスク一覧 */}
      {open && tasks && (
        <div className="ml-5 mt-2">
          {tasks.map((task) => (
            <TaskItem key={task.taskId} task={task} />
          ))}
        </div>
      )}
    </div>
  );
}