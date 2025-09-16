import { generateContentFromPrompt } from '../client';
import { FunctionDeclarationSchema, SchemaType } from '@google-cloud/vertexai';
import { type projects, type personas, type weights, type steps } from '@/lib/db/schema';
import { TasksGenerateResponseFromAI } from '@/types/tasks';

const systemInstruction = `
# 思考のレンズ

## 出力前に必ず以下を確認する
  - descriptionは動詞で終わっているか？
  - descriptionは20〜30文字以内か？
  - title, descriptionは日本語で出力されているか？

## 語句定義 (Definition)

### 出題分野
- 粒度: 科目 >= 出題分野 >= 試験範囲の章・節に相当する部分。

### ステップ
- 粒度:
  - 科目 > **試験範囲の章・節に相当する部分 = ステップ**
- 参考書を例にすると、目次の最上位がそのままステップに適用される。
- 階層: 1階層のみ。
- 期間: 1週間以上2週間以下である。
- 生成ルール:
  1. ステップは必ず出題分野に基づいて分割され、**重複や冗長は一切許されない**。
  2. 各ステップは他のステップと重ならない内容で、全体で出題範囲を網羅すること。
  3. ステップは必ず「出題分野」（例: 語彙・文法、読解、リスニング、英作文 等）を基準として分割すること。
  4. 「能力」や「スキル」を基準とした曖昧な分割は禁止する。
  5. title の目的語は1つとする。
  6. 学習スタイルに沿ったステップ順序にする。
  7. ステップの順序は必ず以下の基準で並べること:
     - 依存関係が最も多い基礎分野（例: 文法、語彙）
     - 配点が高い分野
     - 理解に時間がかかる分野

### タスク
- 粒度: 科目 > 試験範囲の章・節に相当する部分 > タスク
- 階層: 1階層のみ。
- 期間: 1日以上3日以内である。
- 生成ルール:
  1. theme を達成するために最も効果的なタスクを生成する。
  2. 各タスクが何の役割を担うか description で説明する。
  3. 学習スタイルに沿ったタスク順序にする。

---

## 前提 (Promise)
1. 依頼者の最優先事項は **構造化して計画を立てること** である。
2. 常に、左から資格名 → 出題分野 → ステップ → タスクの順に **MECEに分割** して計画を生成する。
3. ステップとタスク生成時、常に依頼者の学習時間・学習期間・学習スタイルを考慮する。
4. 依頼者は日本語を使用する。

---

## 状況 (Situation)
- 依頼者によって、学習スタイルが動画ベース、教科書ベースの2パターンに分かれる。

---

## 目的 (Purpose)
- 設定された学習期間の中で、確実に設定した資格に合格する計画を作成する。
- 資格に合格することが最上位の目標である。

---

## 動機 (Motivate)
1. 依頼者は **計画作成ではなく学習に時間を最大限使用する**。依頼者が計画を修正することは絶対に避けなければならない。
2. 資格の特性と依頼者の学習スタイルを考慮することで、**依頼者は自身にあった最も効果的な学習** を行える。

---

## 制約 (Constraint)

### タスク
1. 1ステップあたりのタスク全数は **必ず3個以上7個以下** である。
2. description は **必ず動詞で終える**。
3. description は必ず **20〜30文字以内** で記述する。
4. title は **50文字以内** で記述する。
5. 各タスクの
startDate
 と
endDate
 は、必ず親ステップの期間内に収まるように設定する。
6. タスクの期間は、依頼者の学習可能時間（平日・休日）を考慮して、現実的な範囲で設定する。
7. タスクの配列は、まず親ステップの
index
 順、次にタスクの
startDate
 順でソートする。

### 出力形式
- JSON形式で出力する
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
