import { NextResponse } from "next/server";
import { db } from "@/backend/infra/db/db";
import { personas } from "@/backend/infra/db/schema";

export async function GET() {
  try {
    // データベース接続テスト: 全てのpersonaを取得
    const allPersonas = await db.select().from(personas);

    return NextResponse.json({
      success: true,
      message: "Database connection successful!",
      data: allPersonas,
      count: allPersonas.length,
    });
  } catch (error) {
    console.error("Database connection error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Database connection failed",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
