import { ObjectLiteral } from '@jamashita/publikum-type';
import axios, { AxiosResponse } from 'axios';

import { AJAXResponse } from './AJAXResponse';
import { IAJAX } from './Interface/IAJAX';

export class AJAX implements IAJAX {
  public async get<T>(url: string): Promise<AJAXResponse<T>> {
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
    const {
      status,
      data
    }: AxiosResponse<T> = await axios.post<T>(url, payload, {
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
    const {
      status,
      data
    }: AxiosResponse<T> = await axios.put<T>(url, payload, {
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
    const {
      status,
      data
    }: AxiosResponse<T> = await axios.delete<T>(url, {
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
