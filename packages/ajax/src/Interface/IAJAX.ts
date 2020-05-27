import { ObjectLiteral } from '@publikum/type';

import { AJAXResponse } from '../AJAXResponse';

export interface IAJAX {
  get<T>(url: string): Promise<AJAXResponse<T>>;

  post<T>(url: string, payload?: ObjectLiteral): Promise<AJAXResponse<T>>;

  put<T>(url: string, payload?: ObjectLiteral): Promise<AJAXResponse<T>>;

  delete<T>(url: string): Promise<AJAXResponse<T>>;
}
