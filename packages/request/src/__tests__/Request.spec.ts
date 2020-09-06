import nock, { Scope } from 'nock';
import { RequestError } from '../Error/RequestError';
import { Request } from '../Request';
import { RequestResponse } from '../RequestResponse';

const byte: Buffer = Buffer.from('f8060634-7b33-4582-8bb5-a8e98e91cc4f');
const url: string = 'https://d9ba7103-e6a4-4415-b65d-8867f2caaad6.com';
const OK: number = 200;
const MULTIPLE_CHOICE: number = 300;
const BAD_REQUEST: number = 400;
const INTERNAL_SERVER_ERROR: number = 500;

describe('Request', () => {
  describe('get', () => {
    it('responds OK', async () => {
      expect.assertions(2);
      const scope: Scope = nock(url).get('/').reply(OK, byte);

      const request: Request = new Request();

      const r: RequestResponse = await request.get(url);

      expect(r.status).toBe(OK);
      expect(r.body).toStrictEqual(byte);
      scope.done();
    });

    it('responds MULTIPLE_CHOICE', async () => {
      expect.assertions(1);
      const scope: Scope = nock(url).get('/').reply(MULTIPLE_CHOICE, byte);

      const request: Request = new Request();

      await expect(request.get(url)).rejects.toThrow(RequestError);
      scope.done();
    });

    it('responds BAD_REQUEST', async () => {
      expect.assertions(1);
      const scope: Scope = nock(url).get('/').reply(BAD_REQUEST, byte);

      const request: Request = new Request();

      await expect(request.get(url)).rejects.toThrow(RequestError);
      scope.done();
    });

    it('responds INTERNAL_SERVER_ERROR', async () => {
      expect.assertions(1);
      const scope: Scope = nock(url).get('/').reply(INTERNAL_SERVER_ERROR, byte);

      const request: Request = new Request();

      await expect(request.get(url)).rejects.toThrow(RequestError);
      scope.done();
    });
  });

  describe('post', () => {
    it('responds OK', async () => {
      expect.assertions(2);
      const scope: Scope = nock(url).post('/').reply(OK, byte);

      const request: Request = new Request();

      const r: RequestResponse = await request.post(url);

      expect(r.status).toBe(OK);
      expect(r.body).toStrictEqual(byte);
      scope.done();
    });

    it('responds MULTIPLE_CHOICE', async () => {
      expect.assertions(1);
      const scope: Scope = nock(url).post('/').reply(MULTIPLE_CHOICE, byte);

      const request: Request = new Request();

      await expect(request.post(url)).rejects.toThrow(RequestError);
      scope.done();
    });

    it('responds BAD_REQUEST', async () => {
      expect.assertions(1);
      const scope: Scope = nock(url).post('/').reply(BAD_REQUEST, byte);

      const request: Request = new Request();

      await expect(request.post(url)).rejects.toThrow(RequestError);
      scope.done();
    });

    it('responds INTERNAL_SERVER_ERROR', async () => {
      expect.assertions(1);
      const scope: Scope = nock(url).post('/').reply(INTERNAL_SERVER_ERROR, byte);

      const request: Request = new Request();

      await expect(request.post(url)).rejects.toThrow(RequestError);
      scope.done();
    });
  });

  describe('put', () => {
    it('byte: responds OK', async () => {
      expect.assertions(2);
      const scope: Scope = nock(url).put('/').reply(OK, byte);

      const request: Request = new Request();

      const r: RequestResponse = await request.put(url);

      expect(r.status).toBe(OK);
      expect(r.body).toStrictEqual(byte);
      scope.done();
    });

    it('responds MULTIPLE_CHOICE', async () => {
      expect.assertions(1);
      const scope: Scope = nock(url).put('/').reply(MULTIPLE_CHOICE, byte);

      const request: Request = new Request();

      await expect(request.put(url)).rejects.toThrow(RequestError);
      scope.done();
    });

    it('responds BAD_REQUEST', async () => {
      expect.assertions(1);
      const scope: Scope = nock(url).put('/').reply(BAD_REQUEST, byte);

      const request: Request = new Request();

      await expect(request.put(url)).rejects.toThrow(RequestError);
      scope.done();
    });

    it('responds INTERNAL_SERVER_ERROR', async () => {
      expect.assertions(1);
      const scope: Scope = nock(url).put('/').reply(INTERNAL_SERVER_ERROR, byte);

      const request: Request = new Request();

      await expect(request.put(url)).rejects.toThrow(RequestError);
      scope.done();
    });
  });

  describe('delete', () => {
    it('byte: responds OK', async () => {
      expect.assertions(2);
      const scope: Scope = nock(url).delete('/').reply(OK, byte);

      const request: Request = new Request();

      const r: RequestResponse = await request.delete(url);

      expect(r.status).toBe(OK);
      expect(r.body).toStrictEqual(byte);
      scope.done();
    });

    it('responds MULTIPLE_CHOICE', async () => {
      expect.assertions(1);
      const scope: Scope = nock(url).delete('/').reply(MULTIPLE_CHOICE, byte);

      const request: Request = new Request();

      await expect(request.delete(url)).rejects.toThrow(RequestError);
      scope.done();
    });

    it('responds BAD_REQUEST', async () => {
      expect.assertions(1);
      const scope: Scope = nock(url).delete('/').reply(BAD_REQUEST, byte);

      const request: Request = new Request();

      await expect(request.delete(url)).rejects.toThrow(RequestError);
      scope.done();
    });

    it('responds INTERNAL_SERVER_ERROR', async () => {
      expect.assertions(1);
      const scope: Scope = nock(url).delete('/').reply(INTERNAL_SERVER_ERROR, byte);

      const request: Request = new Request();

      await expect(request.delete(url)).rejects.toThrow(RequestError);
      scope.done();
    });
  });

  describe('head', () => {
    it('byte: responds OK', async () => {
      expect.assertions(2);
      const scope: Scope = nock(url).head('/').reply(OK);

      const request: Request = new Request();

      const r: RequestResponse<null> = await request.head(url);

      expect(r.status).toBe(OK);
      expect(r.body).toBeNull();
      scope.done();
    });

    it('responds MULTIPLE_CHOICE', async () => {
      expect.assertions(1);
      const scope: Scope = nock(url).head('/').reply(MULTIPLE_CHOICE);

      const request: Request = new Request();

      await expect(request.head(url)).rejects.toThrow(RequestError);
      scope.done();
    });

    it('responds BAD_REQUEST', async () => {
      expect.assertions(1);
      const scope: Scope = nock(url).head('/').reply(BAD_REQUEST);

      const request: Request = new Request();

      await expect(request.head(url)).rejects.toThrow(RequestError);
      scope.done();
    });

    it('responds INTERNAL_SERVER_ERROR', async () => {
      expect.assertions(1);
      const scope: Scope = nock(url).head('/').reply(INTERNAL_SERVER_ERROR);

      const request: Request = new Request();

      await expect(request.head(url)).rejects.toThrow(RequestError);
      scope.done();
    });
  });
});
