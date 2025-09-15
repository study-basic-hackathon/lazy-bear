import { NextResponse } from "next/server";
import { db } from "@/lib/db/db";
import { steps } from "@/lib/db/schema";
import { v4 as uuidv4 } from "uuid";
import { components } from "@/types/apiSchema";
import { eq, asc } from "drizzle-orm";

type StepCreateArray = components["schemas"]["StepCreate"][];

export async function GET(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await params;

  if (!projectId) {
    return NextResponse.json(
      { message: "Project ID is required" },
      { status: 400 }
    );
  }

  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(projectId)) {
    return NextResponse.json(
      { message: "無効なプロジェクトIDです" },
      { status: 400 }
    );
  }

  try {
    const projectSteps = await db.query.steps.findMany({
      where: eq(steps.projectId, projectId),
      orderBy: [asc(steps.index)],
    });

    if (projectSteps.length === 0) {
      return NextResponse.json(
        { message: "データが見つかりません" },
        { status: 404 }
      );
    }

    return NextResponse.json(projectSteps, { status: 200 });
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
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await params;

  if (!projectId) {
    return NextResponse.json(
      { message: "Project ID is required" },
      { status: 400 }
    );
  }

  let body: StepCreateArray;

  try {
    body = await request.json();
    if (!Array.isArray(body) || body.length === 0) {
      return NextResponse.json(
        { message: "Request body must be a non-empty array of steps" },
        { status: 400 }
      );
    }
  } catch (e) {
    return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
  }

  try {
    const newSteps = body.map((s) => ({
      stepId: uuidv4(),
      projectId: projectId,
      title: s.title,
      theme: s.theme,
      startDate: s.startDate,
      endDate: s.endDate,
      index: s.index,
    }));

    if (newSteps.length > 0) {
      await db.insert(steps).values(newSteps);
    }

    const stepIds = newSteps.map((s) => s.stepId);

    return NextResponse.json({ stepIds }, { status: 201 });
  } catch (error) {
    console.error("Error creating steps:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
