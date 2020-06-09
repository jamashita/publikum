import got, { Response } from 'got';

import { ObjectLiteral } from '@jamashita/publikum-type';

import { IRequest } from './Interface/IRequest';
import { RequestResponse } from './RequestResponse';

export class Request implements IRequest {
  public async get<T>(url: string): Promise<RequestResponse<T>> {
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

  public async post<T>(url: string, payload?: ObjectLiteral): Promise<RequestResponse<T>> {
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

  public async put<T>(url: string, payload?: ObjectLiteral): Promise<RequestResponse<T>> {
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

  public async delete<T>(url: string): Promise<RequestResponse<T>> {
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
