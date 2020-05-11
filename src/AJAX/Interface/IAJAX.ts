import { AJAXResponse } from '..';
import { JSObjectNotation } from '../../Type';
export interface IAJAX {
  get<T>(url: string): Promise<AJAXResponse<T>>;

  post<T>(url: string, payload?: JSObjectNotation): Promise<AJAXResponse<T>>;

  put<T>(url: string, payload?: JSObjectNotation): Promise<AJAXResponse<T>>;

  delete<T>(url: string): Promise<AJAXResponse<T>>;
}
