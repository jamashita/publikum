import { ObjectLiteral } from '@jamashita/publikum-type';
import { RequestResponse } from '../RequestResponse';

export interface IRequest {
  get(url: string): Promise<RequestResponse>;

  post(url: string, payload?: ObjectLiteral): Promise<RequestResponse>;

  put(url: string, payload?: ObjectLiteral): Promise<RequestResponse>;

  delete(url: string): Promise<RequestResponse>;

  head(url: string): Promise<RequestResponse<null>>;
}
