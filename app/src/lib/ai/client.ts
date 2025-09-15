import { VertexAI, FunctionDeclarationSchema, GenerateContentRequest, Tool } from '@google-cloud/vertexai';

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
  const modelName = process.env.VERTEX_AI_MODEL_NAME || 'gemini-1.5-flash-001'; // デフォルトモデル

  return vertexAI.getGenerativeModel({ model: modelName, systemInstruction });
};

/**
 * プロンプトに基づいてコンテンツを生成し、JSONとして解析します。
 * @param systemInstruction システムプロンプト
 * @param userPrompt ユーザープロンプト
 * @param responseSchema レスポンスのJSONスキーマ
 * @returns 解析されたJSONオブジェクト
 */
export const generateContentFromPrompt = async <T>(
  systemInstruction: string,
  userPrompt: string,
  responseSchema?: FunctionDeclarationSchema,
  tools?: Tool[]
): Promise<T> => {
  console.log('--- System Instruction ---');
  console.log(systemInstruction);
  console.log('--- User Prompt ---');
  console.log(userPrompt);

  const request: GenerateContentRequest = {
    contents: [
      {
        role: 'user',
        parts: [{ text: userPrompt }],
      },
    ],
    tools,
  };

  const useSearchTool = tools?.some(tool => 'google_search' in tool);

  if (responseSchema && !useSearchTool) { // 検索ツールがない場合のみ function calling を使う
    const functionTool: Tool = {
      functionDeclarations: [
        {
          name: 'json_output',
          description: 'Formats the output as a JSON object based on the provided schema.',
          parameters: responseSchema,
        },
      ],
    };
    request.tools = request.tools ? [...request.tools, functionTool] : [functionTool];
    request.generationConfig = {
      responseMimeType: 'application/json',
    };
  } else if (responseSchema && useSearchTool) {
    // 検索ツールとスキーマが両方ある場合、システムプロンプトにJSON形式を強制する指示を追加
    systemInstruction += '\n\nIMPORTANT: Your output MUST be a single, valid JSON object that conforms to the provided schema. Do not include any other text, markdown, or explanations. The entire response should be only the JSON object.';
  }

  const generativeModel = getGenerativeModel(systemInstruction);

  try {
    const resp = await generativeModel.generateContent(request);
    const functionCall = resp.response.candidates?.[0]?.content?.parts?.[0]?.functionCall;

    if (functionCall?.args) {
      console.log("--- AI Response (Function Call) ---");
      console.log(JSON.stringify(functionCall.args, null, 2));
      return functionCall.args as T;
    }

    // フォールバック：functionCallがない場合は、テキストを解析しようと試みる
    const responseText = resp.response.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!responseText) {
      console.error("Vertex AI did not return a text response. Full response:", JSON.stringify(resp.response, null, 2));
      throw new Error('Vertex AIからの有効な応答がありませんでした。');
    }
    // AIの応答からJSONオブジェクト部分を抽出する
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("AI response did not contain a valid JSON object string. Response text:", responseText);
      throw new Error('AIの応答に有効なJSON文字列が含まれていませんでした。');
    }
    const jsonString = jsonMatch[0];
    const parsedJson = JSON.parse(jsonString);
    console.log("--- AI Response (Parsed Text) ---");
    console.log(JSON.stringify(parsedJson, null, 2));
    return parsedJson as T;

  } catch (error) {
    console.error('Vertex AIの呼び出し中にエラーが発生しました:', error);
    throw new Error('コンテンツの生成に失敗しました。');
  }
};