import { components } from "@/types/apiSchema";
import React, { useMemo, useRef } from "react";
import { format, eachDayOfInterval } from "date-fns";
import { ja } from "date-fns/locale"; // ★ 日本語ロケールを追加
import { StepWithTasks } from "./Sidebar";

type Step = components["schemas"]["Step"];
type Task = components["schemas"]["Task"];

const CELL = 42;
const BG_HEIGHT = 812;

const toLocalDateOnly = (v?: string | Date) => {
  if (!v) return null;
  const d = typeof v === "string" ? new Date(v) : v;
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
};
const dayKey = (d: Date) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();

export default function GanttChart({
  steps = [],
  openSteps = {},
  syncScroll, // ★ 親から通知用関数を受け取る
}: {
  steps: StepWithTasks[];
  openSteps: Record<string, boolean>;
  syncScroll?: (scrollTop: number) => void; // ★ 追加
}) {
  const { start, end } = useMemo(() => {
    const today = toLocalDateOnly(new Date())!;
    const start = new Date(today);
    start.setMonth(start.getMonth() - 1);
    const end = new Date(today);
    end.setMonth(end.getMonth() + 3);
    return { start, end };
  }, []);

  const days = useMemo(() => eachDayOfInterval({ start, end }), [start, end]);
  const gridWidth = days.length * CELL;

  // rows 同期
  const rows = steps.flatMap((step) =>
    openSteps[step.stepId as string] ? [step, ...step.tasks] : [step]
  );

  // ★ ref と scroll ハンドラ
  const ganttRef = useRef<HTMLDivElement | null>(null);

  const handleScroll = () => {
    if (ganttRef.current && syncScroll) {
      syncScroll(ganttRef.current.scrollTop);
    }
  };

  // ★ ドラッグ & スワイプスクロール用
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startY = useRef(0);
  const scrollLeft = useRef(0);
  const scrollTop = useRef(0);

  // PCマウス
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!ganttRef.current) return;
    isDragging.current = true;
    startX.current = e.clientX;
    startY.current = e.clientY;
    scrollLeft.current = ganttRef.current.scrollLeft;
    scrollTop.current = ganttRef.current.scrollTop;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !ganttRef.current) return;
    const dx = e.clientX - startX.current;
    const dy = e.clientY - startY.current;
    ganttRef.current.scrollLeft = scrollLeft.current - dx;
    ganttRef.current.scrollTop = scrollTop.current - dy;
  };

  const stopDragging = () => {
    isDragging.current = false;
  };

  // スマホタッチ
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!ganttRef.current) return;
    isDragging.current = true;
    startX.current = e.touches[0].clientX;
    startY.current = e.touches[0].clientY;
    scrollLeft.current = ganttRef.current.scrollLeft;
    scrollTop.current = ganttRef.current.scrollTop;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current || !ganttRef.current) return;
    const dx = e.touches[0].clientX - startX.current;
    const dy = e.touches[0].clientY - startY.current;
    ganttRef.current.scrollLeft = scrollLeft.current - dx;
    ganttRef.current.scrollTop = scrollTop.current - dy;
  };

  const handleTouchEnd = () => {
    isDragging.current = false;
  };

  return (
    <div
      ref={ganttRef}
      onScroll={handleScroll}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={stopDragging}
      onMouseLeave={stopDragging}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="cursor-grab select-none"
      style={{
        height: `${BG_HEIGHT}px`,
        overflow: "hidden", // ★ スクロールバーを非表示
      }}
    >
      <div
        className="relative"
        style={{
          width: gridWidth,
          height: BG_HEIGHT,
        }}
      >
        {/* 縦背景 */}
        <div
          className="absolute top-0 left-0 flex"
          style={{ width: gridWidth, height: BG_HEIGHT }}
        >
          {days.map((_, i) => (
            <div
              key={i}
              style={{
                width: CELL,
                height: BG_HEIGHT,
                backgroundColor: i % 2 === 0 ? "#E6E6EF" : "#FFFFFF",
              }}
            />
          ))}
        </div>

        {/* グリッド */}
        <table
          className="relative z-10"
          style={{
            width: gridWidth,
            tableLayout: "fixed",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr>
              {days.map((d) => (
                <th
                  key={d.toISOString()}
                  style={{
                    width: CELL,
                    padding: 0,
                    position: "sticky", // ★ スクロール固定
                    top: 0, // ★ 上に固定
                    zIndex: 20,
                    backgroundColor: "#FFFFFF",
                  }}
                >
                  {/* 空白領域（レスポンシブ幅固定） */}
                  <div
                    style={{
                      width: "100%",
                      height: `${CELL}px`,
                      backgroundColor: "#FFFFFF",
                      minWidth: "375px",
                      maxWidth: "1800px",
                      margin: "0 auto",
                    }}
                  />
                  {/* 日付＋曜日マス */}
                  <div
                    className="flex flex-col items-center justify-center w-full text-xs"
                    style={{
                      height: `${CELL}px`,
                      borderTop: "1px solid #000",
                      borderBottom: "1px solid #000",
                    }}
                  >
                    <span>{format(d, "MM/dd")}</span>
                    <span>({format(d, "EEE", { locale: ja })})</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.map((row) => {
              if ("tasks" in row) {
                const step = row as StepWithTasks;
                const sStart = toLocalDateOnly(step.startDate ?? new Date())!;
                const sEnd = toLocalDateOnly(step.endDate ?? new Date())!;
                const sStartKey = dayKey(sStart);
                const sEndKey = dayKey(sEnd);

                return (
                  <tr key={step.stepId as string} style={{ height: `${CELL}px` }}>
                    {days.map((d) => {
                      const dk = dayKey(d);
                      const inRange = dk >= sStartKey && dk <= sEndKey;
                      const isStart = dk === sStartKey;
                      const isEnd = dk === sEndKey;

                      return (
                        <td key={d.toISOString()} style={{ padding: 0 }}>
                          {inRange && (
                            <div
                              className="bg-purple-500 h-6"
                              style={{
                                borderTopLeftRadius: isStart ? 8 : 0,
                                borderBottomLeftRadius: isStart ? 8 : 0,
                                borderTopRightRadius: isEnd ? 8 : 0,
                                borderBottomRightRadius: isEnd ? 8 : 0,
                              }}
                            />
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              } else {
                const task = row as Task;
                const tStart = toLocalDateOnly(task.startDate ?? new Date())!;
                const tEnd = toLocalDateOnly(task.dueDate ?? new Date())!;
                const tStartKey = dayKey(tStart);
                const tEndKey = dayKey(tEnd);

                return (
                  <tr key={task.taskId as string} style={{ height: `${CELL}px` }}>
                    {days.map((d) => {
                      const dk = dayKey(d);
                      const inRange = dk >= tStartKey && dk <= tEndKey;
                      const isStart = dk === tStartKey;
                      const isEnd = dk === tEndKey;

                      return (
                        <td key={d.toISOString()} style={{ padding: 0 }}>
                          {inRange && (
                            <div
                              className="bg-blue-400 h-6"
                              style={{
                                borderTopLeftRadius: isStart ? 8 : 0,
                                borderBottomLeftRadius: isStart ? 8 : 0,
                                borderTopRightRadius: isEnd ? 8 : 0,
                                borderBottomRightRadius: isEnd ? 8 : 0,
                              }}
                            />
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              }
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
