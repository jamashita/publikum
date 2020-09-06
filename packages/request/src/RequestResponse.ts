export type RequestResponse<T = Buffer> = Readonly<{
  status: number;
  body: T;
}>;
