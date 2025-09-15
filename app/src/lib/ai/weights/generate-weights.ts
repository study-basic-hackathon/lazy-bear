import { generateContentFromPrompt } from '../client';
import { FunctionDeclarationSchema, SchemaType } from '@google-cloud/vertexai';
import { paths } from '@/types/apiSchema';

const systemInstruction = `
# 思考のレンズ

## 出力前に必ず以下を確認する
- 各分野の weightPercent の合計が 100 になっているか？
- **weightが0以下のJsonは生成しない**ようになっているか？

---

## 語句定義 (Definition)

### 出題分野
- 粒度: 科目 >= 出題分野 >= 試験範囲の章・節に相当する部分。

---

## 前提 (Premise)
1. 依頼者の最優先事項は **資格学習計画の構造化** である。
2. 出題分野と配点比率を正確に反映することが、計画全体の土台となる。
3. 依頼者は日本語を使用する。

---

## 状況 (Situation)
- 依頼者は資格試験に向けた学習計画を立てており、まず出題分野と配点を正しく把握する必要がある。

---

## 目的 (Purpose)
- 指定された資格に基づき、出題分野と配点比率を返すこと。

---

## 動機 (Motive)
- 学習者は「計画修正」ではなく「学習」に集中すべきである。
- よってAIは、ユーザが手直し不要な **正確かつ一貫性ある分野分割と配点** を提示しなければならない。

---

## 制約 (Constraint)
1. **配列構造**
   * 配列は必ず **2分野以上** を含む。

2. **weightPercent**
   * 各分野の "weightPercent" は必ず **1〜100 の整数値**。
   * 0 以下や小数は禁止。
   * "weightPercent" の合計は **必ず100** とする。

3. **area**
   * "area" は必ず **最新かつ公式が公開している出題分野名称** と完全一致させる。
   * 誤字脱字は修正し、曖昧な表現は禁止。
   * "area" の値は **必ず日本語で記述**する。

4. **出力形式**
   * 応答は **JSON のみ** とし、補足テキストを一切含めない。
`;

const responseSchema: FunctionDeclarationSchema = {
  type: SchemaType.OBJECT,
  properties: {
    weights: {
      type: SchemaType.ARRAY,
      description: '試験分野と配点比率の配列',
      items: {
        type: SchemaType.OBJECT,
        properties: {
          area: {
            type: SchemaType.STRING,
            description: '試験分野名',
          },
          weightPercent: {
            type: SchemaType.INTEGER,
            description: '配点比率（%）',
          },
        },
        required: ['area', 'weightPercent'],
      },
    },
  },
  required: ['weights'],
};

type WeightsGenerateResponse = paths["/projects/{projectId}/weights/generate"]["get"]["responses"]["200"]["content"]["application/json"];

type WeightResponse = {
  weights: WeightsGenerateResponse;
};

export async function generateWeights(
  certificationName: string
): Promise<WeightResponse> {
  const userPrompt = `
  ## 指示
  - 指定した資格の出題分野と配点比率を生成してください。

  ## 資格
  - ${certificationName}
  `;

  // AIにリクエスト
  return await generateContentFromPrompt<WeightResponse>(
    systemInstruction,
    userPrompt,
    responseSchema
  );
}
