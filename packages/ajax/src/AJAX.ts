import { JSONA } from '@jamashita/publikum-json';
import { Ambiguous, Kind, ObjectLiteral } from '@jamashita/publikum-type';
import { AJAXResponse, AJAXResponseType } from './AJAXResponse';
import { AJAXError } from './Error/AJAXError';
import { IAJAX } from './Interface/IAJAX';

export class AJAX<T extends AJAXResponseType> implements IAJAX<T> {
  private readonly type: T;

  public constructor(type: T) {
    this.type = type;
  }

  public async get(url: string): Promise<AJAXResponse<T>> {
    try {
      const res: Response = await fetch(url, {
        method: 'GET'
      });

      if (!res.ok) {
        throw new AJAXError(`AJAX RETURNED ${res.status}`);
      }

      // eslint-disable-next-line @typescript-eslint/return-await
      return this.hydrate(res);
    }
    catch (err: unknown) {
      if (err instanceof AJAXError) {
        throw err;
      }
      if (err instanceof Error) {
        throw new AJAXError(err.message, err);
      }

      throw err;
    }
  }

  public async post(url: string, payload?: ObjectLiteral): Promise<AJAXResponse<T>> {
    try {
      const body: Ambiguous<string> = await this.flatten(payload);
      const res: Response = await fetch(url, {
        method: 'POST',
        body
      });

      if (!res.ok) {
        throw new AJAXError(`AJAX RETURNED ${res.status}`);
      }

      // eslint-disable-next-line @typescript-eslint/return-await
      return this.hydrate(res);
    }
    catch (err: unknown) {
      if (err instanceof AJAXError) {
        throw err;
      }
      if (err instanceof Error) {
        throw new AJAXError(err.message, err);
      }

      throw err;
    }
  }

  public async put(url: string, payload?: ObjectLiteral): Promise<AJAXResponse<T>> {
    try {
      const body: Ambiguous<string> = await this.flatten(payload);
      const res: Response = await fetch(url, {
        method: 'PUT',
        body
      });

      if (!res.ok) {
        throw new AJAXError(`AJAX RETURNED ${res.status}`);
      }

      // eslint-disable-next-line @typescript-eslint/return-await
      return this.hydrate(res);
    }
    catch (err: unknown) {
      if (err instanceof AJAXError) {
        throw err;
      }
      if (err instanceof Error) {
        throw new AJAXError(err.message, err);
      }

      throw err;
    }
  }

  public async delete(url: string): Promise<AJAXResponse<T>> {
    try {
      const res: Response = await fetch(url, {
        method: 'DELETE'
      });

      if (!res.ok) {
        throw new AJAXError(`AJAX RETURNED ${res.status}`);
      }

      // eslint-disable-next-line @typescript-eslint/return-await
      return this.hydrate(res);
    }
    catch (err: unknown) {
      if (err instanceof AJAXError) {
        throw err;
      }
      if (err instanceof Error) {
        throw new AJAXError(err.message, err);
      }

      throw err;
    }
  }

  public async head(url: string): Promise<AJAXResponse<T>> {
    try {
      const res: Response = await fetch(url, {
        method: 'HEAD'
      });

      if (!res.ok) {
        throw new AJAXError(`AJAX RETURNED ${res.status}`);
      }

      // eslint-disable-next-line @typescript-eslint/return-await
      return this.hydrate(res);
    }
    catch (err: unknown) {
      if (err instanceof AJAXError) {
        throw err;
      }
      if (err instanceof Error) {
        throw new AJAXError(err.message, err);
      }

      throw err;
    }
  }

  private async flatten(payload?: ObjectLiteral): Promise<Ambiguous<string>> {
    if (Kind.isUndefined(payload)) {
      return Promise.resolve<undefined>(undefined);
    }

    return JSONA.stringify(payload);
  }

  private async hydrate(res: Response): Promise<AJAXResponse<T>> {
    switch (this.type) {
      case 'arraybuffer': {
        return {
          status: res.status,
          body: await res.arrayBuffer()
        } as AJAXResponse<T>;
      }
      case 'blob': {
        return {
          status: res.status,
          body: await res.blob()
        } as AJAXResponse<T>;
      }
      case 'json': {
        return {
          status: res.status,
          body: await res.json() as ObjectLiteral
        } as AJAXResponse<T>;
      }
      case 'text': {
        return {
          status: res.status,
          body: await res.text()
        } as AJAXResponse<T>;
      }
      default: {
        throw new AJAXError(`UNEXPECTED TYPE. GIVEN: ${this.type}`);
      }
    }
  }
}
