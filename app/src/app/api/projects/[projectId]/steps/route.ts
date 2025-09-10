import { NextResponse } from "next/server";
import { db } from "@/lib/db/db";
import { steps } from "@/lib/db/schema";
import { v4 as uuidv4 } from "uuid";
import { components } from "@/types/apiSchema";

type StepCreateArray = components["schemas"]["StepCreate"][];

export async function POST(
  request: Request,
  { params }: { params: { projectId: string } }
) {
  const { projectId } = params;

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
