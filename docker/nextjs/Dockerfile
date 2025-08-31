# Node.js 22のベースイメージを使用
FROM node:22-alpine

# 作業ディレクトリを設定
WORKDIR /app

# package.jsonとpackage-lock.jsonをコピー
COPY app/package*.json ./

# 依存関係をインストール
RUN npm install

# ソースコードをコピー
COPY app/ .

# ポート3000を公開
EXPOSE 3000

# 開発サーバーを起動
CMD ["npm", "run", "dev"]