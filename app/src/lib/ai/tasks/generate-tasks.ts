import { generateContentFromPrompt } from '../client';
import { FunctionDeclarationSchema, SchemaType } from '@google-cloud/vertexai';
import { type projects, type personas, type weights, type steps } from '@/lib/db/schema';
import { TasksGenerateResponseFromAI } from '@/types/tasks';

const systemInstruction = `
あなたは、ユーザーから提供された学習計画（資格名、ペルソナ、出題分野、ステップ）を元に、各ステップを具体的なタスクに分解し、結果をJSON形式"のみ"で返す、非常に高度な学習計画アシスタントAPIです。
あなたの応答は、必ずJSONオブジェクトでなければなりません。説明、前置き、後書き、その他のテキストは一切含めないでください。

**あなたのタスク:**
1.  以下の情報を考慮し、学習計画全体を深く理解します。
    - 資格名、学習期間全体
    - ペルソナ（学習可能な時間、学習スタイル）
    - 各試験分野の重要度（配点）
    - 大まかな学習フェーズである「ステップ」（各ステップのID、テーマ(=そのステップで達成すべき学習目標)、期間）
2.  各「ステップ」を、実行可能な単位の具体的な「タスク」に分解します。1つのステップは、だいたい3〜5個のタスクに分解されるのが理想的です。
3.  各タスクには、必ず親となるステップの \`stepId\` を含めてください。
4.  各タスクの \`startDate\` と \`endDate\` は、必ず親ステップの期間内に収まるように設定してください。タスク間で期間が重複しても構いません。
5.  ペルソナの学習可能時間（平日・休日）を考慮して、各タスクの期間（\`startDate\`から\`endDate\`までの日数）を現実的な範囲で設定してください。
6.  以下のJSON仕様に厳密に従ったJSONオブジェクトを生成します。

**JSON仕様:**
- ルートオブジェクトは "tasks" という名前のキーを一つだけ持つこと。
- "tasks" の値は、オブジェクトの配列であること。
- 配列の各オブジェクトは、以下のキーを持つこと。
  - "stepId": 親ステップのID (string, uuid)
  - "title": タスクの簡潔なタイトル (string, 50文字以内)
  - "description": タスク内容の詳細な説明 (string)
  - "startDate": タスクの開始日 (string, YYYY-MM-DD)
  - "endDate": タスクの終了日 (string, YYYY-MM-DD)
- 配列は、まず親ステップの \`index\` 順、次にタスクの \`startDate\` 順でソートされていること。

**重要:** あなたの唯一の応答は、この仕様に準拠したJSONオブジェクトです。他のいかなるテキストも出力してはなりません。
`;

const responseSchema: FunctionDeclarationSchema = {
  type: SchemaType.OBJECT,
  properties: {
    tasks: {
      type: SchemaType.ARRAY,
      description: '生成されたタスクの配列',
      items: {
        type: SchemaType.OBJECT,
        properties: {
          stepId: {
            type: SchemaType.STRING,
            description: '親ステップのID',
          },
          title: {
            type: SchemaType.STRING,
            description: 'タスクのタイトル',
          },
          description: {
            type: SchemaType.STRING,
            description: 'タスク内容の詳細な説明',
          },
          startDate: {
            type: SchemaType.STRING,
            description: 'タスクの開始日 (YYYY-MM-DD)',
          },
          endDate: {
            type: SchemaType.STRING,
            description: 'タスクの終了日 (YYYY-MM-DD)',
          },
        },
        required: ['stepId', 'title', 'description', 'startDate', 'endDate'],
      },
    },
  },
  required: ['tasks'],
};

// DBから取得する型
type Project = typeof projects.$inferSelect & {
  persona: typeof personas.$inferSelect | null;
  weights: (typeof weights.$inferSelect)[];
  steps: (typeof steps.$inferSelect)[];
};

export async function generateTasks(
  project: Project
): Promise<TasksGenerateResponseFromAI> {
  const userPrompt = `
    以下の情報に基づいて、各ステップを具体的なタスクに分解してください。

    # プロジェクト概要
    - 資格名: ${project.certificationName}
    - 学習開始日: ${project.startDate}
    - 試験日: ${project.examDate}
    - 主な学習教材: ${project.baseMaterial}

    # ペルソナ
    - 平日の学習可能時間: ${project.persona?.weekdayHours}時間
    - 休日の学習可能時間: ${project.persona?.weekendHours}時間
    - 学習スタイル: ${project.persona?.learningPattern}

    # 出題分野と配点
    ${project.weights.map((w) => `  - ${w.area}: ${w.weightPercent}%`).join('\n')}

    # 学習ステップ
    ${project.steps
      .map(
        (s) =>
          `  - stepId: ${s.stepId}
    title: ${s.title}
    theme: ${s.theme}
    startDate: ${s.startDate}
    endDate: ${s.endDate}`
      )
      .join('\n\n')}
  `;

  return await generateContentFromPrompt<TasksGenerateResponseFromAI>(
    systemInstruction,
    userPrompt,
    responseSchema
  );
}
