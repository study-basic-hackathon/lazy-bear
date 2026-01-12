import { Result } from "./Result";
import ApiError from "./ApiError";

export function handleApiResult<T>(
  result: Result<T, ApiError>,
  onSuccess: (value: T) => void,
  onError: (error: { message: string }) => void
): void {

  if (result.success) {
    return onSuccess(result.value);
  }

  const error = result.error;
  if (error.cause) {
    console.error("Error", error.cause);
  }

  switch (error.code) {
    case "VALIDATION_ERROR":
      onError({ message: error.message });
      return;

    case "NOT_FOUND":
      onError({ message: error.message });
      return;

    case "INTERNAL_ERROR":
      onError({ message: error.message });
      return;

    case "UNEXPECTED_ERROR":
    default:
      onError({ message: "予期しないエラーが発生しました" });
      return;
  }
};