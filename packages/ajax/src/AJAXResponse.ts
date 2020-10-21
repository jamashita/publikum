import { ObjectLiteral } from '@jamashita/publikum-type';

type AJAXBodyKV = Readonly<{
  arraybuffer: ArrayBuffer;
  blob: Blob;
  json: ObjectLiteral;
  text: string;
}>;

export type AJAXResponseType = keyof AJAXBodyKV;

export type AJAXResponse<T extends AJAXResponseType> = Readonly<{
  status: number;
  body: AJAXBodyKV[T];
}>;
