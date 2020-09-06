export type AJAXBodyKV = Readonly<{
  arraybuffer: ArrayBuffer;
  blob: Blob;
  json: string;
  text: string;
}>;

export type AJAXResponseType = keyof AJAXBodyKV;

export type AJAXResponse<T extends AJAXResponseType> = Readonly<{
  status: number;
  body: AJAXBodyKV[T];
}>;
