import request from 'superagent';

import { ObjectLiteral, Resolve } from '@jamashita/publikum-type';

import { AJAXResponse } from './AJAXResponse';
import { IAJAX } from './Interface/IAJAX';

export class AJAX implements IAJAX {
  public get<T>(url: string): Promise<AJAXResponse<T>> {
    return new Promise<AJAXResponse<T>>((resolve: Resolve<AJAXResponse<T>>) => {
      // eslint-disable-next-line handle-callback-err
      request.get(url).end((err: unknown, res: request.Response) => {
        resolve(res);
      });
    });
  }

  public post<T>(url: string, payload?: ObjectLiteral): Promise<AJAXResponse<T>> {
    return new Promise<AJAXResponse<T>>((resolve: Resolve<AJAXResponse<T>>) => {
      request
        .post(url)
        .send(payload)
        // eslint-disable-next-line handle-callback-err
        .end((err: unknown, res: request.Response) => {
          resolve(res);
        });
    });
  }

  public put<T>(url: string, payload?: ObjectLiteral): Promise<AJAXResponse<T>> {
    return new Promise<AJAXResponse<T>>((resolve: Resolve<AJAXResponse<T>>) => {
      request
        .put(url)
        .send(payload)
        // eslint-disable-next-line handle-callback-err
        .end((err: unknown, res: request.Response) => {
          resolve(res);
        });
    });
  }

  public delete<T>(url: string): Promise<AJAXResponse<T>> {
    return new Promise<AJAXResponse<T>>((resolve: Resolve<AJAXResponse<T>>) => {
      // eslint-disable-next-line handle-callback-err
      request.del(url).end((err: unknown, res: request.Response) => {
        resolve(res);
      });
    });
  }
}
