import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/db";
import { projects } from "@/lib/db/schema";
import { eq, asc } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: { personaId: string } }
) {
  try {
    const { personaId } = params;

    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(personaId)) {
      return NextResponse.json(
        { error: "無効なペルソナIDです" },
        { status: 400 }
      );
    }

    const projectList = await db
      .select()
      .from(projects)
      .where(eq(projects.personaId, personaId))
      .orderBy(asc(projects.examDate));

    // データが見つからない場合は空配列を返す（404ではなく200で）
    return NextResponse.json(
      {
        projects: projectList,
        count: projectList.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("プロジェクト取得エラー:", error);
    return NextResponse.json(
      { error: "プロジェクトの取得に失敗しました" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { personaId: string } }
) {
  try {
    const { personaId } = params;
    const body = await request.json();
    const { certificationName, examDate, startDate, baseMaterial } = body;

    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(personaId)) {
      return NextResponse.json(
        { error: "無効なペルソナIDです" },
        { status: 400 }
      );
    }

    if (!certificationName || !examDate || !startDate) {
      return NextResponse.json(
        { error: "必須項目が不足しています" },
        { status: 400 }
      );
    }

    const newProject = await db
      .insert(projects)
      .values({
        personaId,
        certificationName,
        examDate,
        startDate,
        baseMaterial: baseMaterial || "TEXTBOOK",
      })
      .returning();

    return NextResponse.json(
      {
        message: "プロジェクトが正常に作成されました",
        project: newProject[0],
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("プロジェクト作成エラー:", error);
    return NextResponse.json(
      { error: "プロジェクトの作成に失敗しました" },
      { status: 500 }
    );
  }
}
