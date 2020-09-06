import { ObjectLiteral } from '@jamashita/publikum-type';
import { AJAXResponse, AJAXResponseType } from '../AJAXResponse';

export interface IAJAX<T extends AJAXResponseType> {
  get(url: string): Promise<AJAXResponse<T>>;

  post(url: string, payload?: ObjectLiteral): Promise<AJAXResponse<T>>;

  put(url: string, payload?: ObjectLiteral): Promise<AJAXResponse<T>>;

  delete(url: string): Promise<AJAXResponse<T>>;

  head(url: string): Promise<AJAXResponse<T>>;
}
