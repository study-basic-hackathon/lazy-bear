import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { db } from '@/lib/db/db';
import { projects } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { generateWeights } from '@/lib/ai/weights/generate-weights';



export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await params;


  if (!projectId) {
    return NextResponse.json({ message: 'Project ID is required' }, { status: 400 });
  }

  try {
    // DBからプロジェクト情報を取得
    const project = await db.query.projects.findFirst({
      where: eq(projects.projectId, projectId),
    });

    if (!project) {
      return NextResponse.json({ message: 'Project not found' }, { status: 404 });
    }

    // AIを呼び出して比重を生成
    const weightResponse = await generateWeights(project.certificationName);

    // 結果を返す
    return NextResponse.json(weightResponse.weights, { status: 200 });

  } catch (error) {
    console.error('Error generating weight candidates:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}