import { NextResponse } from 'next/server';
import { generateLearningPlan } from '@/lib/ai/demo-generate-plan';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { qualificationName, deadline } = body;

    if (!qualificationName || !deadline) {
      return NextResponse.json(
        { error: '資格名と期限は必須です。' },
        { status: 400 }
      );
    }

    const plan = await generateLearningPlan(qualificationName, deadline);

    return NextResponse.json(plan);

  } catch (error) {
    console.error('[API_PLAN_ERROR]', error); // Changed the log key for clarity
    const errorMessage = error instanceof Error ? error.message : '不明なエラーが発生しました。';
    return NextResponse.json(
      { error: `学習計画の生成に失敗しました: ${errorMessage}` },
      { status: 500 }
    );
  }
}
