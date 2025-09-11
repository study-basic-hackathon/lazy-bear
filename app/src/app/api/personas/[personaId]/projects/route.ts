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
    console.log("受信したpersonaId:", personaId); // デバッグ用
    console.log("personaIdの型:", typeof personaId); // デバッグ用

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
    if (projectList.length === 0) {
      return NextResponse.json(
        { message: "データが見つかりません" },
        { status: 404 }
      );
    }

    return NextResponse.json(projectList, { status: 200 });
  } catch (error) {
    console.error("プロジェクト取得エラー:", error);
    return NextResponse.json(
      { error: "プロジェクトの取得に失敗しました" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { personaId, certificationName, examDate, startDate, baseMaterial } =
      body;

    if (!personaId || !certificationName || !examDate || !startDate) {
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
