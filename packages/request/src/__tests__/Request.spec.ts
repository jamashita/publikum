import nock, { Scope } from 'nock';
import { RequestError } from '../Error/RequestError';
import { Request } from '../Request';
import { RequestResponse } from '../RequestResponse';

type Res = Readonly<{
  mo: string;
  nu: boolean;
  pq: number;
}>;

const resObject: Res = {
  mo: 'response string',
  nu: false,
  pq: -13
};
const resRaw: string = 'ad8f3528-68f3-4434-8011-bef5cf0d2a9f';
const resByte: Buffer = Buffer.from('f8060634-7b33-4582-8bb5-a8e98e91cc4f');
const url: string = 'https://d9ba7103-e6a4-4415-b65d-8867f2caaad6.com';
const OK: number = 200;
const MULTIPLE_CHOICE: number = 300;
const BAD_REQUEST: number = 400;
const INTERNAL_SERVER_ERROR: number = 500;

describe('Request', () => {
  describe('get', () => {
    it('json: responds OK', async () => {
      expect.assertions(2);
      const scope: Scope = nock(url).get('/').reply(OK, resObject);

      const request: Request<'json'> = new Request<'json'>('json');

      const r: RequestResponse<'json'> = await request.get(url);

      expect(r.status).toBe(OK);
      expect(r.body).toStrictEqual(resObject);
      scope.done();
    });

    it('raw: responds OK', async () => {
      expect.assertions(2);
      const scope: Scope = nock(url).get('/').reply(OK, resRaw);

      const request: Request<'raw'> = new Request<'raw'>('raw');

      const r: RequestResponse<'raw'> = await request.get(url);

      expect(r.status).toBe(OK);
      expect(r.body).toStrictEqual(resRaw);
      scope.done();
    });

    it('byte: responds OK', async () => {
      expect.assertions(2);
      const scope: Scope = nock(url).get('/').reply(OK, resByte);

      const request: Request<'byte'> = new Request<'byte'>('byte');

      const r: RequestResponse<'byte'> = await request.get(url);

      expect(r.status).toBe(OK);
      expect(r.body).toStrictEqual(resByte);
      scope.done();
    });

    it('responds MULTIPLE_CHOICE', async () => {
      expect.assertions(1);
      const scope: Scope = nock(url).get('/').reply(MULTIPLE_CHOICE, resObject);

      const request: Request<'json'> = new Request<'json'>('json');

      await expect(request.get(url)).rejects.toThrow(RequestError);
      scope.done();
    });

    it('responds BAD_REQUEST', async () => {
      expect.assertions(1);
      const scope: Scope = nock(url).get('/').reply(BAD_REQUEST, resObject);

      const request: Request<'json'> = new Request<'json'>('json');

      await expect(request.get(url)).rejects.toThrow(RequestError);
      scope.done();
    });

    it('responds INTERNAL_SERVER_ERROR', async () => {
      expect.assertions(1);
      const scope: Scope = nock(url).get('/').reply(INTERNAL_SERVER_ERROR, resObject);

      const request: Request<'json'> = new Request<'json'>('json');

      await expect(request.get(url)).rejects.toThrow(RequestError);
      scope.done();
    });
  });

  describe('post', () => {
    it('json: responds OK', async () => {
      expect.assertions(2);
      const scope: Scope = nock(url).post('/').reply(OK, resObject);

      const request: Request<'json'> = new Request<'json'>('json');

      const r: RequestResponse<'json'> = await request.post(url);

      expect(r.status).toBe(OK);
      expect(r.body).toStrictEqual(resObject);
      scope.done();
    });

    it('raw: responds OK', async () => {
      expect.assertions(2);
      const scope: Scope = nock(url).post('/').reply(OK, resRaw);

      const request: Request<'raw'> = new Request<'raw'>('raw');

      const r: RequestResponse<'raw'> = await request.post(url);

      expect(r.status).toBe(OK);
      expect(r.body).toStrictEqual(resRaw);
      scope.done();
    });

    it('byte: responds OK', async () => {
      expect.assertions(2);
      const scope: Scope = nock(url).post('/').reply(OK, resByte);

      const request: Request<'byte'> = new Request<'byte'>('byte');

      const r: RequestResponse<'byte'> = await request.post(url);

      expect(r.status).toBe(OK);
      expect(r.body).toStrictEqual(resByte);
      scope.done();
    });

    it('responds MULTIPLE_CHOICE', async () => {
      expect.assertions(1);
      const scope: Scope = nock(url).post('/').reply(MULTIPLE_CHOICE, resObject);

      const request: Request<'json'> = new Request<'json'>('json');

      await expect(request.post(url)).rejects.toThrow(RequestError);
      scope.done();
    });

    it('responds BAD_REQUEST', async () => {
      expect.assertions(1);
      const scope: Scope = nock(url).post('/').reply(BAD_REQUEST, resObject);

      const request: Request<'json'> = new Request<'json'>('json');

      await expect(request.post(url)).rejects.toThrow(RequestError);
      scope.done();
    });

    it('responds INTERNAL_SERVER_ERROR', async () => {
      expect.assertions(1);
      const scope: Scope = nock(url).post('/').reply(INTERNAL_SERVER_ERROR, resObject);

      const request: Request<'json'> = new Request<'json'>('json');

      await expect(request.post(url)).rejects.toThrow(RequestError);
      scope.done();
    });
  });

  describe('put', () => {
    it('json: responds OK', async () => {
      expect.assertions(2);
      const scope: Scope = nock(url).put('/').reply(OK, resObject);

      const request: Request<'json'> = new Request<'json'>('json');

      const r: RequestResponse<'json'> = await request.put(url);

      expect(r.status).toBe(OK);
      expect(r.body).toStrictEqual(resObject);
      scope.done();
    });

    it('raw: responds OK', async () => {
      expect.assertions(2);
      const scope: Scope = nock(url).put('/').reply(OK, resRaw);

      const request: Request<'raw'> = new Request<'raw'>('raw');

      const r: RequestResponse<'raw'> = await request.put(url);

      expect(r.status).toBe(OK);
      expect(r.body).toStrictEqual(resRaw);
      scope.done();
    });

    it('byte: responds OK', async () => {
      expect.assertions(2);
      const scope: Scope = nock(url).put('/').reply(OK, resByte);

      const request: Request<'byte'> = new Request<'byte'>('byte');

      const r: RequestResponse<'byte'> = await request.put(url);

      expect(r.status).toBe(OK);
      expect(r.body).toStrictEqual(resByte);
      scope.done();
    });

    it('responds MULTIPLE_CHOICE', async () => {
      expect.assertions(1);
      const scope: Scope = nock(url).put('/').reply(MULTIPLE_CHOICE, resObject);

      const request: Request<'json'> = new Request<'json'>('json');

      await expect(request.put(url)).rejects.toThrow(RequestError);
      scope.done();
    });

    it('responds BAD_REQUEST', async () => {
      expect.assertions(1);
      const scope: Scope = nock(url).put('/').reply(BAD_REQUEST, resObject);

      const request: Request<'json'> = new Request<'json'>('json');

      await expect(request.put(url)).rejects.toThrow(RequestError);
      scope.done();
    });

    it('responds INTERNAL_SERVER_ERROR', async () => {
      expect.assertions(1);
      const scope: Scope = nock(url).put('/').reply(INTERNAL_SERVER_ERROR, resObject);

      const request: Request<'json'> = new Request<'json'>('json');

      await expect(request.put(url)).rejects.toThrow(RequestError);
      scope.done();
    });
  });

  describe('delete', () => {
    it('json: responds OK', async () => {
      expect.assertions(2);
      const scope: Scope = nock(url).delete('/').reply(OK, resObject);

      const request: Request<'json'> = new Request<'json'>('json');

      const r: RequestResponse<'json'> = await request.delete(url);

      expect(r.status).toBe(OK);
      expect(r.body).toStrictEqual(resObject);
      scope.done();
    });

    it('raw: responds OK', async () => {
      expect.assertions(2);
      const scope: Scope = nock(url).delete('/').reply(OK, resRaw);

      const request: Request<'raw'> = new Request<'raw'>('raw');

      const r: RequestResponse<'raw'> = await request.delete(url);

      expect(r.status).toBe(OK);
      expect(r.body).toStrictEqual(resRaw);
      scope.done();
    });

    it('byte: responds OK', async () => {
      expect.assertions(2);
      const scope: Scope = nock(url).delete('/').reply(OK, resByte);

      const request: Request<'byte'> = new Request<'byte'>('byte');

      const r: RequestResponse<'byte'> = await request.delete(url);

      expect(r.status).toBe(OK);
      expect(r.body).toStrictEqual(resByte);
      scope.done();
    });

    it('responds MULTIPLE_CHOICE', async () => {
      expect.assertions(1);
      const scope: Scope = nock(url).delete('/').reply(MULTIPLE_CHOICE, resObject);

      const request: Request<'json'> = new Request<'json'>('json');

      await expect(request.delete(url)).rejects.toThrow(RequestError);
      scope.done();
    });

    it('responds BAD_REQUEST', async () => {
      expect.assertions(1);
      const scope: Scope = nock(url).delete('/').reply(BAD_REQUEST, resObject);

      const request: Request<'json'> = new Request<'json'>('json');

      await expect(request.delete(url)).rejects.toThrow(RequestError);
      scope.done();
    });

    it('responds INTERNAL_SERVER_ERROR', async () => {
      expect.assertions(1);
      const scope: Scope = nock(url).delete('/').reply(INTERNAL_SERVER_ERROR, resObject);

      const request: Request<'json'> = new Request<'json'>('json');

      await expect(request.delete(url)).rejects.toThrow(RequestError);
      scope.done();
    });
  });
});
