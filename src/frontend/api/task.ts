import ApiError from "../utils/ApiError";
import { Result } from "../utils/Result"
import { apiClient } from "./utils/apiClient"
import { success, fail } from "../utils/Result";

export async function generateTasks(
  projectId: string
): Promise<Result<string[], ApiError>> {
  try {
    const { data, response } = await apiClient.POST(
      "/api/projects/{projectId}/tasks/generate",
      { params: { path: { projectId } } });

    switch (response.status) {
      case 201: {
        if (!Array.isArray(data) || data.length === 0) {
          return fail(ApiError.unexpectedError("ステップの生成に失敗しました"));
        }
        return success(data);
      }

      case 400:
        return fail(ApiError.validationError());

      case 500:
        return fail(ApiError.internalError());

      default:
        return fail(ApiError.unexpectedError());
    }
  } catch (e: unknown) {
    console.error(e);
    return fail(ApiError.unexpectedError(`${e}`));
  }
}