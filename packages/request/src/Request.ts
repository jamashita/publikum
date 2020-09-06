import { ObjectLiteral } from '@jamashita/publikum-type';
import got, { RequestError as ReqError, Response } from 'got';
import { RequestError } from './Error/RequestError';
import { IRequest } from './Interface/IRequest';
import { RequestResponse } from './RequestResponse';

export class Request implements IRequest {
  public async get(url: string): Promise<RequestResponse> {
    try {
      const {
        statusCode,
        rawBody
      }: Response = await got.get(url, {
        responseType: 'buffer'
      });

      return {
        status: statusCode,
        body: rawBody
      };
    }
    catch (err: unknown) {
      if (err instanceof ReqError) {
        throw new RequestError(err.message, err);
      }

      throw err;
    }
  }

  public async post(url: string, payload?: ObjectLiteral): Promise<RequestResponse> {
    try {
      const {
        statusCode,
        rawBody
      }: Response = await got.post(url, {
        json: payload,
        responseType: 'buffer'
      });

      return {
        status: statusCode,
        body: rawBody
      };
    }
    catch (err: unknown) {
      if (err instanceof ReqError) {
        throw new RequestError(err.message, err);
      }

      throw err;
    }
  }

  public async put(url: string, payload?: ObjectLiteral): Promise<RequestResponse> {
    try {
      const {
        statusCode,
        rawBody
      }: Response = await got.put(url, {
        json: payload,
        responseType: 'buffer'
      });

      return {
        status: statusCode,
        body: rawBody
      };
    }
    catch (err: unknown) {
      if (err instanceof ReqError) {
        throw new RequestError(err.message, err);
      }

      throw err;
    }
  }

  public async delete(url: string): Promise<RequestResponse> {
    try {
      const {
        statusCode,
        rawBody
      }: Response = await got.delete(url, {
        responseType: 'buffer'
      });

      return {
        status: statusCode,
        body: rawBody
      };
    }
    catch (err: unknown) {
      if (err instanceof ReqError) {
        throw new RequestError(err.message, err);
      }

      throw err;
    }
  }

  public async head(url: string): Promise<RequestResponse<null>> {
    try {
      const {
        statusCode
      }: Response<string> = await got.head(url, {
        allowGetBody: true
      });

      return {
        status: statusCode,
        body: null
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
