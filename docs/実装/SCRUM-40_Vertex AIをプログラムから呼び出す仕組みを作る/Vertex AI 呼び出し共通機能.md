# Vertex AI 呼び出し共通機能

## 概要

Vertex AI の生成モデルを呼び出すための共通機能と、それを利用した学習計画生成のデモ機能の実装です。

## フォルダ構成

```
app/src/lib/ai/
├── client.ts      # Vertex AI 呼び出しの共通クライアント
└── demo/
    ├── demo-generate-plan.ts         # 学習計画生成のデモ機能
    └── prompts/
        └── generate-learning-plan.txt  # 学習計画生成用のシステムプロンプト
```

## 共通機能の呼び出し方

`app/src/lib/ai/client.ts` に定義されている `generateContentFromPrompt` 関数を利用することで、任意のシステムプロンプトとユーザープロンプトからJSON形式のレスポンスを生成できます。

### `generateContentFromPrompt` 関数

- **引数:**
  1.  `systemInstruction` (string): モデルに与えるシステムプロンプト。
  2.  `userPrompt` (string): ユーザーからの入力となるプロンプト。
- **返り値:**
  - `Promise<any>`: Vertex AIからのレスポンスをJSONとしてパースしたオブジェクト。

### 使用例

以下は、`demo-generate-plan.ts` で実際に `generateContentFromPrompt` を使用している例です。

```typescript
import { generateContentFromPrompt } from '../client';
import fs from 'fs';
import path from 'path';

// 1. システムプロンプトをファイルから読み込む
const generateLearningPlanPrompt = fs.readFileSync(
  path.join(process.cwd(), 'src/lib/ai/demo/prompts/generate-learning-plan.txt'),
  'utf-8'
);

export async function generateLearningPlan(
  qualificationName: string,
  deadline: string
) {
  // 2. ユーザープロンプトを生成する
  const userPrompt = `
    資格名: ${qualificationName}
    合格期限: ${deadline}

    上記の資格に合格するための学習計画を生成してください。
  `;

  // 3. 共通関数を呼び出し、結果を返す
  return await generateContentFromPrompt(
    generateLearningPlanPrompt,
    userPrompt
  );
}
```