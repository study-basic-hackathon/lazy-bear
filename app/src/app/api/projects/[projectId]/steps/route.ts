import { NextResponse } from "next/server";
import { db } from "@/lib/db/db";
import { steps, projects } from "@/lib/db/schema";
import { v4 as uuidv4 } from "uuid";
import { components } from "@/types/apiSchema";
import { eq, asc } from "drizzle-orm";

type StepCreateArray = components["schemas"]["StepCreate"][];

// AI補完用の完全なステップ型
type StepWithDates = {
  title: string;
  theme: string;
  index: number;
  startDate: string;
  endDate: string;
};

// 不足フィールドをチェックする関数
function getMissingFields(step: any): string[] {
  const missingFields = [];
  if (!step.title) missingFields.push("title");
  if (!step.theme) missingFields.push("theme");
  if (step.index === undefined || step.index === null)
    missingFields.push("index");
  return missingFields;
}

// 日付を生成する関数
function generateStepDates(
  projectStartDate: string,
  projectExamDate: string,
  stepIndex: number,
  totalSteps: number
): { startDate: string; endDate: string } {
  const start = new Date(projectStartDate);
  const end = new Date(projectExamDate);
  const totalDays = Math.floor(
    (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
  );

  const daysPerStep = Math.floor(totalDays / totalSteps);

  const stepStart = new Date(
    start.getTime() + stepIndex * daysPerStep * 24 * 60 * 60 * 1000
  );
  const stepEnd = new Date(
    start.getTime() + (stepIndex + 1) * daysPerStep * 24 * 60 * 60 * 1000
  );

  return {
    startDate: stepStart.toISOString().split("T")[0],
    endDate: stepEnd.toISOString().split("T")[0],
  };
}

// steps/generateエンドポイントを内部的に呼び出す関数
async function fetchGeneratedSteps(projectId: string) {
  try {
    // 同じサーバー内での内部API呼び出し
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const response = await fetch(
      `${baseUrl}/api/projects/${projectId}/steps/generate`
    );

    if (!response.ok) {
      throw new Error(`Generate steps API failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to fetch generated steps:", error);
    throw error;
  }
}

export async function GET(
  request: Request,
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
      { message: "無効なプロジェクトIDです" },
      { status: 400 }
    );
  }

  try {
    const projectSteps = await db.query.steps.findMany({
      where: eq(steps.projectId, projectId),
      orderBy: [asc(steps.index)],
    });

    if (projectSteps.length === 0) {
      return NextResponse.json(
        { message: "データが見つかりません" },
        { status: 404 }
      );
    }

    return NextResponse.json(projectSteps, { status: 200 });
  } catch (error) {
    console.error("ステップ取得エラー:", error);
    return NextResponse.json(
      { message: "ステップの取得に失敗しました" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await params;

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
    // 不足フィールドがあるかチェック
    const hasIncompleteSteps = body.some(
      (step) => getMissingFields(step).length > 0
    );

    let completedSteps: StepWithDates[] = [];
    let aiGenerated = false;

    if (hasIncompleteSteps) {
      console.log(
        "不完全なステップが検出されました。steps/generateを呼び出してAI補完します..."
      );

      try {
        // 既存のsteps/generateエンドポイントを活用
        const generatedStepsData = await fetchGeneratedSteps(projectId);

        if (
          generatedStepsData &&
          Array.isArray(generatedStepsData) &&
          generatedStepsData.length > 0
        ) {
          // プロジェクト情報を取得（日付計算用）
          const [project] = await db
            .select({
              startDate: projects.startDate,
              examDate: projects.examDate,
              certificationName: projects.certificationName,
            })
            .from(projects)
            .where(eq(projects.projectId, projectId));

          if (!project) {
            return NextResponse.json(
              { message: "Project not found" },
              { status: 404 }
            );
          }

          // 既存のステップとAI生成ステップをマージ
          completedSteps = body.map((originalStep, index) => {
            const missingFields = getMissingFields(originalStep);

            // 日付を計算
            const dates = generateStepDates(
              project.startDate,
              project.examDate,
              index,
              body.length
            );

            if (missingFields.length === 0) {
              // 完全なステップ - 日付だけ追加
              return {
                title: originalStep.title!,
                theme: originalStep.theme!,
                index: originalStep.index!,
                startDate: dates.startDate,
                endDate: dates.endDate,
              };
            }

            // AI生成ステップで補完
            const aiStep = generatedStepsData[index] || generatedStepsData[0];

            return {
              title:
                originalStep.title || aiStep.title || `ステップ ${index + 1}`,
              theme:
                originalStep.theme ||
                aiStep.theme ||
                `${project.certificationName}の学習ステップ${index + 1}`,
              index:
                originalStep.index !== undefined
                  ? originalStep.index
                  : aiStep.index !== undefined
                  ? aiStep.index
                  : index,
              startDate: dates.startDate,
              endDate: dates.endDate,
            };
          });

          aiGenerated = true;
          console.log("steps/generateによるAI補完が完了しました");
        } else {
          throw new Error("steps/generateからデータが返されませんでした");
        }
      } catch (aiError) {
        console.log(
          "steps/generate呼び出しに失敗しました。フォールバック値を使用します:",
          aiError
        );

        // プロジェクト情報を取得（フォールバック用）
        const [project] = await db
          .select({
            startDate: projects.startDate,
            examDate: projects.examDate,
            certificationName: projects.certificationName,
          })
          .from(projects)
          .where(eq(projects.projectId, projectId));

        if (!project) {
          return NextResponse.json(
            { message: "Project not found" },
            { status: 404 }
          );
        }

        // フォールバック値で補完
        completedSteps = body.map((step, index) => {
          const dates = generateStepDates(
            project.startDate,
            project.examDate,
            index,
            body.length
          );
          return {
            title: step.title || `ステップ ${index + 1}`,
            theme:
              step.theme ||
              `${project.certificationName}の学習ステップ${
                index + 1
              }の内容を学習し、理解を深めます。`,
            index: step.index !== undefined ? step.index : index,
            startDate: dates.startDate,
            endDate: dates.endDate,
          };
        });
      }
    } else {
      // 完全なステップの場合は日付だけ生成
      const [project] = await db
        .select({ startDate: projects.startDate, examDate: projects.examDate })
        .from(projects)
        .where(eq(projects.projectId, projectId));

      if (!project) {
        return NextResponse.json(
          { message: "Project not found" },
          { status: 404 }
        );
      }

      completedSteps = body.map((step, index) => {
        const dates = generateStepDates(
          project.startDate,
          project.examDate,
          index,
          body.length
        );
        return {
          title: step.title!,
          theme: step.theme!,
          index: step.index!,
          startDate: dates.startDate,
          endDate: dates.endDate,
        };
      });
    }

    // データベースに保存
    const newSteps = completedSteps.map((s) => ({
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
