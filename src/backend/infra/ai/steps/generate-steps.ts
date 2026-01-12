import { generateContentFromPrompt } from '../client';
import { FunctionDeclarationSchema, SchemaType } from '@google-cloud/vertexai';
import { type projects, type personas } from '@/backend/infra/db/schema';
import { type weights } from '@/backend/infra/db/schema/weights';
import { paths } from '@/contracts/api';

const systemInstruction = `
# 思考のレンズ

## 出力前に必ず以下を確認する
  - 全ステップが MECE で網羅されているか？
  - title, themeは日本語で出力されているか？

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
1. 全数は **必ず3個以上7個以下** である。
2. description は **必ず動詞で終える**。
3. description は必ず **20〜30文字以内** で記述する。

### ステップ
1. 全数は **必ず3個以上10個以下** である。
2. 各ステップは出題分野に基づき、スキルや能力による分類は禁止する。
3. theme は必ず **80〜100文字以内** で記述する。
4. 必ず最初に「資格勉強の準備期間」に相当するステップを設ける。
5. 必ず最後から2番目に「総合演習期間」に相当するステップを設ける。
6. 必ず最後に「試験日」に相当するステップを設け、期間は1日でなければならない。
7. theme の記述ルール:
    - 各ステップで行う内容を **50文字以上80文字以下** で説明する。
    - 絶対に**学ぶ対象であるtitleの名詞は分解され**、ステップの概要が説明される。</br>
      例えば、titleに"科目A"という名詞が入った場合、**絶対にthemeでは"科目A"という名詞を使用できない。**</br>
      その代わり、**名詞を1段階具体化した内容（ネットワークのサブネット概要理解、RDBでのテーブル設計の概要理解等）**を記載する。

### 出力形式
- Json配列は "index" を 0 スタートかつ昇順でソートする。
`;

const responseSchema: FunctionDeclarationSchema = {
  type: SchemaType.OBJECT,
  properties: {
    steps: {
      type: SchemaType.ARRAY,
      description: '学習ステップの配列',
      items: {
        type: SchemaType.OBJECT,
        properties: {
          title: {
            type: SchemaType.STRING,
            description: 'ステップのタイトル',
          },
          theme: {
            type: SchemaType.STRING,
            description: 'そのステップで達成すべき学習目標',
          },
          index: {
            type: SchemaType.INTEGER,
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
  ## 指示
  - 以下の情報に基づいて、学習ステップを生成してください。

  ## 各情報
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
