import axios, { AxiosResponse } from 'axios';

import { ObjectLiteral } from '@jamashita/publikum-type';

import { AJAXResponse } from './AJAXResponse';
import { IAJAX } from './Interface/IAJAX';

export class AJAX implements IAJAX {
  public async get<T>(url: string): Promise<AJAXResponse<T>> {
    // prettier-ignore
    const {
      status,
      data
    }: AxiosResponse<T> = await axios.get<T>(url, {
      responseType: 'json',
      validateStatus: () => {
        return true;
      }
    });

    return {
      status,
      body: data
    };
  }

  public async post<T>(url: string, payload?: ObjectLiteral): Promise<AJAXResponse<T>> {
    // prettier-ignore
    const {
      status,
      data
    } = await axios.post<T>(url, {
      json: payload,
      responseType: 'json',
      validateStatus: () => {
        return true;
      }
    });

    return {
      status,
      body: data
    };
  }

  public async put<T>(url: string, payload?: ObjectLiteral): Promise<AJAXResponse<T>> {
    // prettier-ignore
    const {
      status,
      data
    } = await axios.put<T>(url, {
      json: payload,
      responseType: 'json',
      validateStatus: () => {
        return true;
      }
    });

    return {
      status,
      body: data
    };
  }

  public async delete<T>(url: string): Promise<AJAXResponse<T>> {
    // prettier-ignore
    const {
      status,
      data
    }: AxiosResponse<T> = await axios.post<T>(url, {
      responseType: 'json',
      validateStatus: () => {
        return true;
      }
    });

    return {
      status,
      body: data
    };
  }
}
