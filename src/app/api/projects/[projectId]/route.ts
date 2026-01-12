import { NextResponse, NextRequest } from "next/server";
import { db } from "@/backend/infra/db/db";
import { projects } from "@/backend/infra/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  request: NextRequest,
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
      { error: "無効なプロジェクトIDです" },
      { status: 400 }
    );
  }

  try {
    // DBからプロジェクト情報を取得
    const project = await db.query.projects.findFirst({
      where: eq(projects.projectId, projectId),
    });

    if (!project) {
      return NextResponse.json(
        { message: "データが見つかりません" },
        { status: 404 }
      );
    }

    // 結果を返す
    return NextResponse.json(project, { status: 200 });
  } catch (error) {
    console.error("プロジェクト取得エラー:", error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : "プロジェクトの取得に失敗しました";
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}
