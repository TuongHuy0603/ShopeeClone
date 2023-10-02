export interface SuccessResponse<Data> {
  message: string
  data: Data
}
export interface ErrorResponse<Data> {
  message: string
  data?: Data
}

export type NoUndefinedFiled<T> = {
  [P in keyof T]-?: NoUndefinedFiled<NonNullable<T[P]>>
}
