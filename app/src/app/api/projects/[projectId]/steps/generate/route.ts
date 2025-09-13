import { NextResponse } from "next/server";

import { db } from "@/lib/db/db";
import { projects, weights } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { generateSteps } from "@/lib/ai/steps/generate-steps";
import { paths } from "@/types/apiSchema";

type StepsGenerateResponse =
  paths["/projects/{projectId}/steps/generate"]["get"]["responses"]["200"]["content"]["application/json"];

export async function GET(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params;

    // DBからプロジェクト情報を取得
    const project = await db.query.projects.findFirst({
      where: eq(projects.projectId, projectId),
      with: {
        persona: true,
      },
    });

    if (!project) {
      return NextResponse.json(
        { message: "Project not found" },
        { status: 404 }
      );
    }

    // DBから重み情報を取得
    const projectWeights = await db
      .select()
      .from(weights)
      .where(eq(weights.projectId, projectId));

    // AIを呼び出してステップを生成
    const stepResponse = await generateSteps(project, projectWeights);

    const steps: StepsGenerateResponse = stepResponse.steps;

    return NextResponse.json(steps);
  } catch (error) {
    console.error("Error in GET /api/projects/[projectId]/steps/generate:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
