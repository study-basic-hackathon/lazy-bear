"use client";

import { eachDayOfInterval, format, isWeekend, parseISO } from "date-fns";
import { components } from "@/types/apiSchema";

// API の型
type Step = components["schemas"]["Step"];
type Task = components["schemas"]["Task"];

// tasks をネストした Step 型
type StepWithTasks = Step & { tasks: Task[] };

type GanttChartProps = {
  steps: StepWithTasks[];
};

export default function GanttChart({ steps }: GanttChartProps) {
  if (steps.length === 0) return null;

  // --- すべての startDate / endDate を収集 ---
  const allDates = steps
    .flatMap((step) => [
      step.startDate,
      step.endDate,
      ...step.tasks.map((t) => t.startDate),
      ...step.tasks.map((t) => t.dueDate),
    ])
    .map((d) => parseISO(d!));

  // --- 範囲を決定 ---
  const minDate = new Date(Math.min(...allDates.map((d) => d.getTime())));
  const maxDate = new Date(Math.max(...allDates.map((d) => d.getTime())));

  const days = eachDayOfInterval({ start: minDate, end: maxDate });

  // ステップとタスクをまとめてバーに変換
  const bars = steps.flatMap((step) => [
    {
      type: "step" as const,
      title: step.title,
      start: step.startDate,
      end: step.endDate,
      color: "bg-purple-500",
    },
    ...step.tasks.map((t) => ({
      type: "task" as const,
      title: t.title,
      start: t.startDate,
      end: t.dueDate,
      color: "bg-blue-500",
    })),
  ]);

  return (
    <div className="overflow-x-auto">
      {/* 日付ヘッダー */}
      <div className="flex">
        {days.map((d) => {
          const day = format(d, "d");
          const weekday = format(d, "EEE");
          const isRed = isWeekend(d);
          return (
            <div
              key={d.toISOString()}
              className="w-16 text-center border text-sm"
            >
              <div className={isRed ? "text-red-500" : ""}>{day}</div>
              <div className={isRed ? "text-red-500" : ""}>{weekday}</div>
            </div>
          );
        })}
      </div>

      {/* バー */}
      {bars.map((bar, idx) => {
        const startIndex = days.findIndex(
          (d) => format(d, "yyyy-MM-dd") === bar.start
        );
        const endIndex = days.findIndex(
          (d) => format(d, "yyyy-MM-dd") === bar.end
        );
        const length = endIndex - startIndex + 1;

        return (
          <div key={idx} className="flex mt-2">
            <div
              style={{
                marginLeft: `${startIndex * 4}rem`,
                width: `${length * 4}rem`,
              }}
              className={`${bar.color} h-6 rounded text-white flex items-center justify-center`}
            >
              {bar.title}
            </div>
          </div>
        );
      })}
    </div>
  );
}