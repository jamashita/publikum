export type RequestResponse<T> = Readonly<{
  status: number;
  body: T;
}>;
