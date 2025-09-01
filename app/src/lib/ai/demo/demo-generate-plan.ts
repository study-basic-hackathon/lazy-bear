import { generateContentFromPrompt } from '../client';
import fs from 'fs';
import path from 'path';

// プロンプトファイルを読み込む
const generateLearningPlanPrompt = fs.readFileSync(
  path.join(process.cwd(), 'src/lib/ai/demo/prompts/generate-learning-plan.txt'),
  'utf-8'
);

/**
 * 【デモ用】資格名と期限に基づいて学習計画を生成します。
 * @param qualificationName 資格名
 * @param deadline 期限 (YYYY-MM-DD)
 * @returns 生成された学習計画のJSONオブジェクト
 */
export async function generateLearningPlan(
  qualificationName: string,
  deadline: string
) {
  const userPrompt = `
    資格名: ${qualificationName}
    合格期限: ${deadline}

    上記の資格に合格するための学習計画を生成してください。
  `;

  return await generateContentFromPrompt(
    generateLearningPlanPrompt,
    userPrompt
  );
}