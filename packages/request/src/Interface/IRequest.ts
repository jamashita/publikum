import { ObjectLiteral } from '@jamashita/publikum-type';
import { RequestResponse } from '../RequestResponse';

export interface IRequest {
  get<T extends ObjectLiteral>(url: string): Promise<RequestResponse<T>>;

  post<T extends ObjectLiteral>(url: string, payload?: ObjectLiteral): Promise<RequestResponse<T>>;

  put<T extends ObjectLiteral>(url: string, payload?: ObjectLiteral): Promise<RequestResponse<T>>;

  delete<T extends ObjectLiteral>(url: string): Promise<RequestResponse<T>>;
}
