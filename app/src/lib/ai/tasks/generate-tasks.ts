import { generateContentFromPrompt } from '../client';
import { FunctionDeclarationSchema, SchemaType } from '@google-cloud/vertexai';
import { type projects, type personas, type weights, type steps } from '@/lib/db/schema';
import { TasksGenerateResponseFromAI } from '@/types/tasks';

const systemInstruction = `
# 思考のレンズ

## 出力前に必ず以下を確認する
  - 各ステップに含まれる全タスクは MECE に分割されているか？
  - description は「具体化された名詞 + 最大限定量化された動詞」で構成されているか？
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
- 説明: プロジェクトの**主な学習教材を基に動詞を生成**する。
- 生成ルール:
  1. theme を達成するために最も効果的なタスクを生成する。
  2. 各タスクが何の役割を担うか description で説明する。
  3. 学習スタイルに沿ったタスク順序にする。
  4. タスクは各ステップが定める内容を **全て網羅し、MECE に分割** されなければならない。
  5. タスクはステップの概要を基準に生成される。
  7. 各タスクの title の目的語は 1 つとし、冗長や重複は一切許されない。

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
2. description の記述ルール:
    - 各タスクで行う内容を **20〜30文字以内** で説明する。
    - 絶対に**学ぶ対象であるtitleの名詞は分解され**、タスクの概要が説明される。</br>
      例えば、titleに"AWSの基本概念"という名詞が入った場合、**絶対にdescriptionでは"AWSの基本概念"という名詞を使用できない。**</br>
      その代わり、**名詞を1段階具体化した内容（プライベート・パブリックサブネットの違いを図示する、RDBでの各正規化の違いを50字でまとめる）**を記載する。
    - 絶対に**学ぶ行動であるdescriptionの動詞は分解され**、タスクの概要が説明される。</br>
      例えば、**「理解する」「学ぶ」「確認する」はタスクの目的であって、絶対に行うべき行動として指定できない**</br>
      その代わりに、**「〜を図示する」「〜を要約する」「〜を比較する」「〜を実装する」など、理解や学習のために行う具体的な動作を表す動詞**を用いること。
3. title は **10文字以内** で記述する。
4. 各タスクの開始日と終了日は、必ず親ステップの期間内に収まるように設定する。
5. タスクの期日は必ず一意に設定されるべきであり、**同一日に複数のタスクを割り当ててはならない**。
6. 各ステップの期間は必ずタスクで満たされ、**期間内に未割り当ての空白日を設けてはならない**。

### 出力形式
- JSON形式で出力する
- タスクの配列は親ステップのindexを昇順した後、タスクのstartDateを昇順で並べる。
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
       `- stepId: ${s.stepId}
        - ステップ名: ${s.title}
        - ステップの概要: ${s.theme}
        - 開始日: ${s.startDate}
        - 終了日: ${s.endDate}`
      )
      .join('\n\n')}
  `;

  return await generateContentFromPrompt<TasksGenerateResponseFromAI>(
    systemInstruction,
    userPrompt,
    responseSchema
  );
}
