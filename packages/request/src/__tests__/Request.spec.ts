import { ObjectLiteral } from '@jamashita/publikum-type';
import { StatusCodes } from 'http-status-codes';
import nock, { Scope } from 'nock';
import { RequestError } from '../Error/RequestError';
import { Request } from '../Request';
import { RequestResponse } from '../RequestResponse';

const sr: string = 'ce8781d8-85ac-4b3e-908f-17253facb1af';
const jr: ObjectLiteral = {
  mo: 'response string',
  nu: false,
  pq: -13
};
const br: Buffer = Buffer.from('f8060634-7b33-4582-8bb5-a8e98e91cc4f');
const url: string = 'https://example.com';

describe('Request', () => {
  beforeEach(() => {
    if (!nock.isActive()) {
      nock.activate();
    }
  });

  afterEach(() => {
    nock.cleanAll();
    nock.restore();
  });

  beforeAll(() => {
    nock.disableNetConnect();
  });

  afterAll(() => {
    nock.enableNetConnect();
  });

  describe('get', () => {
    it('responds CONTINUE', async () => {
      expect.assertions(1);

      const scope: Scope = nock(url).get('/').reply(StatusCodes.CONTINUE, br);

      const request: Request<'text'> = new Request<'text'>('text');

      await expect(request.get(url)).rejects.toThrow(RequestError);
      scope.done();
      nock.restore();
    });

    it('responds OK: response is text', async () => {
      expect.assertions(2);

      const scope: Scope = nock(url).get('/').reply(StatusCodes.OK, sr);

      const request: Request<'text'> = new Request<'text'>('text');

      const r: RequestResponse<'text'> = await request.get(url);

      expect(r.status).toBe(StatusCodes.OK);
      expect(r.body).toBe(sr);
      scope.done();
      nock.restore();
    });

    it('responds OK: response is json', async () => {
      expect.assertions(2);

      const scope: Scope = nock(url).get('/').reply(StatusCodes.OK, jr);

      const request: Request<'json'> = new Request<'json'>('json');

      const r: RequestResponse<'json'> = await request.get(url);

      expect(r.status).toBe(StatusCodes.OK);
      expect(r.body).toStrictEqual(jr);
      scope.done();
      nock.restore();
    });

    it('responds OK: response is buffer', async () => {
      expect.assertions(2);

      const scope: Scope = nock(url).get('/').reply(StatusCodes.OK, br);

      const request: Request<'buffer'> = new Request<'buffer'>('buffer');

      const r: RequestResponse<'buffer'> = await request.get(url);

      expect(r.status).toBe(StatusCodes.OK);
      expect(r.body.equals(br)).toBe(true);
      scope.done();
      nock.restore();
    });

    it('responds MULTIPLE_CHOICES', async () => {
      expect.assertions(1);

      const scope: Scope = nock(url).get('/').reply(StatusCodes.MULTIPLE_CHOICES, br);

      const request: Request<'text'> = new Request<'text'>('text');

      await expect(request.get(url)).rejects.toThrow(RequestError);
      scope.done();
      nock.restore();
    });

    it('responds BAD_REQUEST', async () => {
      expect.assertions(1);

      const scope: Scope = nock(url).get('/').reply(StatusCodes.BAD_REQUEST, br);

      const request: Request<'text'> = new Request<'text'>('text');

      await expect(request.get(url)).rejects.toThrow(RequestError);
      scope.done();
      nock.restore();
    });

    it('responds INTERNAL_SERVER_ERROR', async () => {
      expect.assertions(1);

      const scope: Scope = nock(url).get('/').reply(StatusCodes.INTERNAL_SERVER_ERROR, br);

      const request: Request<'text'> = new Request<'text'>('text');

      await expect(request.get(url)).rejects.toThrow(RequestError);
      scope.done();
      nock.restore();
    });
  });

  describe('post', () => {
    it('responds CONTINUE', async () => {
      expect.assertions(1);

      const scope: Scope = nock(url).post('/').reply(StatusCodes.CONTINUE, br);

      const request: Request<'text'> = new Request<'text'>('text');

      await expect(request.post(url)).rejects.toThrow(RequestError);
      scope.done();
      nock.restore();
    });

    it('responds OK: response is text', async () => {
      expect.assertions(2);

      const scope: Scope = nock(url).post('/').reply(StatusCodes.OK, sr);

      const request: Request<'text'> = new Request('text');

      const r: RequestResponse<'text'> = await request.post(url);

      expect(r.status).toBe(StatusCodes.OK);
      expect(r.body).toBe(sr);
      scope.done();
      nock.restore();
    });

    it('responds OK: response is json', async () => {
      expect.assertions(2);

      const scope: Scope = nock(url).post('/').reply(StatusCodes.OK, jr);

      const request: Request<'json'> = new Request<'json'>('json');

      const r: RequestResponse<'json'> = await request.post(url);

      expect(r.status).toBe(StatusCodes.OK);
      expect(r.body).toStrictEqual(jr);
      scope.done();
      nock.restore();
    });

    it('responds OK: response is buffer', async () => {
      expect.assertions(2);

      const scope: Scope = nock(url).post('/').reply(StatusCodes.OK, br);

      const request: Request<'buffer'> = new Request<'buffer'>('buffer');

      const r: RequestResponse<'buffer'> = await request.post(url);

      expect(r.status).toBe(StatusCodes.OK);
      expect(r.body.equals(br)).toBe(true);
      scope.done();
      nock.restore();
    });

    it('responds MULTIPLE_CHOICES', async () => {
      expect.assertions(1);

      const scope: Scope = nock(url).post('/').reply(StatusCodes.MULTIPLE_CHOICES, br);

      const request: Request<'text'> = new Request<'text'>('text');

      await expect(request.post(url)).rejects.toThrow(RequestError);
      scope.done();
      nock.restore();
    });

    it('responds BAD_REQUEST', async () => {
      expect.assertions(1);

      const scope: Scope = nock(url).post('/').reply(StatusCodes.BAD_REQUEST, br);

      const request: Request<'text'> = new Request<'text'>('text');

      await expect(request.post(url)).rejects.toThrow(RequestError);
      scope.done();
      nock.restore();
    });

    it('responds INTERNAL_SERVER_ERROR', async () => {
      expect.assertions(1);

      const scope: Scope = nock(url).post('/').reply(StatusCodes.INTERNAL_SERVER_ERROR, br);

      const request: Request<'text'> = new Request<'text'>('text');

      await expect(request.post(url)).rejects.toThrow(RequestError);
      scope.done();
      nock.restore();
    });
  });

  describe('put', () => {
    it('responds CONTINUE', async () => {
      expect.assertions(1);

      const scope: Scope = nock(url).put('/').reply(StatusCodes.CONTINUE, br);

      const request: Request<'text'> = new Request<'text'>('text');

      await expect(request.put(url)).rejects.toThrow(RequestError);
      scope.done();
      nock.restore();
    });

    it('responds OK: response is text', async () => {
      expect.assertions(2);

      const scope: Scope = nock(url).put('/').reply(StatusCodes.OK, sr);

      const request: Request<'text'> = new Request<'text'>('text');

      const r: RequestResponse<'text'> = await request.put(url);

      expect(r.status).toBe(StatusCodes.OK);
      expect(r.body).toBe(sr);
      scope.done();
      nock.restore();
    });

    it('responds OK: response is json', async () => {
      expect.assertions(2);

      const scope: Scope = nock(url).put('/').reply(StatusCodes.OK, jr);

      const request: Request<'json'> = new Request<'json'>('json');

      const r: RequestResponse<'json'> = await request.put(url);

      expect(r.status).toBe(StatusCodes.OK);
      expect(r.body).toStrictEqual(jr);
      scope.done();
      nock.restore();
    });

    it('responds OK: response is buffer', async () => {
      expect.assertions(2);

      const scope: Scope = nock(url).put('/').reply(StatusCodes.OK, br);

      const request: Request<'buffer'> = new Request<'buffer'>('buffer');

      const r: RequestResponse<'buffer'> = await request.put(url);

      expect(r.status).toBe(StatusCodes.OK);
      expect(r.body.equals(br)).toBe(true);
      scope.done();
      nock.restore();
    });

    it('responds MULTIPLE_CHOICES', async () => {
      expect.assertions(1);

      const scope: Scope = nock(url).put('/').reply(StatusCodes.MULTIPLE_CHOICES, br);

      const request: Request<'text'> = new Request<'text'>('text');

      await expect(request.put(url)).rejects.toThrow(RequestError);
      scope.done();
      nock.restore();
    });

    it('responds BAD_REQUEST', async () => {
      expect.assertions(1);

      const scope: Scope = nock(url).put('/').reply(StatusCodes.BAD_REQUEST, br);

      const request: Request<'text'> = new Request<'text'>('text');

      await expect(request.put(url)).rejects.toThrow(RequestError);
      scope.done();
      nock.restore();
    });

    it('responds INTERNAL_SERVER_ERROR', async () => {
      expect.assertions(1);

      const scope: Scope = nock(url).put('/').reply(StatusCodes.INTERNAL_SERVER_ERROR, br);

      const request: Request<'text'> = new Request<'text'>('text');

      await expect(request.put(url)).rejects.toThrow(RequestError);
      scope.done();
      nock.restore();
    });
  });

  describe('delete', () => {
    it('responds CONTINUE', async () => {
      expect.assertions(1);

      const scope: Scope = nock(url).delete('/').reply(StatusCodes.CONTINUE, br);

      const request: Request<'text'> = new Request<'text'>('text');

      await expect(request.delete(url)).rejects.toThrow(RequestError);
      scope.done();
      nock.restore();
    });

    it('responds OK: response is text', async () => {
      expect.assertions(2);

      const scope: Scope = nock(url).delete('/').reply(StatusCodes.OK, sr);

      const request: Request<'text'> = new Request<'text'>('text');

      const r: RequestResponse<'text'> = await request.delete(url);

      expect(r.status).toBe(StatusCodes.OK);
      expect(r.body).toBe(sr);
      scope.done();
      nock.restore();
    });

    it('responds OK: response is json', async () => {
      expect.assertions(2);

      const scope: Scope = nock(url).delete('/').reply(StatusCodes.OK, jr);

      const request: Request<'json'> = new Request<'json'>('json');

      const r: RequestResponse<'json'> = await request.delete(url);

      expect(r.status).toBe(StatusCodes.OK);
      expect(r.body).toStrictEqual(jr);
      scope.done();
      nock.restore();
    });

    it('responds OK: response is buffer', async () => {
      expect.assertions(2);

      const scope: Scope = nock(url).delete('/').reply(StatusCodes.OK, br);

      const request: Request<'buffer'> = new Request<'buffer'>('buffer');

      const r: RequestResponse<'buffer'> = await request.delete(url);

      expect(r.status).toBe(StatusCodes.OK);
      expect(r.body.equals(br)).toBe(true);
      scope.done();
      nock.restore();
    });

    it('responds MULTIPLE_CHOICES', async () => {
      expect.assertions(1);

      const scope: Scope = nock(url).delete('/').reply(StatusCodes.MULTIPLE_CHOICES, br);

      const request: Request<'text'> = new Request<'text'>('text');

      await expect(request.delete(url)).rejects.toThrow(RequestError);
      scope.done();
      nock.restore();
    });

    it('responds BAD_REQUEST', async () => {
      expect.assertions(1);

      const scope: Scope = nock(url).delete('/').reply(StatusCodes.BAD_REQUEST, br);

      const request: Request<'text'> = new Request<'text'>('text');

      await expect(request.delete(url)).rejects.toThrow(RequestError);
      scope.done();
      nock.restore();
    });

    it('responds INTERNAL_SERVER_ERROR', async () => {
      expect.assertions(1);

      const scope: Scope = nock(url).delete('/').reply(StatusCodes.INTERNAL_SERVER_ERROR, br);

      const request: Request<'text'> = new Request<'text'>('text');

      await expect(request.delete(url)).rejects.toThrow(RequestError);
      scope.done();
      nock.restore();
    });
  });

  describe('head', () => {
    it('responds OK: response is text', async () => {
      expect.assertions(2);

      const scope: Scope = nock(url).head('/').reply(StatusCodes.OK, sr);

      const request: Request<'text'> = new Request<'text'>('text');

      const r: RequestResponse<'text'> = await request.head(url);

      expect(r.status).toBe(StatusCodes.OK);
      expect(r.body).toBe(sr);
      scope.done();
      nock.restore();
    });

    it('responds OK: response is json', async () => {
      expect.assertions(2);

      const scope: Scope = nock(url).head('/').reply(StatusCodes.OK, jr);

      const request: Request<'json'> = new Request<'json'>('json');

      const r: RequestResponse<'json'> = await request.head(url);

      expect(r.status).toBe(StatusCodes.OK);
      expect(r.body).toStrictEqual(jr);
      scope.done();
      nock.restore();
    });

    it('responds OK: response is buffer', async () => {
      expect.assertions(2);

      const scope: Scope = nock(url).head('/').reply(StatusCodes.OK, br);

      const request: Request<'buffer'> = new Request<'buffer'>('buffer');

      const r: RequestResponse<'buffer'> = await request.head(url);

      expect(r.status).toBe(StatusCodes.OK);
      expect(r.body.equals(br)).toBe(true);
      scope.done();
      nock.restore();
    });

    it('responds MULTIPLE_CHOICES', async () => {
      expect.assertions(1);

      const scope: Scope = nock(url).head('/').reply(StatusCodes.MULTIPLE_CHOICES);

      const request: Request<'text'> = new Request<'text'>('text');

      await expect(request.head(url)).rejects.toThrow(RequestError);
      scope.done();
      nock.restore();
    });

    it('responds BAD_REQUEST', async () => {
      expect.assertions(1);

      const scope: Scope = nock(url).head('/').reply(StatusCodes.BAD_REQUEST);

      const request: Request<'text'> = new Request<'text'>('text');

      await expect(request.head(url)).rejects.toThrow(RequestError);
      scope.done();
      nock.restore();
    });

    it('responds INTERNAL_SERVER_ERROR', async () => {
      expect.assertions(1);

      const scope: Scope = nock(url).head('/').reply(StatusCodes.INTERNAL_SERVER_ERROR);

      const request: Request<'text'> = new Request<'text'>('text');

      await expect(request.head(url)).rejects.toThrow(RequestError);
      scope.done();
      nock.restore();
    });
  });
});
