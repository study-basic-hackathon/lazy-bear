import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/backend/infra/db/db';
import { projects, tasks } from '@/backend/infra/db/schema';
import { eq } from 'drizzle-orm';
import { generateTasks } from '@/backend/infra/ai/tasks/generate-tasks';
import { TaskFromAI, TasksGenerateApiResponse } from '@/backend/types/tasks';

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ projectId: string }> }
): Promise<NextResponse> {
  try {
    const { projectId } = await context.params;

    // 1. DBからプロジェクトと関連情報を取得
    const projectData = await db.query.projects.findFirst({
      where: eq(projects.projectId, projectId),
      with: {
        persona: true,
        weights: true,
        steps: {
          orderBy: (steps, { asc }) => [asc(steps.index)], // ステップをindex順で取得
        },
      },
    });

    if (!projectData) {
      return NextResponse.json(
        { message: "Project not found" },
        { status: 404 }
      );
    }

    // 2. AIを呼び出してタスクを生成
    const aiResponse = await generateTasks(projectData);

    if (!aiResponse.tasks || aiResponse.tasks.length === 0) {
      return NextResponse.json(
        { message: "Failed to generate tasks from AI" },
        { status: 500 }
      );
    }

    // 3. レスポンスをDBのスキーマに合わせて変換
    const tasksToInsert = aiResponse.tasks.map((task: TaskFromAI) => ({
      stepId: task.stepId,
      title: task.title,
      theme: task.description, // スキーマの theme カラムに description をマッピング
      startDate: task.startDate,
      endDate: task.endDate,
    }));

    // 4. DBにタスクを一括登録
    const insertedTasks = await db
      .insert(tasks)
      .values(tasksToInsert)
      .returning({ taskId: tasks.taskId });

    if (insertedTasks.length === 0) {
      return NextResponse.json(
        { message: "Failed to insert tasks into database" },
        { status: 500 }
      );
    }

    // 5. 作成されたタスクIDのリストをレスポンスとして返す
    const response: TasksGenerateApiResponse = {
      taskIds: insertedTasks.map((t) => t.taskId),
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/projects/[projectId]/tasks/generate:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
