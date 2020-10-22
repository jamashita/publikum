import { JSONA } from '@jamashita/publikum-json';
import { Ambiguous, Kind, ObjectLiteral } from '@jamashita/publikum-type';
import fetch, { Response } from 'node-fetch';
import { RequestError } from './Error/RequestError';
import { IRequest } from './Interface/IRequest';
import { RequestResponse, RequestResponseType } from './RequestResponse';

export class Request<T extends RequestResponseType> implements IRequest<T> {
  private readonly type: T;

  public constructor(type: T) {
    this.type = type;
  }

  public async get(url: string): Promise<RequestResponse<T>> {
    try {
      const res: Response = await fetch(url, {
        method: 'GET'
      });

      return await this.forgeResponse(res);
    }
    catch (err: unknown) {
      if (err instanceof RequestError) {
        throw err;
      }
      if (err instanceof Error) {
        throw new RequestError(err.message, err);
      }

      throw err;
    }
  }

  public async post(url: string, payload?: ObjectLiteral): Promise<RequestResponse<T>> {
    try {
      const res: Response = await fetch(url, {
        method: 'POST',
        body: await this.forgeBody(payload),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      return await this.forgeResponse(res);
    }
    catch (err: unknown) {
      if (err instanceof RequestError) {
        throw err;
      }
      if (err instanceof Error) {
        throw new RequestError(err.message, err);
      }

      throw err;
    }
  }

  public async put(url: string, payload?: ObjectLiteral): Promise<RequestResponse<T>> {
    try {
      const res: Response = await fetch(url, {
        method: 'PUT',
        body: await this.forgeBody(payload),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      return await this.forgeResponse(res);
    }
    catch (err: unknown) {
      if (err instanceof RequestError) {
        throw err;
      }
      if (err instanceof Error) {
        throw new RequestError(err.message, err);
      }

      throw err;
    }
  }

  public async delete(url: string): Promise<RequestResponse<T>> {
    try {
      const res: Response = await fetch(url, {
        method: 'DELETE'
      });

      return await this.forgeResponse(res);
    }
    catch (err: unknown) {
      if (err instanceof RequestError) {
        throw err;
      }
      if (err instanceof Error) {
        throw new RequestError(err.message, err);
      }

      throw err;
    }
  }

  public async head(url: string): Promise<RequestResponse<T>> {
    try {
      const res: Response = await fetch(url, {
        method: 'HEAD'
      });

      return await this.forgeResponse(res);
    }
    catch (err: unknown) {
      if (err instanceof RequestError) {
        throw err;
      }
      if (err instanceof Error) {
        throw new RequestError(err.message, err);
      }

      throw err;
    }
  }

  private forgeBody(payload?: ObjectLiteral): Promise<Ambiguous<string>> {
    if (Kind.isUndefined(payload)) {
      return Promise.resolve<undefined>(undefined);
    }

    return JSONA.stringify(payload);
  }

  private async forgeResponse(res: Response): Promise<RequestResponse<T>> {
    if (!res.ok) {
      throw new RequestError(res.statusText);
    }


    switch (this.type) {
      case 'text': {
        return {
          status: res.status,
          body: await res.text()
        } as RequestResponse<T>;
      }
      case 'json': {
        return {
          status: res.status,
          body: await res.json()
        } as RequestResponse<T>;
      }
      case 'buffer': {
        return {
          status: res.status,
          body: await res.buffer()
        } as RequestResponse<T>;
      }
      default: {
        throw new RequestError(`UNEXPECTED RESPONSE TYPE: GIVEN ${this.type}`);
      }
    }
  }
}
