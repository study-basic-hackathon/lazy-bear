export type Result<T, E> = Success<T> | Failure<E>;
export const success = <T>(value: T): Success<T> => ({ success: true, value });
export const fail = <E>(error: E): Failure<E> => ({ success: false, error });

interface Success<T> {
  readonly success: true,
  readonly value: T,
  error?: never,
};

interface Failure<E> {
  readonly success: false,
  readonly error: E,
  value?: never,
};