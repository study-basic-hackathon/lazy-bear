import { NextResponse } from "next/server";
import { db } from "@/lib/db/db";
import { tasks } from "@/lib/db/schema";
import { eq, asc } from "drizzle-orm";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ stepId: string }> }
) {
  const { stepId } = await params;

  if (!stepId) {
    return NextResponse.json(
      { message: "Step ID is required" },
      { status: 400 }
    );
  }

  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(stepId)) {
    return NextResponse.json(
      { message: "無効なステップIDです" },
      { status: 400 }
    );
  }

  try {
    const stepTasks = await db.query.tasks.findMany({
      where: eq(tasks.stepId, stepId),
      orderBy: [asc(tasks.startDate)],
    });

    if (stepTasks.length === 0) {
      return NextResponse.json(
        { message: "データが見つかりません" },
        { status: 404 }
      );
    }

    return NextResponse.json(stepTasks, { status: 200 });
  } catch (error) {
    console.error("ステップ取得エラー:", error);
    return NextResponse.json(
      { message: "ステップの取得に失敗しました" },
      { status: 500 }
    );
  }
}
