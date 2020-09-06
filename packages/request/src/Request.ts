import { ObjectLiteral } from '@jamashita/publikum-type';
import got, { Got, RequestError as ReqError, Response } from 'got';
import { RequestError } from './Error/RequestError';
import { IRequest } from './Interface/IRequest';
import { RequestBodyKV, RequestResponse, RequestResponseType } from './RequestResponse';

export class Request<T extends RequestResponseType> implements IRequest<T> {
  private readonly got: Got;

  public constructor(type: T) {
    this.got = got.extend({
      responseType: type
    });
  }

  public async get(url: string): Promise<RequestResponse<T>> {
    try {
      const {
        statusCode,
        body
      }: Response<RequestBodyKV[T]> = await this.got.get<RequestBodyKV[T]>(url);

      return {
        status: statusCode,
        body
      };
    }
    catch (err: unknown) {
      if (err instanceof ReqError) {
        throw new RequestError(err.message, err);
      }

      throw err;
    }
  }

  public async post(url: string, payload?: ObjectLiteral): Promise<RequestResponse<T>> {
    try {
      const {
        statusCode,
        body
      }: Response<RequestBodyKV[T]> = await this.got.post<RequestBodyKV[T]>(url, {
        json: payload
      });

      return {
        status: statusCode,
        body
      };
    }
    catch (err: unknown) {
      if (err instanceof ReqError) {
        throw new RequestError(err.message, err);
      }

      throw err;
    }
  }

  public async put(url: string, payload?: ObjectLiteral): Promise<RequestResponse<T>> {
    try {
      const {
        statusCode,
        body
      }: Response<RequestBodyKV[T]> = await this.got.put<RequestBodyKV[T]>(url, {
        json: payload
      });

      return {
        status: statusCode,
        body
      };
    }
    catch (err: unknown) {
      if (err instanceof ReqError) {
        throw new RequestError(err.message, err);
      }

      throw err;
    }
  }

  public async delete(url: string): Promise<RequestResponse<T>> {
    try {
      const {
        statusCode,
        body
      }: Response<RequestBodyKV[T]> = await this.got.delete<RequestBodyKV[T]>(url);

      return {
        status: statusCode,
        body
      };
    }
    catch (err: unknown) {
      if (err instanceof ReqError) {
        throw new RequestError(err.message, err);
      }

      throw err;
    }
  }

  public async head(url: string): Promise<RequestResponse<T>> {
    try {
      const {
        statusCode,
        body
      }: Response<RequestBodyKV[T]> = await this.got.head<RequestBodyKV[T]>(url);

      return {
        status: statusCode,
        body
      };
    }
    catch (err: unknown) {
      if (err instanceof ReqError) {
        throw new RequestError(err.message, err);
      }

      throw err;
    }
  }
}
