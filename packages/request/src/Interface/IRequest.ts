import { ObjectLiteral } from '@jamashita/publikum-type';
import { RequestResponse, RequestResponseType } from '../RequestResponse';

export interface IRequest<T extends RequestResponseType> {
  get(url: string): Promise<RequestResponse<T>>;

  post(url: string, payload?: ObjectLiteral): Promise<RequestResponse<T>>;

  put(url: string, payload?: ObjectLiteral): Promise<RequestResponse<T>>;

  delete(url: string): Promise<RequestResponse<T>>;

  head(url: string): Promise<RequestResponse<T>>;
}
