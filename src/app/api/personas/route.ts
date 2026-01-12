import { NextResponse } from "next/server";
import { db } from "@/backend/infra/db/db";
import { personas } from "@/backend/infra/db/schema";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { weekdayHours, weekendHours, learningPattern } = body;

    if (!weekdayHours || !weekendHours) {
      return NextResponse.json(
        { error: "平日と週末の学習時間は必須です" },
        { status: 400 }
      );
    }

    if (
      weekdayHours < 0 ||
      weekdayHours > 24 ||
      weekendHours < 0 ||
      weekendHours > 24
    ) {
      return NextResponse.json(
        { error: "学習時間は0〜24時間の範囲で入力してください" },
        { status: 400 }
      );
    }

    const newPersona = await db
      .insert(personas)
      .values({
        weekdayHours: weekdayHours.toString(),
        weekendHours: weekendHours.toString(),
        learningPattern: learningPattern || "インプット先行パターン",
      })
      .returning();

    const persona = newPersona[0];

    return NextResponse.json(
      {
        id: persona.personaId,
      },
      {
        status: 201,
        headers: {
          Location: `api/personas/${persona.personaId}`,
        },
      }
    );
  } catch (error) {
    console.error("ペルソナ作成エラー:", error);
    return NextResponse.json(
      { error: "ペルソナの作成に失敗しました" },
      { status: 500 }
    );
  }
}
