import { components } from "@/types/apiSchema";
import { useRef, useState } from "react";

export type StepWithTasks = Step & { tasks: Task[] };

type Project = components["schemas"]["Project"];
type Step = components["schemas"]["Step"];
type Task = components["schemas"]["Task"];

const CELL = 50;

/* LayoutA: プロジェクト名 */
function LayoutA({ project }: { project: Project | null }) {
  return (
    <div
      className="
        grid pl-3 text-base font-semibold
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
        grid text-xs font-semibold
      "
      style={{ height: `${CELL}px` }}
    >
      <div className="flex items-center"></div>
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
          grid cursor-pointer font-normal
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
      </div>
    </div>
  );
}

/* LayoutD: タスク */
function LayoutD({ task }: { task: Task }) {
  const [hover, setHover] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* タスク行 */}
      <div
        className="
          grid
        "
        style={{ height: `${CELL}px` }}
      >
        <div className="flex items-center text-left pl-6 text-xs">
          {task.title}
        </div>
      </div>

      {/* description を hover 時に表示 */}
      {hover && task.description && (
        <div className="pl-8 pr-2 text-[10px] font-extralight break-words whitespace-pre-wrap block min-h-[20px]">
          {task.description}
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
    openSteps[step.stepId as string]
      ? [step, ...step.tasks]
      : [step]
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
        bg-gray-100 text-xs overflow-y-auto
        w-[152px] min-w-[152px] max-w-[152px]
      "
      style={{
        height: "1500px",
        overflowX: "hidden",
      }}
    >
      <LayoutA project={project} />
      <LayoutE steps={steps} openSteps={openSteps} toggle={toggleStep} />
    </div>
  );
}