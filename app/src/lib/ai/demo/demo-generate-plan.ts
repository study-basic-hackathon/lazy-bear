import { generateContentFromPrompt } from '../client';
import { FunctionDeclarationSchema, SchemaType } from '@google-cloud/vertexai';
import { LearningPlan } from '@/types/demo';

// システムプロンプト
const systemInstruction = 'あなたは優秀な学習プランナーです。ユーザーが指定した資格と期限に基づき、現実的で詳細な学習計画をステップとタスクの形式で生成してください。';


// --- レスポンスのJSONスキーマ定義 ---
const learningPlanSchema: FunctionDeclarationSchema = {
  type: SchemaType.OBJECT,
  properties: {
    steps: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          id: { type: SchemaType.NUMBER, description: 'ステップの一意なID' },
          title: { type: SchemaType.STRING, description: 'ステップのタイトル' },
          tasks: {
            type: SchemaType.ARRAY,
            items: {
              type: SchemaType.OBJECT,
              properties: {
                id: { type: SchemaType.NUMBER, description: 'タスクの一意なID' },
                title: { type: SchemaType.STRING, description: 'タスクのタイトル' },
                description: { type: SchemaType.STRING, description: 'タスクの詳細な説明' },
                startDate: { type: SchemaType.STRING, description: 'タスクの開始日 (YYYY-MM-DD)' },
                endDate: { type: SchemaType.STRING, description: 'タスクの終了日 (YYYY-MM-DD)' },
              },
              required: ['id', 'title', 'description', 'startDate', 'endDate'],
            },
          },
        },
        required: ['id', 'title', 'tasks'],
      },
    },
  },
  required: ['steps'],
};


/**
 * 【デモ用】資格名と期限に基づいて学習計画を生成します。
 * @param qualificationName 資格名
 * @param deadline 期限 (YYYY-MM-DD)
 * @returns 生成された学習計画のJSONオブジェクト
 */
export async function generateLearningPlan(
  qualificationName: string,
  deadline: string
): Promise<LearningPlan> {
  const userPrompt = `
    資格名: ${qualificationName}
    合格期限: ${deadline}

    上記の資格に合格するための学習計画を生成してください。
  `;

  return await generateContentFromPrompt<LearningPlan>(
    systemInstruction,
    userPrompt,
    learningPlanSchema
  );
}