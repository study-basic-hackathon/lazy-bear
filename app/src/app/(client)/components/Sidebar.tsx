import { components } from "@/types/apiSchema";
import { useState, useRef } from "react";
import { format } from "date-fns";

export type StepWithTasks = Step & { tasks: Task[] };

type Project = components["schemas"]["Project"];
type Step = components["schemas"]["Step"];
type Task = components["schemas"]["Task"];

const CELL = 42;

const formatDate = (dateStr?: string) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return format(d, "MM/dd");
};

/* LayoutA: プロジェクト名 */
function LayoutA({ project }: { project: Project | null }) {
  return (
    <div
      className="
        grid grid-cols-[3fr_1fr_1fr] pl-3 text-lg font-bold
        max-[375px]:grid-cols-[3fr]
      "
      style={{ height: `${CELL}px` }}
    >
      {project?.certificationName ?? "資格名（モック）"}
    </div>
  );
}

/* LayoutB: タイトル行 */
function LayoutB() {
  return (
    <div
      className="
        grid grid-cols-[3fr_1fr_1fr] text-sm font-bold
        max-[375px]:grid-cols-[3fr]
      "
      style={{ height: `${CELL}px` }}
    >
      <div className="flex items-center"></div>
      <div className="flex items-center max-[375px]:hidden">開始日</div>
      <div className="flex items-center max-[375px]:hidden">終了日</div>
    </div>
  );
}

/* LayoutC: ステップ */
function LayoutC({
  step,
  isOpen,
  toggle,
}: {
  step: StepWithTasks;
  isOpen: boolean;
  toggle: (id: string) => void;
}) {
  const stepId = step.stepId as string;

  return (
    <div>
      <div
        className="
          grid grid-cols-[3fr_1fr_1fr] cursor-pointer
          max-[375px]:grid-cols-[3fr]
        "
        style={{ height: `${CELL}px` }}
        onClick={() => toggle(stepId)}
      >
        <div className="grid grid-cols-[1fr_4fr]">
          <span className="flex items-center justify-center">
            {isOpen ? "▼" : "▶"}
          </span>
          <span className="flex items-center text-left">{step.title}</span>
        </div>
        <div className="flex items-center max-[375px]:hidden">
          {formatDate(step.startDate)}
        </div>
        <div className="flex items-center max-[375px]:hidden">
          {formatDate(step.endDate)}
        </div>
      </div>
    </div>
  );
}

/* LayoutD: タスク */
function LayoutD({ task }: { task: Task }) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      {/* タスク行 */}
      <div
        className="
          grid grid-cols-[3fr_1fr_1fr] cursor-pointer
          max-[375px]:grid-cols-[3fr]
        "
        style={{ height: `${CELL}px` }}
        onClick={() => setOpen((prev) => !prev)}
      >
        <div className="grid grid-cols-[1fr_1fr_8fr]">
          {/* 最初の1frは空白 */}
          <div />
          <span className="flex items-center justify-center">
            {open ? "▽" : "▷"}
          </span>
          <span className="flex items-center text-left">{task.title}</span>
        </div>
        <div className="flex items-center max-[375px]:hidden">
          {formatDate(task.startDate)}
        </div>
        <div className="flex items-center max-[375px]:hidden">
          {formatDate(task.endDate)}
        </div>
      </div>

      {/* 概要行 */}
      {open && (
        <div
          className="
            grid grid-cols-[3fr_1fr_1fr] w-full
            max-[375px]:grid-cols-[3fr]
          "
        >
          {/* 3fr 内をさらに 1fr_1fr_8fr に分割 */}
          <div className="grid grid-cols-[1fr_1fr_8fr] text-xs whitespace-pre-wrap break-words">
            <div /> {/* 空白 */}
            <div /> {/* 空白 */}
            <div className="text-left">{task.description}</div>{" "}
            {/* 8fr に概要説明 */}
          </div>
          {/* 右側 (開始日/終了日) は空白 */}
          <div className="max-[375px]:hidden" />
          <div className="max-[375px]:hidden" />
        </div>
      )}
    </div>
  );
}

/* LayoutE: rows 同期 */
function LayoutE({
  steps,
  openSteps,
  toggle,
}: {
  steps: StepWithTasks[];
  openSteps: Record<string, boolean>;
  toggle: (id: string) => void;
}) {
  const rows = steps.flatMap((step) =>
    openSteps[step.stepId as string] ? [step, ...step.tasks] : [step]
  );

  return (
    <div>
      <LayoutB />
      {rows.map((row) =>
        "tasks" in row ? (
          <LayoutC
            key={(row as StepWithTasks).stepId as string}
            step={row as StepWithTasks}
            isOpen={openSteps[(row as StepWithTasks).stepId as string] ?? false}
            toggle={toggle}
          />
        ) : (
          <LayoutD key={(row as Task).taskId as string} task={row as Task} />
        )
      )}
    </div>
  );
}

export default function Sidebar({
  project,
  steps,
  toggleStep,
  openSteps,
  syncScroll, // ★ 親から同期関数を受け取る
}: {
  project: Project | null;
  steps: StepWithTasks[];
  toggleStep: (id: string) => void;
  openSteps: Record<string, boolean>;
  syncScroll?: (scrollTop: number) => void; // ★ 追加
}) {
  const sidebarRef = useRef<HTMLDivElement | null>(null);

  // ★ スクロール検知して親に通知
  const handleScroll = () => {
    if (sidebarRef.current && syncScroll) {
      syncScroll(sidebarRef.current.scrollTop);
    }
  };

  return (
    <div
      ref={sidebarRef}
      onScroll={handleScroll}
      className="
        bg-gray-100 text-sm overflow-y-auto
        w-[252px] min-w-[252px] max-w-[252px]
        max-[375px]:w-[151px] max-[375px]:min-w-[151px] max-[375px]:max-w-[151px]
      "
      style={{
        height: "812px",
        overflowX: "hidden",
      }}
    >
      <LayoutA project={project} />
      <LayoutE steps={steps} openSteps={openSteps} toggle={toggleStep} />
    </div>
  );
}