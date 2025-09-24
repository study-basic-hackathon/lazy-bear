import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/db";
import { steps, projects, weights } from "@/lib/db/schema";
import { components } from "@/types/apiSchema";
import { eq, asc } from "drizzle-orm";
import { generateSupplementSteps } from "@/lib/ai/steps/generate-steps-root";

type StepCreateArray = {
  title: string;
  theme: string;
  index: number;
  startDate: string;
  endDate: string;
};
type StepCreate = components["schemas"]["StepCreate"];

async function isValidProjectId(projectId: string) {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(projectId)) {
    return false;
  }
  return true;
}

async function getSteps(projectId: string) {
  return await db.query.steps.findMany({
    where: eq(steps.projectId, projectId),
    orderBy: [asc(steps.index)],
  });
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ projectId: string }> }
): Promise<NextResponse> {
  try {
    const { projectId } = await context.params;

    if (!isValidProjectId(projectId)) {
      return NextResponse.json(
        { message: "Project ID is required" },
        { status: 400 }
      );
    }

    const steps = await getSteps(projectId);

    if (steps.length === 0) {
      return NextResponse.json(
        { message: "データが見つかりません" },
        { status: 404 }
      );
    }

    return NextResponse.json(steps, { status: 200 });
  } catch (error) {
    console.error("ステップ取得エラー:", error);
    return NextResponse.json(
      { message: "ステップの取得に失敗しました" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ projectId: string }> }
): Promise<NextResponse> {
  try {
    const { projectId } = await context.params;

    if (!isValidProjectId(projectId)) {
      return NextResponse.json(
        { message: "Project ID is required" },
        { status: 400 }
      );
    }

    const pendingSteps = (await request.json()) as components["schemas"]["StepCreate"];
    if (!Array.isArray(pendingSteps) || pendingSteps.length === 0) {
      return NextResponse.json(
        { message: "Request body must be a non-empty array of steps" },
        { status: 400 }
      );
    }

    const additionalSteps = await supplementSteps(projectId, pendingSteps);
    const stepIds = await insertSteps(additionalSteps, projectId);

    return NextResponse.json({ stepIds }, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
  }
}

async function supplementSteps(projectId: string, pendingSteps: StepCreate[]) {
  try {
    const projectData = await getProjects(projectId);
    const weightData = await getWeights(projectId);

    if (!projectData) {
      throw new Error("Project not found");
    }

    const generatedStepsData = await generateSupplementSteps(
      projectData,
      weightData,
      pendingSteps
    );

    const stepsToInsert = generatedStepsData.steps.map(
      (steps: StepCreateArray) => ({
        title: steps.title,
        theme: steps.theme,
        startDate: steps.startDate,
        endDate: steps.endDate,
        index: steps.index,
      })
    );

    return stepsToInsert;
  } catch (error: unknown) {
    console.error("AI呼び出しに失敗しました:", error);
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`AI呼び出しに失敗: ${message}`);
  }
}

async function insertSteps(
  stepsToInsert: StepCreateArray[],
  projectId: string
) {
  try {
    if (stepsToInsert.length === 0) {
      return [];
    }

    //無効な値が入り込んでいるため、 stepId は事前に削除する
    const newSteps = stepsToInsert.map((s) => ({
      projectId,
      title: s.title,
      theme: s.theme,
      startDate: s.startDate,
      endDate: s.endDate,
      index: s.index,
    }));

    const stepIds = await db
      .insert(steps)
      .values(newSteps)
      .returning({ stepId: steps.stepId });

    return stepIds.map((row) => row.stepId);
  } catch (error: unknown) {
    console.error("DB呼び出しに失敗しました:", error);
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`DB呼び出しに失敗: ${message}`);
  }
}

async function getWeights(projectId: string) {
  return await db
    .select()
    .from(weights)
    .where(eq(weights.projectId, projectId));
}

async function getProjects(projectId: string) {
  return await db.query.projects.findFirst({
    where: eq(projects.projectId, projectId),
    with: {
      persona: true,
    },
  });
}
