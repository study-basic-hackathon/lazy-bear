"use client";

import { useState } from "react";
import { components } from "@/types/apiSchema";

type Task = components["schemas"]["Task"];

type TaskItemProps = {
  task: Task;
};

// ステータス変換マップ（NonNullableでundefinedを排除）
const STATUS_MAP: Record<
  NonNullable<Task["taskStatus"]>,
  { label: string; color: string }
> = {
  undo: { label: "未着手", color: "bg-gray-300 text-gray-800" },
  doing: { label: "進行中", color: "bg-blue-500 text-white" },
  done: { label: "完了", color: "bg-green-500 text-white" },
  blocked: { label: "保留", color: "bg-red-500 text-white" },
};

export default function TaskItem({ task }: TaskItemProps) {
  const [showDetail, setShowDetail] = useState(false);

  // API保証に基づき NonNullable にキャスト
  const status =
    STATUS_MAP[task.taskStatus as NonNullable<Task["taskStatus"]>];

  return (
    <div className="mb-2">
      {/* タスク名 */}
      <div
        className="cursor-pointer text-blue-600"
        onClick={() => setShowDetail(!showDetail)}
      >
        {task.title}
      </div>

      {/* タスク詳細 */}
      {showDetail && (
        <div className="ml-4 text-sm text-gray-600 space-y-1">
          <div>{task.description}</div>
          <div>
            期間: {task.startDate} ~ {task.endDate}
          </div>
          <div>
            ステータス:{" "}
            <span
              className={`px-2 py-0.5 rounded text-xs font-semibold ${status.color}`}
            >
              {status.label}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}