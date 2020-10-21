import { AJAXError } from '@jamashita/publikum-ajax';
import { ObjectLiteral } from '@jamashita/publikum-type';
import { StatusCodes } from 'http-status-codes';
import fetchMock, { MockResponseInit } from 'jest-fetch-mock';
import { AJAX } from '../AJAX';
import { AJAXResponse } from '../AJAXResponse';

fetchMock.enableMocks();

const bufToChar = (buf: ArrayBuffer): string => {
  return Buffer.from(new Uint8Array(buf)).toString('hex');
};
const sr: string = '2ea736db-8aa0-496f-950b-dec53b2eb268';
const jr: ObjectLiteral = {
  mo: 'response string',
  nu: false,
  pq: -13
};
const br: Blob = new Blob([sr], {
  type: 'text/plain'
});
const bfr: ArrayBuffer = new ArrayBuffer(1);
const url: string = 'https://example.com/morceau/de/poitrine';

describe('AJAX', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  describe('get', () => {
    it('responds CONTINUE', async () => {
      expect.assertions(1);

      fetchMock.mockResponse((): Promise<MockResponseInit> => {
        return Promise.resolve<MockResponseInit>({
          init: {
            status: StatusCodes.CONTINUE,
            headers: {
              'Content-Type': 'text/html'
            }
          },
          body: JSON.stringify(jr)
        });
      });

      const ajax: AJAX<'text'> = new AJAX<'text'>('text');

      await expect(ajax.get(url)).rejects.toThrow(AJAXError);
    });

    it('responds OK: response is text', async () => {
      expect.assertions(2);

      fetchMock.mockResponse(async (): Promise<MockResponseInit> => {
        return Promise.resolve<MockResponseInit>({
          init: {
            status: StatusCodes.OK,
            headers: {
              'Content-Type': 'text/html'
            }
          },
          body: sr
        });
      });

      const ajax: AJAX<'text'> = new AJAX<'text'>('text');

      const r: AJAXResponse<'text'> = await ajax.get(url);

      expect(r.status).toBe(StatusCodes.OK);
      expect(r.body).toBe(sr);
    });

    it('responds OK: response is json', async () => {
      expect.assertions(2);

      fetchMock.mockResponse(async (): Promise<MockResponseInit> => {
        return Promise.resolve<MockResponseInit>({
          init: {
            status: StatusCodes.OK,
            headers: {
              'Content-Type': 'text/html'
            }
          },
          body: JSON.stringify(jr)
        });
      });

      const ajax: AJAX<'json'> = new AJAX<'json'>('json');

      const r: AJAXResponse<'json'> = await ajax.get(url);

      expect(r.status).toBe(StatusCodes.OK);
      expect(r.body).toStrictEqual(jr);
    });

    it('responds OK: response is blob', async () => {
      expect.assertions(2);

      fetchMock.mockResponse(async (): Promise<MockResponseInit> => {
        return Promise.resolve<MockResponseInit>({
          init: {
            status: StatusCodes.OK,
            headers: {
              'Content-Type': 'text/html'
            }
          },
          body: sr
        });
      });

      const ajax: AJAX<'blob'> = new AJAX<'blob'>('blob');

      const r: AJAXResponse<'blob'> = await ajax.get(url);

      expect(r.status).toBe(StatusCodes.OK);
      expect(r.body.size).toBe(br.size);
    });

    it('responds OK: response is arraybuffer', async () => {
      expect.assertions(2);

      fetchMock.mockResponse(async (): Promise<MockResponseInit> => {
        return Promise.resolve<MockResponseInit>({
          init: {
            status: StatusCodes.OK,
            headers: {
              'Content-Type': 'text/html'
            }
          },
          body: bufToChar(bfr)
        });
      });

      const ajax: AJAX<'arraybuffer'> = new AJAX<'arraybuffer'>('arraybuffer');

      const r: AJAXResponse<'arraybuffer'> = await ajax.get(url);

      expect(r.status).toBe(StatusCodes.OK);
      expect(r.body).toStrictEqual(bfr);
    });

    it('responds MULTIPLE_CHOICE', async () => {
      expect.assertions(1);

      fetchMock.mockResponse(async (): Promise<MockResponseInit> => {
        return Promise.resolve<MockResponseInit>({
          init: {
            status: StatusCodes.MULTIPLE_CHOICES,
            headers: {
              'Content-Type': 'text/html'
            }
          },
          body: JSON.stringify(jr)
        });
      });

      const ajax: AJAX<'text'> = new AJAX<'text'>('text');

      await expect(ajax.get(url)).rejects.toThrow(AJAXError);
    });

    it('responds BAD_REQUEST', async () => {
      expect.assertions(1);

      fetchMock.mockResponse(async (): Promise<MockResponseInit> => {
        return Promise.resolve<MockResponseInit>({
          init: {
            status: StatusCodes.BAD_REQUEST,
            headers: {
              'Content-Type': 'text/html'
            }
          },
          body: JSON.stringify(jr)
        });
      });

      const ajax: AJAX<'text'> = new AJAX<'text'>('text');

      await expect(ajax.get(url)).rejects.toThrow(AJAXError);
    });

    it('responds INTERNAL_SERVER_ERROR', async () => {
      expect.assertions(1);

      fetchMock.mockResponse(async (): Promise<MockResponseInit> => {
        return Promise.resolve<MockResponseInit>({
          init: {
            status: StatusCodes.INTERNAL_SERVER_ERROR,
            headers: {
              'Content-Type': 'text/html'
            }
          },
          body: JSON.stringify(jr)
        });
      });

      const ajax: AJAX<'text'> = new AJAX<'text'>('text');

      await expect(ajax.get(url)).rejects.toThrow(AJAXError);
    });
  });

  describe('post', () => {
    it('responds CONTINUE', async () => {
      expect.assertions(1);

      fetchMock.mockResponse((): Promise<MockResponseInit> => {
        return Promise.resolve<MockResponseInit>({
          init: {
            status: StatusCodes.CONTINUE,
            headers: {
              'Content-Type': 'text/html'
            }
          },
          body: JSON.stringify(jr)
        });
      });

      const ajax: AJAX<'text'> = new AJAX<'text'>('text');

      await expect(ajax.post(url)).rejects.toThrow(AJAXError);
    });

    it('responds OK: response is text', async () => {
      expect.assertions(2);

      fetchMock.mockResponse((): Promise<MockResponseInit> => {
        return Promise.resolve<MockResponseInit>({
          init: {
            status: StatusCodes.OK,
            headers: {
              'Content-Type': 'text/html'
            }
          },
          body: sr
        });
      });

      const ajax: AJAX<'text'> = new AJAX<'text'>('text');

      const r: AJAXResponse<'text'> = await ajax.post(url);

      expect(r.status).toBe(StatusCodes.OK);
      expect(r.body).toBe(sr);
    });

    it('responds OK: response is json', async () => {
      expect.assertions(2);

      fetchMock.mockResponse((): Promise<MockResponseInit> => {
        return Promise.resolve<MockResponseInit>({
          init: {
            status: StatusCodes.OK,
            headers: {
              'Content-Type': 'text/html'
            }
          },
          body: JSON.stringify(jr)
        });
      });

      const ajax: AJAX<'json'> = new AJAX<'json'>('json');

      const r: AJAXResponse<'json'> = await ajax.post(url);

      expect(r.status).toBe(StatusCodes.OK);
      expect(r.body).toStrictEqual(jr);
    });

    it('responds OK: response is blob', async () => {
      expect.assertions(2);

      fetchMock.mockResponse((): Promise<MockResponseInit> => {
        return Promise.resolve<MockResponseInit>({
          init: {
            status: StatusCodes.OK,
            headers: {
              'Content-Type': 'text/html'
            }
          },
          body: sr
        });
      });

      const ajax: AJAX<'blob'> = new AJAX<'blob'>('blob');

      const r: AJAXResponse<'blob'> = await ajax.post(url);

      expect(r.status).toBe(StatusCodes.OK);
      expect(r.body.size).toBe(br.size);
    });

    it('responds OK: response is arraybuffer', async () => {
      expect.assertions(2);

      fetchMock.mockResponse((): Promise<MockResponseInit> => {
        return Promise.resolve<MockResponseInit>({
          init: {
            status: StatusCodes.OK,
            headers: {
              'Content-Type': 'text/html'
            }
          },
          body: bufToChar(bfr)
        });
      });

      const ajax: AJAX<'arraybuffer'> = new AJAX<'arraybuffer'>('arraybuffer');

      const r: AJAXResponse<'arraybuffer'> = await ajax.post(url);

      expect(r.status).toBe(StatusCodes.OK);
      expect(r.body).toStrictEqual(bfr);
    });

    it('responds MULTIPLE_CHOICES', async () => {
      expect.assertions(1);

      fetchMock.mockResponse((): Promise<MockResponseInit> => {
        return Promise.resolve<MockResponseInit>({
          init: {
            status: StatusCodes.MULTIPLE_CHOICES,
            headers: {
              'Content-Type': 'text/html'
            }
          },
          body: JSON.stringify(jr)
        });
      });

      const ajax: AJAX<'text'> = new AJAX<'text'>('text');

      await expect(ajax.post(url)).rejects.toThrow(AJAXError);
    });

    it('responds BAD_REQUEST', async () => {
      expect.assertions(1);

      fetchMock.mockResponse((): Promise<MockResponseInit> => {
        return Promise.resolve<MockResponseInit>({
          init: {
            status: StatusCodes.BAD_REQUEST,
            headers: {
              'Content-Type': 'text/html'
            }
          },
          body: JSON.stringify(jr)
        });
      });

      const ajax: AJAX<'text'> = new AJAX<'text'>('text');

      await expect(ajax.post(url)).rejects.toThrow(AJAXError);
    });

    it('responds INTERNAL_SERVER_ERROR', async () => {
      expect.assertions(1);

      fetchMock.mockResponse((): Promise<MockResponseInit> => {
        return Promise.resolve<MockResponseInit>({
          init: {
            status: StatusCodes.INTERNAL_SERVER_ERROR,
            headers: {
              'Content-Type': 'text/html'
            }
          },
          body: JSON.stringify(jr)
        });
      });

      const ajax: AJAX<'text'> = new AJAX<'text'>('text');

      await expect(ajax.post(url)).rejects.toThrow(AJAXError);
    });
  });

  describe('put', () => {
    it('responds CONTINUE', async () => {
      expect.assertions(1);

      fetchMock.mockResponse((): Promise<MockResponseInit> => {
        return Promise.resolve<MockResponseInit>({
          init: {
            status: StatusCodes.CONTINUE,
            headers: {
              'Content-Type': 'text/html'
            }
          },
          body: JSON.stringify(jr)
        });
      });

      const ajax: AJAX<'text'> = new AJAX<'text'>('text');

      await expect(ajax.put(url)).rejects.toThrow(AJAXError);
    });

    it('responds OK: response is text', async () => {
      expect.assertions(2);

      fetchMock.mockResponse((): Promise<MockResponseInit> => {
        return Promise.resolve<MockResponseInit>({
          init: {
            status: StatusCodes.OK,
            headers: {
              'Content-Type': 'text/html'
            }
          },
          body: sr
        });
      });

      const ajax: AJAX<'text'> = new AJAX<'text'>('text');

      const r: AJAXResponse<'text'> = await ajax.put(url);

      expect(r.status).toBe(StatusCodes.OK);
      expect(r.body).toBe(sr);
    });

    it('responds OK: response is json', async () => {
      expect.assertions(2);

      fetchMock.mockResponse((): Promise<MockResponseInit> => {
        return Promise.resolve<MockResponseInit>({
          init: {
            status: StatusCodes.OK,
            headers: {
              'Content-Type': 'text/html'
            }
          },
          body: JSON.stringify(jr)
        });
      });

      const ajax: AJAX<'json'> = new AJAX<'json'>('json');

      const r: AJAXResponse<'json'> = await ajax.put(url);

      expect(r.status).toBe(StatusCodes.OK);
      expect(r.body).toStrictEqual(jr);
    });

    it('responds OK: response is blob', async () => {
      expect.assertions(2);

      fetchMock.mockResponse((): Promise<MockResponseInit> => {
        return Promise.resolve<MockResponseInit>({
          init: {
            status: StatusCodes.OK,
            headers: {
              'Content-Type': 'text/html'
            }
          },
          body: sr
        });
      });

      const ajax: AJAX<'blob'> = new AJAX<'blob'>('blob');

      const r: AJAXResponse<'blob'> = await ajax.put(url);

      expect(r.status).toBe(StatusCodes.OK);
      expect(r.body.size).toBe(br.size);
    });

    it('responds OK: response is arraybuffer', async () => {
      expect.assertions(2);

      fetchMock.mockResponse((): Promise<MockResponseInit> => {
        return Promise.resolve<MockResponseInit>({
          init: {
            status: StatusCodes.OK,
            headers: {
              'Content-Type': 'text/html'
            }
          },
          body: bufToChar(bfr)
        });
      });

      const ajax: AJAX<'arraybuffer'> = new AJAX<'arraybuffer'>('arraybuffer');

      const r: AJAXResponse<'arraybuffer'> = await ajax.put(url);

      expect(r.status).toBe(StatusCodes.OK);
      expect(r.body).toStrictEqual(bfr);
    });

    it('responds MULTIPLE_CHOICES', async () => {
      expect.assertions(1);

      fetchMock.mockResponse((): Promise<MockResponseInit> => {
        return Promise.resolve<MockResponseInit>({
          init: {
            status: StatusCodes.MULTIPLE_CHOICES,
            headers: {
              'Content-Type': 'text/html'
            }
          },
          body: JSON.stringify(jr)
        });
      });

      const ajax: AJAX<'text'> = new AJAX<'text'>('text');

      await expect(ajax.put(url)).rejects.toThrow(AJAXError);
    });

    it('responds BAD_REQUEST', async () => {
      expect.assertions(1);

      fetchMock.mockResponse((): Promise<MockResponseInit> => {
        return Promise.resolve<MockResponseInit>({
          init: {
            status: StatusCodes.BAD_REQUEST,
            headers: {
              'Content-Type': 'text/html'
            }
          },
          body: JSON.stringify(jr)
        });
      });

      const ajax: AJAX<'text'> = new AJAX<'text'>('text');

      await expect(ajax.put(url)).rejects.toThrow(AJAXError);
    });

    it('responds INTERNAL_SERVER_ERROR', async () => {
      expect.assertions(1);

      fetchMock.mockResponse((): Promise<MockResponseInit> => {
        return Promise.resolve<MockResponseInit>({
          init: {
            status: StatusCodes.INTERNAL_SERVER_ERROR,
            headers: {
              'Content-Type': 'text/html'
            }
          },
          body: JSON.stringify(jr)
        });
      });

      const ajax: AJAX<'text'> = new AJAX<'text'>('text');

      await expect(ajax.put(url)).rejects.toThrow(AJAXError);
    });
  });

  describe('delete', () => {
    it('responds CONTINUE', async () => {
      expect.assertions(1);

      fetchMock.mockResponse((): Promise<MockResponseInit> => {
        return Promise.resolve<MockResponseInit>({
          init: {
            status: StatusCodes.CONTINUE,
            headers: {
              'Content-Type': 'text/html'
            }
          },
          body: JSON.stringify(jr)
        });
      });

      const ajax: AJAX<'text'> = new AJAX<'text'>('text');

      await expect(ajax.delete(url)).rejects.toThrow(AJAXError);
    });

    it('responds OK: response is text', async () => {
      expect.assertions(2);

      fetchMock.mockResponse(async (): Promise<MockResponseInit> => {
        return Promise.resolve<MockResponseInit>({
          init: {
            status: StatusCodes.OK,
            headers: {
              'Content-Type': 'text/html'
            }
          },
          body: sr
        });
      });

      const ajax: AJAX<'text'> = new AJAX<'text'>('text');

      const r: AJAXResponse<'text'> = await ajax.delete(url);

      expect(r.status).toBe(StatusCodes.OK);
      expect(r.body).toBe(sr);
    });

    it('responds OK: response is json', async () => {
      expect.assertions(2);

      fetchMock.mockResponse(async (): Promise<MockResponseInit> => {
        return Promise.resolve<MockResponseInit>({
          init: {
            status: StatusCodes.OK,
            headers: {
              'Content-Type': 'text/html'
            }
          },
          body: JSON.stringify(jr)
        });
      });

      const ajax: AJAX<'json'> = new AJAX<'json'>('json');

      const r: AJAXResponse<'json'> = await ajax.delete(url);

      expect(r.status).toBe(StatusCodes.OK);
      expect(r.body).toStrictEqual(jr);
    });

    it('responds OK: response is blob', async () => {
      expect.assertions(2);

      fetchMock.mockResponse(async (): Promise<MockResponseInit> => {
        return Promise.resolve<MockResponseInit>({
          init: {
            status: StatusCodes.OK,
            headers: {
              'Content-Type': 'text/html'
            }
          },
          body: sr
        });
      });

      const ajax: AJAX<'blob'> = new AJAX<'blob'>('blob');

      const r: AJAXResponse<'blob'> = await ajax.delete(url);

      expect(r.status).toBe(StatusCodes.OK);
      expect(r.body.size).toBe(br.size);
    });

    it('responds OK: response is arraybuffer', async () => {
      expect.assertions(2);

      fetchMock.mockResponse(async (): Promise<MockResponseInit> => {
        return Promise.resolve<MockResponseInit>({
          init: {
            status: StatusCodes.OK,
            headers: {
              'Content-Type': 'text/html'
            }
          },
          body: bufToChar(bfr)
        });
      });

      const ajax: AJAX<'arraybuffer'> = new AJAX<'arraybuffer'>('arraybuffer');

      const r: AJAXResponse<'arraybuffer'> = await ajax.delete(url);

      expect(r.status).toBe(StatusCodes.OK);
      expect(r.body).toStrictEqual(bfr);
    });

    it('responds MULTIPLE_CHOICE', async () => {
      expect.assertions(1);

      fetchMock.mockResponse(async (): Promise<MockResponseInit> => {
        return Promise.resolve<MockResponseInit>({
          init: {
            status: StatusCodes.MULTIPLE_CHOICES,
            headers: {
              'Content-Type': 'text/html'
            }
          },
          body: JSON.stringify(jr)
        });
      });

      const ajax: AJAX<'text'> = new AJAX<'text'>('text');

      await expect(ajax.delete(url)).rejects.toThrow(AJAXError);
    });

    it('responds BAD_REQUEST', async () => {
      expect.assertions(1);

      fetchMock.mockResponse(async (): Promise<MockResponseInit> => {
        return Promise.resolve<MockResponseInit>({
          init: {
            status: StatusCodes.BAD_REQUEST,
            headers: {
              'Content-Type': 'text/html'
            }
          },
          body: JSON.stringify(jr)
        });
      });

      const ajax: AJAX<'text'> = new AJAX<'text'>('text');

      await expect(ajax.delete(url)).rejects.toThrow(AJAXError);
    });

    it('responds INTERNAL_SERVER_ERROR', async () => {
      expect.assertions(1);

      fetchMock.mockResponse(async (): Promise<MockResponseInit> => {
        return Promise.resolve<MockResponseInit>({
          init: {
            status: StatusCodes.INTERNAL_SERVER_ERROR,
            headers: {
              'Content-Type': 'text/html'
            }
          },
          body: JSON.stringify(jr)
        });
      });

      const ajax: AJAX<'text'> = new AJAX<'text'>('text');

      await expect(ajax.delete(url)).rejects.toThrow(AJAXError);
    });
  });

  describe('head', () => {
    it('responds CONTINUE', async () => {
      expect.assertions(1);

      fetchMock.mockResponse((): Promise<MockResponseInit> => {
        return Promise.resolve<MockResponseInit>({
          init: {
            status: StatusCodes.CONTINUE,
            headers: {
              'Content-Type': 'text/html'
            }
          },
          body: JSON.stringify(jr)
        });
      });

      const ajax: AJAX<'text'> = new AJAX<'text'>('text');

      await expect(ajax.head(url)).rejects.toThrow(AJAXError);
    });

    it('responds OK: response is text', async () => {
      expect.assertions(2);

      fetchMock.mockResponse(async (): Promise<MockResponseInit> => {
        return Promise.resolve<MockResponseInit>({
          init: {
            status: StatusCodes.OK,
            headers: {
              'Content-Type': 'text/html'
            }
          },
          body: sr
        });
      });

      const ajax: AJAX<'text'> = new AJAX<'text'>('text');

      const r: AJAXResponse<'text'> = await ajax.head(url);

      expect(r.status).toBe(StatusCodes.OK);
      expect(r.body).toBe(sr);
    });

    it('responds OK: response is json', async () => {
      expect.assertions(2);

      fetchMock.mockResponse(async (): Promise<MockResponseInit> => {
        return Promise.resolve<MockResponseInit>({
          init: {
            status: StatusCodes.OK,
            headers: {
              'Content-Type': 'text/html'
            }
          },
          body: JSON.stringify(jr)
        });
      });

      const ajax: AJAX<'json'> = new AJAX<'json'>('json');

      const r: AJAXResponse<'json'> = await ajax.head(url);

      expect(r.status).toBe(StatusCodes.OK);
      expect(r.body).toStrictEqual(jr);
    });

    it('responds OK: response is blob', async () => {
      expect.assertions(2);

      fetchMock.mockResponse(async (): Promise<MockResponseInit> => {
        return Promise.resolve<MockResponseInit>({
          init: {
            status: StatusCodes.OK,
            headers: {
              'Content-Type': 'text/html'
            }
          },
          body: sr
        });
      });

      const ajax: AJAX<'blob'> = new AJAX<'blob'>('blob');

      const r: AJAXResponse<'blob'> = await ajax.head(url);

      expect(r.status).toBe(StatusCodes.OK);
      expect(r.body.size).toBe(br.size);
    });

    it('responds OK: response is arraybuffer', async () => {
      expect.assertions(2);

      fetchMock.mockResponse(async (): Promise<MockResponseInit> => {
        return Promise.resolve<MockResponseInit>({
          init: {
            status: StatusCodes.OK,
            headers: {
              'Content-Type': 'text/html'
            }
          },
          body: bufToChar(bfr)
        });
      });

      const ajax: AJAX<'arraybuffer'> = new AJAX<'arraybuffer'>('arraybuffer');

      const r: AJAXResponse<'arraybuffer'> = await ajax.head(url);

      expect(r.status).toBe(StatusCodes.OK);
      expect(r.body).toStrictEqual(bfr);
    });

    it('responds MULTIPLE_CHOICE', async () => {
      expect.assertions(1);

      fetchMock.mockResponse(async (): Promise<MockResponseInit> => {
        return Promise.resolve<MockResponseInit>({
          init: {
            status: StatusCodes.MULTIPLE_CHOICES,
            headers: {
              'Content-Type': 'text/html'
            }
          },
          body: JSON.stringify(jr)
        });
      });

      const ajax: AJAX<'text'> = new AJAX<'text'>('text');

      await expect(ajax.head(url)).rejects.toThrow(AJAXError);
    });

    it('responds BAD_REQUEST', async () => {
      expect.assertions(1);

      fetchMock.mockResponse(async (): Promise<MockResponseInit> => {
        return Promise.resolve<MockResponseInit>({
          init: {
            status: StatusCodes.BAD_REQUEST,
            headers: {
              'Content-Type': 'text/html'
            }
          },
          body: JSON.stringify(jr)
        });
      });

      const ajax: AJAX<'text'> = new AJAX<'text'>('text');

      await expect(ajax.head(url)).rejects.toThrow(AJAXError);
    });

    it('responds INTERNAL_SERVER_ERROR', async () => {
      expect.assertions(1);

      fetchMock.mockResponse(async (): Promise<MockResponseInit> => {
        return Promise.resolve<MockResponseInit>({
          init: {
            status: StatusCodes.INTERNAL_SERVER_ERROR,
            headers: {
              'Content-Type': 'text/html'
            }
          },
          body: JSON.stringify(jr)
        });
      });

      const ajax: AJAX<'text'> = new AJAX<'text'>('text');

      await expect(ajax.head(url)).rejects.toThrow(AJAXError);
    });
  });
});
