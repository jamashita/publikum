import { JSONA } from '@jamashita/publikum-json';
import { ObjectLiteral } from '@jamashita/publikum-type';
import got, { RequestError as ReqError, Response } from 'got';
import { RequestError } from './Error/RequestError';
import { IRequest } from './Interface/IRequest';
import { RequestResponse, ResponseType } from './RequestResponse';

export class Request<T extends ResponseType = 'json'> implements IRequest<T> {
  private readonly responseType: T;

  public constructor(responseType: T) {
    this.responseType = responseType;
  }

  public async get(url: string): Promise<RequestResponse<T>> {
    try {
      const res: Response<string> = await got.get(url);

      // eslint-disable-next-line @typescript-eslint/return-await
      return this.forgeResponse(res);
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
      const res: Response<string> = await got.post(url, {
        json: payload
      });

      // eslint-disable-next-line @typescript-eslint/return-await
      return this.forgeResponse(res);
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
      const res: Response<string> = await got.put(url, {
        json: payload
      });

      // eslint-disable-next-line @typescript-eslint/return-await
      return this.forgeResponse(res);
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
      const res: Response<string> = await got.delete(url);

      // eslint-disable-next-line @typescript-eslint/return-await
      return this.forgeResponse(res);
    }
    catch (err: unknown) {
      if (err instanceof ReqError) {
        throw new RequestError(err.message, err);
      }

      throw err;
    }
  }

  private async forgeResponse(res: Response<string>): Promise<RequestResponse<T>> {
    const {
      statusCode: status,
      body,
      rawBody
    } = res;

    switch (this.responseType) {
      case 'byte': {
        return {
          status,
          body: rawBody
        } as RequestResponse<T>;
      }
      case 'json': {
        const json: ObjectLiteral = await JSONA.parse<ObjectLiteral>(body);

        return {
          status,
          body: json
        } as RequestResponse<T>;
      }
      case 'raw': {
        return {
          status,
          body
        } as RequestResponse<T>;
      }
      default: {
        throw new RequestError(`UNEXPECTED RESPONSE TYPE: GIVEN ${this.responseType}`);
      }
    }
  }
}
