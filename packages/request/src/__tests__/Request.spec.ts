import nock, { Scope } from 'nock';

import { Request } from '../Request';
import { RequestResponse } from '../RequestResponse';

type Res = Readonly<{
  mo: string;
  nu: boolean;
  pq: number;
}>;

const res: Res = {
  mo: 'response string',
  nu: false,
  pq: -13
};
const url: string = 'http://d9ba7103-e6a4-4415-b65d-8867f2caaad6.com';
const CONTINUE: number = 100;
const OK: number = 200;
const MULTIPLE_CHOISE: number = 300;
const BAD_REQUEST: number = 400;
const INTERNAL_SERVER_ERROR: number = 500;

describe('Request', () => {
  describe('get', () => {
    it('responds CONTINUE', async () => {
      const scope: Scope = nock(url).get('/').reply(CONTINUE, res);

      const request: Request = new Request();

      const r: RequestResponse<Res> = await request.get<Res>(url);

      expect(r.status).toBe(CONTINUE);
      expect(r.body).toEqual(res);
      scope.done();
    });

    it('responds OK', async () => {
      const scope: Scope = nock(url).get('/').reply(OK, res);

      const request: Request = new Request();

      const r: RequestResponse<Res> = await request.get<Res>(url);

      expect(r.status).toBe(OK);
      expect(r.body).toEqual(res);
      scope.done();
    });

    it('responds MULTIPLE_CHOISE', async () => {
      const scope: Scope = nock(url).get('/').reply(MULTIPLE_CHOISE, res);

      const request: Request = new Request();

      const r: RequestResponse<Res> = await request.get<Res>(url);

      expect(r.status).toBe(MULTIPLE_CHOISE);
      expect(r.body).toEqual(res);
      scope.done();
    });

    it('responds BAD_REQUEST', async () => {
      const scope: Scope = nock(url).get('/').reply(BAD_REQUEST, res);

      const request: Request = new Request();

      const r: RequestResponse<Res> = await request.get<Res>(url);

      expect(r.status).toBe(BAD_REQUEST);
      expect(r.body).toEqual(res);
      scope.done();
    });

    it('responds INTERNAL_SERVER_ERROR', async () => {
      const scope: Scope = nock(url).get('/').reply(INTERNAL_SERVER_ERROR, res);

      const request: Request = new Request();

      const r: RequestResponse<Res> = await request.get<Res>(url);

      expect(r.status).toBe(INTERNAL_SERVER_ERROR);
      expect(r.body).toEqual(res);
      scope.done();
    });
  });

  describe('post', () => {
    it('responds CONTINUE', async () => {
      const scope: Scope = nock(url).post('/').reply(CONTINUE, res);

      const request: Request = new Request();

      const r: RequestResponse<Res> = await request.post<Res>(url);

      expect(r.status).toBe(CONTINUE);
      expect(r.body).toEqual(res);
      scope.done();
    });

    it('responds OK', async () => {
      const scope: Scope = nock(url).post('/').reply(OK, res);

      const request: Request = new Request();

      const r: RequestResponse<Res> = await request.post<Res>(url);

      expect(r.status).toBe(OK);
      expect(r.body).toEqual(res);
      scope.done();
    });

    it('responds MULTIPLE_CHOISE', async () => {
      const scope: Scope = nock(url).post('/').reply(MULTIPLE_CHOISE, res);

      const request: Request = new Request();

      const r: RequestResponse<Res> = await request.post<Res>(url);

      expect(r.status).toBe(MULTIPLE_CHOISE);
      expect(r.body).toEqual(res);
      scope.done();
    });

    it('responds BAD_REQUEST', async () => {
      const scope: Scope = nock(url).post('/').reply(BAD_REQUEST, res);

      const request: Request = new Request();

      const r: RequestResponse<Res> = await request.post<Res>(url);

      expect(r.status).toBe(BAD_REQUEST);
      expect(r.body).toEqual(res);
      scope.done();
    });

    it('responds INTERNAL_SERVER_ERROR', async () => {
      const scope: Scope = nock(url).post('/').reply(INTERNAL_SERVER_ERROR, res);

      const request: Request = new Request();

      const r: RequestResponse<Res> = await request.post<Res>(url);

      expect(r.status).toBe(INTERNAL_SERVER_ERROR);
      expect(r.body).toEqual(res);
      scope.done();
    });
  });

  describe('put', () => {
    it('responds CONTINUE', async () => {
      const scope: Scope = nock(url).put('/').reply(CONTINUE, res);

      const request: Request = new Request();

      const r: RequestResponse<Res> = await request.put<Res>(url);

      expect(r.status).toBe(CONTINUE);
      expect(r.body).toEqual(res);
      scope.done();
    });

    it('responds OK', async () => {
      const scope: Scope = nock(url).put('/').reply(OK, res);

      const request: Request = new Request();

      const r: RequestResponse<Res> = await request.put<Res>(url);

      expect(r.status).toBe(OK);
      expect(r.body).toEqual(res);
      scope.done();
    });

    it('responds MULTIPLE_CHOISE', async () => {
      const scope: Scope = nock(url).put('/').reply(MULTIPLE_CHOISE, res);

      const request: Request = new Request();

      const r: RequestResponse<Res> = await request.put<Res>(url);

      expect(r.status).toBe(MULTIPLE_CHOISE);
      expect(r.body).toEqual(res);
      scope.done();
    });

    it('responds BAD_REQUEST', async () => {
      const scope: Scope = nock(url).put('/').reply(BAD_REQUEST, res);

      const request: Request = new Request();

      const r: RequestResponse<Res> = await request.put<Res>(url);

      expect(r.status).toBe(BAD_REQUEST);
      expect(r.body).toEqual(res);
      scope.done();
    });

    it('responds INTERNAL_SERVER_ERROR', async () => {
      const scope: Scope = nock(url).put('/').reply(INTERNAL_SERVER_ERROR, res);

      const request: Request = new Request();

      const r: RequestResponse<Res> = await request.put<Res>(url);

      expect(r.status).toBe(INTERNAL_SERVER_ERROR);
      expect(r.body).toEqual(res);
      scope.done();
    });
  });

  describe('delete', () => {
    it('responds CONTINUE', async () => {
      const scope: Scope = nock(url).delete('/').reply(CONTINUE, res);

      const request: Request = new Request();

      const r: RequestResponse<Res> = await request.delete<Res>(url);

      expect(r.status).toBe(CONTINUE);
      expect(r.body).toEqual(res);
      scope.done();
    });

    it('responds OK', async () => {
      const scope: Scope = nock(url).delete('/').reply(OK, res);

      const request: Request = new Request();

      const r: RequestResponse<Res> = await request.delete<Res>(url);

      expect(r.status).toBe(OK);
      expect(r.body).toEqual(res);
      scope.done();
    });

    it('responds MULTIPLE_CHOISE', async () => {
      const scope: Scope = nock(url).delete('/').reply(MULTIPLE_CHOISE, res);

      const request: Request = new Request();

      const r: RequestResponse<Res> = await request.delete<Res>(url);

      expect(r.status).toBe(MULTIPLE_CHOISE);
      expect(r.body).toEqual(res);
      scope.done();
    });

    it('responds BAD_REQUEST', async () => {
      const scope: Scope = nock(url).delete('/').reply(BAD_REQUEST, res);

      const request: Request = new Request();

      const r: RequestResponse<Res> = await request.delete<Res>(url);

      expect(r.status).toBe(BAD_REQUEST);
      expect(r.body).toEqual(res);
      scope.done();
    });

    it('responds INTERNAL_SERVER_ERROR', async () => {
      const scope: Scope = nock(url).delete('/').reply(INTERNAL_SERVER_ERROR, res);

      const request: Request = new Request();

      const r: RequestResponse<Res> = await request.delete<Res>(url);

      expect(r.status).toBe(INTERNAL_SERVER_ERROR);
      expect(r.body).toEqual(res);
      scope.done();
    });
  });
});
