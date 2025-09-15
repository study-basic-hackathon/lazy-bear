import { paths } from './apiSchema';

/**
 * AIから返される単一のタスクオブジェクトの型
 */
export type TaskFromAI = {
  stepId: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
};

/**
 * /tasks/generate のAIレスポンス全体の型
 */
export type TasksGenerateResponseFromAI = {
  tasks: TaskFromAI[];
};

/**
 * POST /projects/{projectId}/tasks/generate のAPIレスポンスの型
 */
export type TasksGenerateApiResponse = paths['/projects/{projectId}/tasks/generate']['post']['responses']['201']['content']['application/json'];