import { VertexAI } from '@google-cloud/vertexai';

/**
 * Vertex AIのクライアントを初期化します。
 * 環境変数 `GOOGLE_CLOUD_PROJECT` と `GOOGLE_CLOUD_LOCATION` を使用します。
 */
const getVertexAIClient = () => {
  const project = process.env.GOOGLE_CLOUD_PROJECT;
  const location = process.env.GOOGLE_CLOUD_LOCATION;

  if (!project || !location) {
    throw new Error(
      '環境変数 GOOGLE_CLOUD_PROJECT と GOOGLE_CLOUD_LOCATION が設定されていません。'
    );
  }

  return new VertexAI({ project, location });
};

/**
 * 指定されたシステムプロンプトを持つ生成モデルを取得します。
 * モデル名は環境変数 `VERTEX_AI_MODEL_NAME` から取得します。
 *
 * @param systemInstruction システムプロンプトのテキスト
 * @returns Vertex AIの生成モデルインスタンス
 */
export const getGenerativeModel = (systemInstruction?: string) => {
  const vertexAI = getVertexAIClient();
  const modelName = process.env.VERTEX_AI_MODEL_NAME || 'gemini-2.5-flash-lite'; // デフォルトモデル

  return vertexAI.getGenerativeModel({ model: modelName, systemInstruction });
};

/**
 * プロンプトに基づいてコンテンツを生成し、JSONとして解析します。
 * @param systemInstruction システムプロンプト
 * @param userPrompt ユーザープロンプト
 * @returns 解析されたJSONオブジェクト
 */
export const generateContentFromPrompt = async (
  systemInstruction: string,
  userPrompt: string
) => {
  const generativeModel = getGenerativeModel(systemInstruction);

  try {
    const resp = await generativeModel.generateContent({
      contents: [
        {
          role: 'user',
          parts: [{ text: userPrompt }],
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
    throw new Error('コンテンツの生成に失敗しました。');
  }
};
