import { ObjectLiteral } from '@jamashita/publikum-type';

export type ResponseKV = Readonly<{
  json: ObjectLiteral;
  byte: Buffer;
  raw: string;
}>;

export type ResponseType = keyof ResponseKV;

export type RequestResponse<T extends ResponseType> = Readonly<{
  status: number;
  body: ResponseKV[T];
}>;
