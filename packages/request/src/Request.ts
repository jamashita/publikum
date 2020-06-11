import got, { RequestError as ReqError, Response } from 'got';

import { ObjectLiteral } from '@jamashita/publikum-type';

import { RequestError } from './Error/RequestError';
import { IRequest } from './Interface/IRequest';
import { RequestResponse } from './RequestResponse';

export class Request implements IRequest {
  public async get<T>(url: string): Promise<RequestResponse<T>> {
    // prettier-ignore
    try {
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
    catch (err) {
      if (err instanceof ReqError) {
        throw new RequestError(err.message, err);
      }

      throw err;
    }
  }

  public async post<T>(url: string, payload?: ObjectLiteral): Promise<RequestResponse<T>> {
    // prettier-ignore
    try {
      // prettier-ignore
      const {
        statusCode,
        body
      }: Response<T> = await got.post<T>(url, {
        json: payload,
        responseType: 'json'
      });

      return {
        status: statusCode,
        body
      };
    }
    catch (err) {
      if (err instanceof ReqError) {
        throw new RequestError(err.message, err);
      }

      throw err;
    }
  }

  public async put<T>(url: string, payload?: ObjectLiteral): Promise<RequestResponse<T>> {
    // prettier-ignore
    try {
      // prettier-ignore
      const {
        statusCode,
        body
      }: Response<T> = await got.put<T>(url, {
        json: payload,
        responseType: 'json'
      });

      return {
        status: statusCode,
        body
      };
    }
    catch (err) {
      if (err instanceof ReqError) {
        throw new RequestError(err.message, err);
      }

      throw err;
    }
  }

  public async delete<T>(url: string): Promise<RequestResponse<T>> {
    // prettier-ignore
    try {
      // prettier-ignore
      const {
        statusCode,
        body
      }: Response<T> = await got.delete<T>(url, {
        responseType: 'json'
      });

      return {
        status: statusCode,
        body
      };
    }
    catch (err) {
      if (err instanceof ReqError) {
        throw new RequestError(err.message, err);
      }

      throw err;
    }
  }
}
