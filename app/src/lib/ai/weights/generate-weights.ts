import { generateContentFromPrompt } from '../client';
import { FunctionDeclarationSchema } from '@google-cloud/vertexai';
import { paths } from '@/types/apiSchema';

const systemInstruction = `
あなたは、ユーザーから指定された資格の出題分野と配点比率を分析し、結果をJSON形式"のみ"で返す高度なAPIです。
あなたの応答は、必ずJSONオブジェクトでなければなりません。説明、前置き、後書き、その他のテキストは一切含めないでください。

**あなたのタスク:**
1.  Web検索ツールを使い、指定された資格の公式サイトや信頼できる情報源から、出題分野と配点比率を調査します。
2.  調査結果に基づき、以下の仕様に厳密に従ったJSONオブジェクトを生成します。

**JSON仕様:**
- ルートオブジェクトは "weights" という名前のキーを一つだけ持つこと。
- "weights" の値は、オブジェクトの配列であること。
- 配列の各オブジェクトは、以下のキーを持つこと。
  - "area": 試験分野名 (string)
  - "weightPercent": 配点比率 (number)。パーセント記号は含めない数値。
- 必ず3つ以上の分野を生成すること。
- 各分野の "weightPercent" の合計が100になるように調整すること。

**重要:** あなたの唯一の応答は、この仕様に準拠したJSONオブジェクトです。他のいかなるテキストも出力してはなりません。
`;

const responseSchema: FunctionDeclarationSchema = {
  type: 'object',
  properties: {
    weights: {
      type: 'array',
      description: '試験分野と配点比率の配列',
      items: {
        type: 'object',
        properties: {
          area: {
            type: 'string',
            description: '試験分野名',
          },
          weightPercent: {
            type: 'integer',
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
    資格名: ${certificationName}
    上記の資格の出題分野と配点比率を分析してください。
  `;

  // GoogleSearchツールを有効にしてAIにリクエスト
  return await generateContentFromPrompt<WeightResponse>(
    systemInstruction,
    userPrompt,
    responseSchema,
    [{ googleSearch: {} }]
  );
}