import { NextResponse } from "next/server";
import { db } from "@/lib/db/db";
import { steps, projects, weights } from "@/lib/db/schema";
import { v4 as uuidv4 } from "uuid";
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
  request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params;

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
  request: Request,
  { params }: { params: Promise<{ projectId: string }> },
  { body }: { body?: components["schemas"]["StepCreate"] }
) {
  try {
    const { projectId } = await params;

    if (!isValidProjectId(projectId)) {
      return NextResponse.json(
        { message: "Project ID is required" },
        { status: 400 }
      );
    }

    body = await request.json();
    if (!Array.isArray(body) || body.length === 0) {
      return NextResponse.json(
        { message: "Request body must be a non-empty array of steps" },
        { status: 400 }
      );
    }

    const additionalSteps = await supplementSteps(projectId);
    const stepIds = await insertSteps(additionalSteps, projectId);

    return NextResponse.json({ stepIds }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
  }
}

async function supplementSteps(projectId: string) {
  try {
    const projectData = await getProjects(projectId);
    const weightData = await getWeights(projectId);

    if (!projectData) {
      throw new Error("Project not found");
    }

    // 既存のsteps/generateエンドポイントを活用
    const generatedStepsData = await generateSupplementSteps(
      projectData,
      weightData
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

    const newSteps = stepsToInsert.map((s) => ({
      stepId: uuidv4(),
      projectId: projectId,
      title: s.title,
      theme: s.theme,
      startDate: s.startDate,
      endDate: s.endDate,
      index: s.index,
    }));
    await db.insert(steps).values(newSteps);
    return newSteps.map((s) => s.stepId);
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
