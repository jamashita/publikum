import { JSONA } from '@jamashita/publikum-json';
import { Kind, ObjectLiteral, Omittable } from '@jamashita/publikum-type';
import Axios, { AxiosInstance, AxiosResponse } from 'axios';
import { AJAXBodyKV, AJAXResponse, AJAXResponseType } from './AJAXResponse';
import { IAJAX } from './Interface/IAJAX';

export class AJAX<T extends AJAXResponseType> implements IAJAX<T> {
  private readonly axios: AxiosInstance;

  public constructor(type: T) {
    this.axios = Axios.create({
      responseType: type,
      transformResponse(data: unknown): unknown {
        return data;
      },
      validateStatus(): boolean {
        return true;
      }
    });
  }

  public async get(url: string): Promise<AJAXResponse<T>> {
    const {
      status,
      data
    }: AxiosResponse<AJAXBodyKV[T]> = await this.axios.get<AJAXBodyKV[T]>(url);

    return {
      status,
      body: data
    };
  }

  public async post(url: string, payload?: ObjectLiteral): Promise<AJAXResponse<T>> {
    const p: Omittable<string> = await this.stringify(payload);
    const {
      status,
      data
    }: AxiosResponse<AJAXBodyKV[T]> = await this.axios.post<AJAXBodyKV[T]>(url, p);

    return {
      status,
      body: data
    };
  }

  public async put(url: string, payload?: ObjectLiteral): Promise<AJAXResponse<T>> {
    const p: Omittable<string> = await this.stringify(payload);
    const {
      status,
      data
    }: AxiosResponse<AJAXBodyKV[T]> = await this.axios.put<AJAXBodyKV[T]>(url, p);

    return {
      status,
      body: data
    };
  }

  public async delete(url: string): Promise<AJAXResponse<T>> {
    const {
      status,
      data
    }: AxiosResponse<AJAXBodyKV[T]> = await this.axios.delete<AJAXBodyKV[T]>(url);

    return {
      status,
      body: data
    };
  }

  public async head(url: string): Promise<AJAXResponse<T>> {
    const {
      status,
      data
    }: AxiosResponse<AJAXBodyKV[T]> = await this.axios.head<AJAXBodyKV[T]>(url);

    return {
      status,
      body: data
    };
  }

  private stringify(payload?: ObjectLiteral): Promise<Omittable<string>> {
    if (Kind.isUndefined(payload)) {
      return Promise.resolve();
    }

    return JSONA.stringify(payload);
  }
}
