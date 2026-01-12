import type { Result } from "@/frontend/utils/Result";
import type { ProjectApiDto, ProjectCreateApiDto } from "../types/api/project";
import { apiClient } from "./utils/apiClient";
import  { success, fail } from "@/frontend/utils/Result";
import ApiError from "@/frontend/utils/ApiError";

export async function getProjectList(
  personaId: string
): Promise<Result<ProjectApiDto[], ApiError>> {
  try {
    const { response, data } = await apiClient.GET(
      "/api/personas/{personaId}/projects",
      { params: { path: { personaId } } });

    switch (response.status) {
      case 201: {
        if (!data) {
          return fail(ApiError.unexpectedError("projectId missing"));
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

export async function postProject(
  personaId: string,
  payload: ProjectCreateApiDto
): Promise<Result<string, ApiError>> {
  try {
    const { response, data } = await apiClient.POST(
      "/api/personas/{personaId}/projects",
      { params: { path: { personaId } }, body: payload });

    switch (response.status) {
      case 201: {
        if (!data) {
          return fail(ApiError.unexpectedError("projectId missing"));
        }
        return success(data.id);
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