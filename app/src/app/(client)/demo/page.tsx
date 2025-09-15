'use client';

import { useState } from 'react';
import { LearningPlan } from '@/types/demo';

export default function DemoPage() {
  const [qualificationName, setQualificationName] = useState('応用情報技術者試験');
  const [deadline, setDeadline] = useState('2025-10-19');
  const [response, setResponse] = useState<LearningPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const res = await fetch('/api/demo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ qualificationName, deadline }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || `HTTPエラー: ${res.status}`);
      }

      const data = await res.json();
      setResponse(data);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '不明なエラーが発生しました。';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Vertex AI 学習計画ジェネレーター (デモ)</h1>

      <form onSubmit={handleSubmit} className="space-y-4 mb-8 p-4 border rounded-lg">
        <div>
          <label htmlFor="qualificationName" className="block text-sm font-medium text-gray-700">
            資格名
          </label>
          <input
            id="qualificationName"
            type="text"
            value={qualificationName}
            onChange={(e) => setQualificationName(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>
        <div>
          <label htmlFor="deadline" className="block text-sm font-medium text-gray-700">
            期限
          </label>
          <input
            id="deadline"
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {loading ? '生成中...' : '学習計画を生成'}
        </button>
      </form>

      {error && (
        <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
          <span className="font-medium">エラー:</span> {error}
        </div>
      )}

      {response && (
        <div>
          <h2 className="text-xl font-semibold mb-2">生成された計画 (JSON)</h2>
          <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
            {JSON.stringify(response, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
