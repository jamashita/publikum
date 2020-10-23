import { JSONA } from '@jamashita/publikum-json';
import { ObjectLiteral } from '@jamashita/publikum-type';
import ky from 'ky';
import { AJAXResponse, AJAXResponseType } from './AJAXResponse';
import { AJAXError } from './Error/AJAXError';
import { IAJAX } from './Interface/IAJAX';

type KY = typeof ky;

export class AJAX<T extends AJAXResponseType> implements IAJAX<T> {
  private readonly ky: KY;
  private readonly type: T;

  public constructor(type: T) {
    this.ky = ky.create({
      parseJson: (text: string): Promise<ObjectLiteral> => {
        return JSONA.parse(text);
      },
      timeout: false,
      throwHttpErrors: true
    });
    this.type = type;
  }

  public async get(url: string): Promise<AJAXResponse<T>> {
    try {
      const res: Response = await this.ky.get(url);

      // eslint-disable-next-line @typescript-eslint/return-await
      return this.hydrate(res);
    }
    catch (err: unknown) {
      if (err instanceof Error) {
        throw new AJAXError(err.message, err);
      }

      throw err;
    }
  }

  public async post(url: string, payload?: ObjectLiteral): Promise<AJAXResponse<T>> {
    try {
      const res: Response = await this.ky.post(url, {
        json: payload
      });

      // eslint-disable-next-line @typescript-eslint/return-await
      return this.hydrate(res);
    }
    catch (err: unknown) {
      if (err instanceof Error) {
        throw new AJAXError(err.message, err);
      }

      throw err;
    }
  }

  public async put(url: string, payload?: ObjectLiteral): Promise<AJAXResponse<T>> {
    try {
      const res: Response = await this.ky.put(url, {
        json: payload
      });

      // eslint-disable-next-line @typescript-eslint/return-await
      return this.hydrate(res);
    }
    catch (err: unknown) {
      if (err instanceof Error) {
        throw new AJAXError(err.message, err);
      }

      throw err;
    }
  }

  public async delete(url: string): Promise<AJAXResponse<T>> {
    try {
      const res: Response = await this.ky.delete(url);

      // eslint-disable-next-line @typescript-eslint/return-await
      return this.hydrate(res);
    }
    catch (err: unknown) {
      if (err instanceof Error) {
        throw new AJAXError(err.message, err);
      }

      throw err;
    }
  }

  public async head(url: string): Promise<AJAXResponse<T>> {
    try {
      const res: Response = await this.ky.head(url);

      // eslint-disable-next-line @typescript-eslint/return-await
      return this.hydrate(res);
    }
    catch (err: unknown) {
      if (err instanceof Error) {
        throw new AJAXError(err.message, err);
      }

      throw err;
    }
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
