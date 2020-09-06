import { ObjectLiteral } from '@jamashita/publikum-type';

export type RequestBodyKV = Readonly<{
  buffer: Buffer;
  json: ObjectLiteral;
  text: string;
}>;

export type RequestResponseType = keyof RequestBodyKV;

export type RequestResponse<T extends RequestResponseType> = Readonly<{
  status: number;
  body: RequestBodyKV[T];
}>;
