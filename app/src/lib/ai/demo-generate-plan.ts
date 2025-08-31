import { VertexAI } from '@google-cloud/vertexai';

// Vertex AIのクライアントを初期化
const vertex_ai = new VertexAI({
  project: process.env.GOOGLE_CLOUD_PROJECT || '',
  location: process.env.GOOGLE_CLOUD_LOCATION || 'us-central1', // デフォルト明示
});

const model = 'gemini-2.5-flash-lite'; // 使用するモデル

// 生成モデルを初期化
const generativeModel = vertex_ai.getGenerativeModel({
  model,
  systemInstruction: {
    parts: [
      {
        text: `あなたは優秀な学習プランナーです。\nユーザーが指定した資格と期限に基づき、現実的で詳細な学習計画をステップとタスクの形式で生成してください。\n\n出力は必ず以下のJSON形式に従ってください。他の形式は許可しません。\n\n\
{
  \"steps\": [
    {
      \"id\": 1,
      \"title\": \"ステップのタイトル\",
      \"tasks\": [
        {
          \"id\": 1,
          \"title\": \"タスクのタイトル\",
          \"description\": \"タスクの詳細な説明\",
          \"startDate\": \"YYYY-MM-DD\",
          \"endDate\": \"YYYY-MM-DD\"
        }
      ]
    }
  ]
}\n\
`,
      },
    ],
  },
});

/**
 * 【デモ用】資格名と期限に基づいて学習計画を生成します。
 * @param qualificationName 資格名
 * @param deadline 期限 (YYYY-MM-DD)
 * @returns 生成された学習計画のJSONオブジェクト
 */
export async function generateLearningPlan(qualificationName: string, deadline: string) {
  const prompt = `
    資格名: ${qualificationName}
    合格期限: ${deadline}

    上記の資格に合格するための学習計画を生成してください。
  `;

  try {
    // Node.js SDK では string ではなく contents を渡す
    const resp = await generativeModel.generateContent({
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }],
        },
      ],
    });

    const responseText = resp.response.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!responseText) {
      throw new Error('Vertex AIからの有効な応答がありませんでした。');
    }

    // クリーンなJSONをパースする
    const jsonString = responseText.replace(/```json\n?|```/g, '').trim();
    return JSON.parse(jsonString);

  } catch (error) {
    console.error('Vertex AIの呼び出し中にエラーが発生しました:', error);
    throw new Error('学習計画の生成に失敗しました。');
  }
}
