import ApiError from "../utils/ApiError";
import type { StepCreateApiDto } from "../types/api/step";
import { Result } from "../utils/Result"
import { apiClient } from "./utils/apiClient"
import { success, fail } from "../utils/Result";

export async function generateSteps(
  projectId: string
): Promise<Result<StepCreateApiDto[], ApiError>> {
  try {
    const { data, response } = await apiClient.GET(
      "/api/projects/{projectId}/steps/generate",
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

export async function postSteps(
  projectId: string,
  payload: StepCreateApiDto[]
): Promise<Result<string[], ApiError>> {
  try {
    const { data, response } = await apiClient.POST(
      "/api/projects/{projectId}/steps",
      { params: { path: { projectId } }, body: payload }
    );

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
