# Gemini CLI セットアップ方法

## 前提条件

- [Google Cloud SDK](https://cloud.google.com/sdk/docs/install) がローカル環境にインストールされていること。

---

以下はGemini CLIのセットアップ手順です。

1.  **プロジェクト一覧の表示**
    ```bash
    gcloud projects list
    ```

2.  **デフォルトプロジェクトの設定**
    ```bash
    gcloud config set project PROJECT_ID
    ```
    *`PROJECT_ID`は各自のプロジェクトIDに置き換えてください。*

3.  **Gemini CLIのインストール**
    ```bash
    npm install -g @google/gemini-cli
    ```

4.  **アプリケーションのデフォルト認証**
    ```bash
    gcloud auth application-default login
    ```

5.  **認証**
    ブラウザが起動し、認証画面が表示されます。必要な項目にすべてチェックを入れて認証を完了してください。

6.  **Gemini CLIの起動**
    ```bash
    gemini
    ```
    初回起動時に、使用するサービスを選択するプロンプトが表示されますので、`Vertex AI` を選択してください。
