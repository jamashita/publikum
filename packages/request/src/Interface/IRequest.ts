import { ObjectLiteral } from '@jamashita/publikum-type';

import { RequestResponse } from '../RequestResponse';

export interface IRequest {
  get<T>(url: string): Promise<RequestResponse<T>>;

  post<T>(url: string, payload?: ObjectLiteral): Promise<RequestResponse<T>>;

  put<T>(url: string, payload?: ObjectLiteral): Promise<RequestResponse<T>>;

  delete<T>(url: string): Promise<RequestResponse<T>>;
}
