import { NextResponse } from "next/server";

import { db } from "@/lib/db/db";
import { projects, weights } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { paths } from "@/types/apiSchema";

type StepsGenerateResponse =
  paths["/projects/{projectId}/steps/generate"]["get"]["responses"]["200"]["content"]["application/json"];

export async function GET(
  request: Request,
  { params }: { params: { projectId: string } }
) {
  try {
    const projectId = params.projectId;

    // DBからプロジェクト情報を取得
    const project = await db
      .select()
      .from(projects)
      .where(eq(projects.projectId, projectId))
      .then((res) => res[0]);

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

    // TODO: 本来はVertex AIで生成する
    const mockSteps: StepsGenerateResponse = [
      {
        title: "AWSの基本",
        theme: "主要なAWSサービス（EC2, S3, VPC）の概要を理解する",
        index: 0,
      },
      {
        title: "設計原則",
        theme: "高可用性、コスト効率、耐障害性に優れたアーキテクチャの設計原則を学ぶ",
        index: 1,
      },
      {
        title: "セキュリティ",
        theme: "IAM、セキュリティグループ、KMSなどのセキュリティ関連サービスを習得する",
        index: 2,
      },
    ];

    return NextResponse.json(mockSteps);
  } catch (error) {
    console.error("Error in GET /api/projects/[projectId]/steps/generate:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
