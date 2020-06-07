import got, { Response } from 'got';

import { ObjectLiteral } from '@jamashita/publikum-type';

import { AJAXResponse } from './AJAXResponse';
import { IAJAX } from './Interface/IAJAX';

export class AJAX implements IAJAX {
  public async get<T>(url: string): Promise<AJAXResponse<T>> {
    // prettier-ignore
    const {
      statusCode,
      body
    }: Response<T> = await got.get<T>(url, {
      responseType: 'json'
    });

    return {
      status: statusCode,
      body
    };
  }

  public async post<T>(url: string, payload?: ObjectLiteral): Promise<AJAXResponse<T>> {
    // prettier-ignore
    const {
      statusCode,
      body
    } = await got.post<T>(url, {
      json: payload,
      responseType: 'json'
    });

    return {
      status: statusCode,
      body
    };
  }

  public async put<T>(url: string, payload?: ObjectLiteral): Promise<AJAXResponse<T>> {
    // prettier-ignore
    const {
      statusCode,
      body
    } = await got.put<T>(url, {
      json: payload,
      responseType: 'json'
    });

    return {
      status: statusCode,
      body
    };
  }

  public async delete<T>(url: string): Promise<AJAXResponse<T>> {
    // prettier-ignore
    const {
      statusCode,
      body
    }: Response<T> = await got.post<T>(url, {
      responseType: 'json'
    });

    return {
      status: statusCode,
      body
    };
  }
}
