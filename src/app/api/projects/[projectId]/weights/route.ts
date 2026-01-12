import { NextRequest, NextResponse } from "next/server";
import { db } from "@/backend/infra/db/db";
import { weights } from "@/backend/infra/db/schema";
import { v4 as uuidv4 } from "uuid";

type WeightCreate = {
  area: string;
  weightPercent: number;
};

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ projectId: string }> }
): Promise<NextResponse> {
  const { projectId } = await context.params;

  if (!projectId) {
    return NextResponse.json(
      { message: "Project ID is required" },
      { status: 400 }
    );
  }

  let body: WeightCreate[];

  try {
    body = await request.json();
    // ボディが配列であるか、また空でないかを確認
    if (!Array.isArray(body) || body.length === 0) {
      return NextResponse.json(
        { message: "Request body must be a non-empty array of weights" },
        { status: 400 }
      );
    }
  } catch (e) {
    return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
  }

  try {
    const newWeights = body.map((w) => ({
      weightId: uuidv4(),
      projectId: projectId,
      area: w.area,
      weightPercent: w.weightPercent,
    }));

    if (newWeights.length > 0) {
      await db.insert(weights).values(newWeights);
    }

    const weightIds = newWeights.map((w) => w.weightId);

    return NextResponse.json({ weightIds }, { status: 201 });
  } catch (error) {
    console.error("Error creating weights:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
