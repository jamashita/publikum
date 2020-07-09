import got, { RequestError as ReqError, Response } from 'got';

import { JSONA } from '@jamashita/publikum-json';
import { ObjectLiteral } from '@jamashita/publikum-type';

import { RequestError } from './Error/RequestError';
import { IRequest } from './Interface/IRequest';
import { RequestResponse } from './RequestResponse';

export class Request implements IRequest {
  public async get<T extends ObjectLiteral>(url: string): Promise<RequestResponse<T>> {
    // prettier-ignore
    try {
      const {
        statusCode,
        body
      }: Response<string> = await got.get(url);
      const json: T = await JSONA.parse<T>(body);

      return {
        status: statusCode,
        body: json
      };
    }
    catch (err) {
      if (err instanceof ReqError) {
        throw new RequestError(err.message, err);
      }

      throw err;
    }
  }

  public async post<T extends ObjectLiteral>(url: string, payload?: ObjectLiteral): Promise<RequestResponse<T>> {
    // prettier-ignore
    try {
      const {
        statusCode,
        body
      }: Response<string> = await got.post(url, {
        json: payload
      });
      const json: T = await JSONA.parse<T>(body);

      return {
        status: statusCode,
        body: json
      };
    }
    catch (err) {
      if (err instanceof ReqError) {
        throw new RequestError(err.message, err);
      }

      throw err;
    }
  }

  public async put<T extends ObjectLiteral>(url: string, payload?: ObjectLiteral): Promise<RequestResponse<T>> {
    // prettier-ignore
    try {
      const {
        statusCode,
        body
      }: Response<string> = await got.put(url, {
        json: payload
      });
      const json: T = await JSONA.parse<T>(body);

      return {
        status: statusCode,
        body: json
      };
    }
    catch (err) {
      if (err instanceof ReqError) {
        throw new RequestError(err.message, err);
      }

      throw err;
    }
  }

  public async delete<T extends ObjectLiteral>(url: string): Promise<RequestResponse<T>> {
    // prettier-ignore
    try {
      const {
        statusCode,
        body
      }: Response<string> = await got.delete(url);
      const json: T = await JSONA.parse<T>(body);

      return {
        status: statusCode,
        body: json
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
