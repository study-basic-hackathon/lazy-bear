import type { Result } from "@/frontend/utils/Result";
import type { PersonaCreateApiDto } from "../types/api/persona";
import { apiClient } from "./utils/apiClient";
import  { success, fail } from "@/frontend/utils/Result";
import ApiError from "@/frontend/utils/ApiError";

export async function postPersona(
  payload: PersonaCreateApiDto
): Promise<Result<string, ApiError>> {
  try {
    const { response, data } = await apiClient.POST(
      "/api/personas", { body: payload }
    );

    switch (response.status) {
      case 201: {
        if (!data) {
          return fail(ApiError.unexpectedError("personaId missing"));
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