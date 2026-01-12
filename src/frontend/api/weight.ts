import ApiError from "../utils/ApiError";
import type { WeightCreateApiDto } from "../types/api/weight";
import { Result } from "../utils/Result"
import { apiClient } from "./utils/apiClient"
import { success, fail } from "../utils/Result";

export async function generateWeights(
  projectId: string
): Promise<Result<WeightCreateApiDto[], ApiError>> {
  try {
    const { data, response } = await apiClient.GET(
      "/api/projects/{projectId}/weights/generate",
      { params: { path: { projectId } } });

    switch (response.status) {
      case 201: {
        if (!Array.isArray(data) || data.length === 0) {
          return fail(ApiError.unexpectedError("配点割合生成に失敗しました"));
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

export async function postWeights(
  projectId: string,
  payload: WeightCreateApiDto[]
): Promise<Result<string[], ApiError>> {
  try {
    const { data, response } = await apiClient.POST(
      "/api/projects/{projectId}/weights",
      { params: { path: { projectId } }, body: payload } );

    switch (response.status) {
      case 201: {
        if (!data) {
          return fail(ApiError.unexpectedError("weightId missing"));
        }
        return success(data.weightIds);
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