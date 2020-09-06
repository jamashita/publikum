import nock, { Scope } from 'nock';
import { RequestError } from '../Error/RequestError';
import { Request } from '../Request';
import { RequestResponse } from '../RequestResponse';

const res: object = {
  mo: 'response string',
  nu: false,
  pq: -13
};
const strRes: string = JSON.stringify({
  mo: 'response string',
  nu: false,
  pq: -13
});
const bufferRes: Buffer = Buffer.from('f8060634-7b33-4582-8bb5-a8e98e91cc4f');
const url: string = 'https://d9ba7103-e6a4-4415-b65d-8867f2caaad6.com';
const OK: number = 200;
const MULTIPLE_CHOICE: number = 300;
const BAD_REQUEST: number = 400;
const INTERNAL_SERVER_ERROR: number = 500;

describe('Request', () => {
  describe('get', () => {
    it('text: responds OK', async () => {
      expect.assertions(2);
      const scope: Scope = nock(url).get('/').reply(OK, strRes);

      const request: Request<'text'> = new Request<'text'>('text');

      const r: RequestResponse<'text'> = await request.get(url);

      expect(r.status).toBe(OK);
      expect(r.body).toBe(strRes);
      scope.done();
    });

    it('json: responds OK', async () => {
      expect.assertions(2);
      const scope: Scope = nock(url).get('/').reply(OK, res);

      const request: Request<'json'> = new Request<'json'>('json');

      const r: RequestResponse<'json'> = await request.get(url);

      expect(r.status).toBe(OK);
      expect(r.body).toStrictEqual(res);
      scope.done();
    });

    it('buffer: responds OK', async () => {
      expect.assertions(2);
      const scope: Scope = nock(url).get('/').reply(OK, bufferRes);

      const request: Request<'buffer'> = new Request<'buffer'>('buffer');

      const r: RequestResponse<'buffer'> = await request.get(url);

      expect(r.status).toBe(OK);
      expect(r.body.equals(bufferRes)).toBe(true);
      scope.done();
    });

    it('responds MULTIPLE_CHOICE', async () => {
      expect.assertions(1);
      const scope: Scope = nock(url).get('/').reply(MULTIPLE_CHOICE, bufferRes);

      const request: Request<'text'> = new Request<'text'>('text');

      await expect(request.get(url)).rejects.toThrow(RequestError);
      scope.done();
    });

    it('responds BAD_REQUEST', async () => {
      expect.assertions(1);
      const scope: Scope = nock(url).get('/').reply(BAD_REQUEST, bufferRes);

      const request: Request<'text'> = new Request<'text'>('text');

      await expect(request.get(url)).rejects.toThrow(RequestError);
      scope.done();
    });

    it('responds INTERNAL_SERVER_ERROR', async () => {
      expect.assertions(1);
      const scope: Scope = nock(url).get('/').reply(INTERNAL_SERVER_ERROR, bufferRes);

      const request: Request<'text'> = new Request<'text'>('text');

      await expect(request.get(url)).rejects.toThrow(RequestError);
      scope.done();
    });
  });

  describe('post', () => {
    it('text: responds OK', async () => {
      expect.assertions(2);
      const scope: Scope = nock(url).post('/').reply(OK, strRes);

      const request: Request<'text'> = new Request('text');

      const r: RequestResponse<'text'> = await request.post(url);

      expect(r.status).toBe(OK);
      expect(r.body).toBe(strRes);
      scope.done();
    });

    it('json: responds OK', async () => {
      expect.assertions(2);
      const scope: Scope = nock(url).post('/').reply(OK, res);

      const request: Request<'json'> = new Request<'json'>('json');

      const r: RequestResponse<'json'> = await request.post(url);

      expect(r.status).toBe(OK);
      expect(r.body).toStrictEqual(res);
      scope.done();
    });

    it('buffer: responds OK', async () => {
      expect.assertions(2);
      const scope: Scope = nock(url).post('/').reply(OK, bufferRes);

      const request: Request<'buffer'> = new Request<'buffer'>('buffer');

      const r: RequestResponse<'buffer'> = await request.post(url);

      expect(r.status).toBe(OK);
      expect(r.body.equals(bufferRes)).toBe(true);
      scope.done();
    });

    it('responds MULTIPLE_CHOICE', async () => {
      expect.assertions(1);
      const scope: Scope = nock(url).post('/').reply(MULTIPLE_CHOICE, bufferRes);

      const request: Request<'text'> = new Request<'text'>('text');

      await expect(request.post(url)).rejects.toThrow(RequestError);
      scope.done();
    });

    it('responds BAD_REQUEST', async () => {
      expect.assertions(1);
      const scope: Scope = nock(url).post('/').reply(BAD_REQUEST, bufferRes);

      const request: Request<'text'> = new Request<'text'>('text');

      await expect(request.post(url)).rejects.toThrow(RequestError);
      scope.done();
    });

    it('responds INTERNAL_SERVER_ERROR', async () => {
      expect.assertions(1);
      const scope: Scope = nock(url).post('/').reply(INTERNAL_SERVER_ERROR, bufferRes);

      const request: Request<'text'> = new Request<'text'>('text');

      await expect(request.post(url)).rejects.toThrow(RequestError);
      scope.done();
    });
  });

  describe('put', () => {
    it('text: responds OK', async () => {
      expect.assertions(2);
      const scope: Scope = nock(url).put('/').reply(OK, strRes);

      const request: Request<'text'> = new Request<'text'>('text');

      const r: RequestResponse<'text'> = await request.put(url);

      expect(r.status).toBe(OK);
      expect(r.body).toBe(strRes);
      scope.done();
    });

    it('json: responds OK', async () => {
      expect.assertions(2);
      const scope: Scope = nock(url).put('/').reply(OK, res);

      const request: Request<'json'> = new Request<'json'>('json');

      const r: RequestResponse<'json'> = await request.put(url);

      expect(r.status).toBe(OK);
      expect(r.body).toStrictEqual(res);
      scope.done();
    });

    it('buffer: responds OK', async () => {
      expect.assertions(2);
      const scope: Scope = nock(url).put('/').reply(OK, bufferRes);

      const request: Request<'buffer'> = new Request<'buffer'>('buffer');

      const r: RequestResponse<'buffer'> = await request.put(url);

      expect(r.status).toBe(OK);
      expect(r.body.equals(bufferRes)).toBe(true);
      scope.done();
    });

    it('responds MULTIPLE_CHOICE', async () => {
      expect.assertions(1);
      const scope: Scope = nock(url).put('/').reply(MULTIPLE_CHOICE, bufferRes);

      const request: Request<'text'> = new Request<'text'>('text');

      await expect(request.put(url)).rejects.toThrow(RequestError);
      scope.done();
    });

    it('responds BAD_REQUEST', async () => {
      expect.assertions(1);
      const scope: Scope = nock(url).put('/').reply(BAD_REQUEST, bufferRes);

      const request: Request<'text'> = new Request<'text'>('text');

      await expect(request.put(url)).rejects.toThrow(RequestError);
      scope.done();
    });

    it('responds INTERNAL_SERVER_ERROR', async () => {
      expect.assertions(1);
      const scope: Scope = nock(url).put('/').reply(INTERNAL_SERVER_ERROR, bufferRes);

      const request: Request<'text'> = new Request<'text'>('text');

      await expect(request.put(url)).rejects.toThrow(RequestError);
      scope.done();
    });
  });

  describe('delete', () => {
    it('text: responds OK', async () => {
      expect.assertions(2);
      const scope: Scope = nock(url).delete('/').reply(OK, strRes);

      const request: Request<'text'> = new Request<'text'>('text');

      const r: RequestResponse<'text'> = await request.delete(url);

      expect(r.status).toBe(OK);
      expect(r.body).toBe(strRes);
      scope.done();
    });

    it('json: responds OK', async () => {
      expect.assertions(2);
      const scope: Scope = nock(url).delete('/').reply(OK, res);

      const request: Request<'json'> = new Request<'json'>('json');

      const r: RequestResponse<'json'> = await request.delete(url);

      expect(r.status).toBe(OK);
      expect(r.body).toStrictEqual(res);
      scope.done();
    });

    it('buffer: responds OK', async () => {
      expect.assertions(2);
      const scope: Scope = nock(url).delete('/').reply(OK, bufferRes);

      const request: Request<'buffer'> = new Request<'buffer'>('buffer');

      const r: RequestResponse<'buffer'> = await request.delete(url);

      expect(r.status).toBe(OK);
      expect(r.body.equals(bufferRes)).toBe(true);
      scope.done();
    });

    it('responds MULTIPLE_CHOICE', async () => {
      expect.assertions(1);
      const scope: Scope = nock(url).delete('/').reply(MULTIPLE_CHOICE, bufferRes);

      const request: Request<'text'> = new Request<'text'>('text');

      await expect(request.delete(url)).rejects.toThrow(RequestError);
      scope.done();
    });

    it('responds BAD_REQUEST', async () => {
      expect.assertions(1);
      const scope: Scope = nock(url).delete('/').reply(BAD_REQUEST, bufferRes);

      const request: Request<'text'> = new Request<'text'>('text');

      await expect(request.delete(url)).rejects.toThrow(RequestError);
      scope.done();
    });

    it('responds INTERNAL_SERVER_ERROR', async () => {
      expect.assertions(1);
      const scope: Scope = nock(url).delete('/').reply(INTERNAL_SERVER_ERROR, bufferRes);

      const request: Request<'text'> = new Request<'text'>('text');

      await expect(request.delete(url)).rejects.toThrow(RequestError);
      scope.done();
    });
  });

  describe('head', () => {
    it('text: responds OK', async () => {
      expect.assertions(2);
      const scope: Scope = nock(url).head('/').reply(OK, strRes);

      const request: Request<'text'> = new Request<'text'>('text');

      const r: RequestResponse<'text'> = await request.head(url);

      expect(r.status).toBe(OK);
      expect(r.body).toBe(strRes);
      scope.done();
    });

    it('json: responds OK', async () => {
      expect.assertions(2);
      const scope: Scope = nock(url).head('/').reply(OK, res);

      const request: Request<'json'> = new Request<'json'>('json');

      const r: RequestResponse<'json'> = await request.head(url);

      expect(r.status).toBe(OK);
      expect(r.body).toStrictEqual(res);
      scope.done();
    });

    it('buffer: responds OK', async () => {
      expect.assertions(2);
      const scope: Scope = nock(url).head('/').reply(OK, bufferRes);

      const request: Request<'buffer'> = new Request<'buffer'>('buffer');

      const r: RequestResponse<'buffer'> = await request.head(url);

      expect(r.status).toBe(OK);
      expect(r.body.equals(bufferRes)).toBe(true);
      scope.done();
    });

    it('responds MULTIPLE_CHOICE', async () => {
      expect.assertions(1);
      const scope: Scope = nock(url).head('/').reply(MULTIPLE_CHOICE);

      const request: Request<'text'> = new Request<'text'>('text');

      await expect(request.head(url)).rejects.toThrow(RequestError);
      scope.done();
    });

    it('responds BAD_REQUEST', async () => {
      expect.assertions(1);
      const scope: Scope = nock(url).head('/').reply(BAD_REQUEST);

      const request: Request<'text'> = new Request<'text'>('text');

      await expect(request.head(url)).rejects.toThrow(RequestError);
      scope.done();
    });

    it('responds INTERNAL_SERVER_ERROR', async () => {
      expect.assertions(1);
      const scope: Scope = nock(url).head('/').reply(INTERNAL_SERVER_ERROR);

      const request: Request<'text'> = new Request<'text'>('text');

      await expect(request.head(url)).rejects.toThrow(RequestError);
      scope.done();
    });
  });
});
