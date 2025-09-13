
import { generateContentFromPrompt } from '../client';
import { FunctionDeclarationSchema } from '@google-cloud/vertexai';
import { type projects, type personas } from '@/lib/db/schema';
import { type weights } from '@/lib/db/schema/weights';
import { paths } from '@/types/apiSchema';

const systemInstruction = `
あなたは、ユーザーから指定された資格情報、ペルソナ情報、出題分野の配点比率に基づき、個人に最適化された学習の「ステップ」を計画し、結果をJSON形式"のみ"で返す高度なAPIです。
あなたの応答は、必ずJSONオブジェクトでなければなりません。説明、前置き、後書き、その他のテキストは一切含めないでください。

**重要：ステップの粒度について**
「ステップ」とは、個別のシラバス項目ではなく、複数の関連知識をまとめた大きな学習単位（学習フェーズやマイルストーン）を指します。例えば、「テクノロジ系の基礎固め」「マネジメント分野の集中学習」「過去問演習と総復習」といったレベルの粒度です。

**あなたのタスク:**
1.  与えられた以下の情報を考慮します。
    - 資格名
    - 学習期間（開始日と終了日）
    - 主な学習教材（`baseMaterial`）
    - 各試験分野の配点比率
    - ペルソナ（平日・休日の学習可能時間、学習の好み）
2.  **思考プロセス:**
    a. まず、与えられた試験分野とその配点を、大きなカテゴリ（例：テクノロジ系、マネジメント系、ストラテジ系など）に分類・整理します。
    b. 次に、各カテゴリの学習を1〜2個の大きな「ステップ」にまとめます。配点が高い分野は重点的に扱います。
    c. 最後に、試験に向けた実践的な演習や全体の総復習のためのステップを設けます。
3.  上記プロセスに基づき、学習全体を **必ず5〜7個** のステップに分割してください。これより多くても少なくてもいけません。
4.  ペルソナの学習可能時間や学習パターン（インプット先行かアウトプット先行か）を考慮して、各ステップのテーマや順序を調整してください。
5.  `baseMaterial` が `TEXTBOOK` の場合は教科書ベースの学習、`VIDEO` の場合はビデオ教材ベースの学習を想定したステップを計画してください。
6.  各ステップには、学習内容の要約である「テーマ」を設定します。
7.  以下のJSON仕様に厳密に従ったJSONオブジェクトを生成します。

**JSON仕様:**
- ルートオブジェクトは "steps" という名前のキーを一つだけ持つこと。
- "steps" の値は、オブジェクトの配列であること。
- 配列の各オブジェクトは、以下のキーを持つこと。
  - "title": ステップの簡潔なタイトル (string)。
  - "theme": そのステップで学習する内容の具体的なテーマや要約 (string)。
  - "index": ステップの順序を示す0から始まる整数 (number)。
- 配列は "index" の昇順でソートされていること。

**重要:** あなたの唯一の応答は、この仕様に準拠したJSONオブジェクトです。他のいかなるテキストも出力してはなりません。
`;

const responseSchema: FunctionDeclarationSchema = {
  type: 'object',
  properties: {
    steps: {
      type: 'array',
      description: '学習ステップの配列',
      items: {
        type: 'object',
        properties: {
          title: {
            type: 'string',
            description: 'ステップのタイトル',
          },
          theme: {
            type: 'string',
            description: 'ステップの学習テーマ',
          },
          index: {
            type: 'integer',
            description: 'ステップの順序 (0始まり)',
          },
        },
        required: ['title', 'theme', 'index'],
      },
    },
  },
  required: ['steps'],
};

type StepsGenerateResponse = paths["/projects/{projectId}/steps/generate"]["get"]["responses"]["200"]["content"]["application/json"];

type StepResponse = {
  steps: StepsGenerateResponse;
};

type Project = typeof projects.$inferSelect & { persona: typeof personas.$inferSelect | null };
type Weight = typeof weights.$inferSelect;

export async function generateSteps(
  project: Project,
  weights: Weight[]
): Promise<StepResponse> {
  const userPrompt = `
    以下の情報に基づいて、学習ステップを生成してください。

    - 資格名: ${project.certificationName}
    - 学習開始日: ${project.startDate}
    - 試験日: ${project.examDate}
    - 主な学習教材: ${project.baseMaterial}
    - 平日の学習可能時間: ${project.persona?.weekdayHours}時間
    - 休日の学習可能時間: ${project.persona?.weekendHours}時間
    - 学習スタイル: ${project.persona?.learningPattern}

    - 出題分野と配点:
    ${weights.map((w) => `  - ${w.area}: ${w.weightPercent}%`).join('\n')}
  `;

  // AIにリクエスト
  return await generateContentFromPrompt<StepResponse>(
    systemInstruction,
    userPrompt,
    responseSchema
  );
}
