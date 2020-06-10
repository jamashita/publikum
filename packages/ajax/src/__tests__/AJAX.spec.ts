import sinon, { SinonFakeServer } from 'sinon';

import { AJAX } from '../AJAX';
import { AJAXResponse } from '../AJAXResponse';

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
const strRes: string = JSON.stringify(res);
const url: string = '/morceau/de/poitrine';
const CONTINUE: number = 100;
const OK: number = 200;
const MULTIPLE_CHOISE: number = 300;
const BAD_REQUEST: number = 400;
const INTERNAL_SERVER_ERROR: number = 500;

describe('AJAX', () => {
  describe('get', () => {
    it('responds CONTINUE', async () => {
      const server: SinonFakeServer = sinon.fakeServer.create();

      server.autoRespond = true;
      server.respondWith('GET', url, [
        CONTINUE,
        {
          'Content-Type': 'application/json'
        },
        strRes
      ]);

      const ajax: AJAX = new AJAX();

      const r: AJAXResponse<Res> = await ajax.get<Res>(url);

      expect(r.status).toBe(CONTINUE);
      expect(r.body).toEqual(res);
      server.restore();
    });

    it('responds OK', async () => {
      const server: SinonFakeServer = sinon.fakeServer.create();

      server.autoRespond = true;
      server.respondWith('GET', url, [
        OK,
        {
          'Content-Type': 'application/json'
        },
        strRes
      ]);

      const ajax: AJAX = new AJAX();

      const r: AJAXResponse<Res> = await ajax.get<Res>(url);

      expect(r.status).toBe(OK);
      expect(r.body).toEqual(res);
      server.restore();
    });

    it('responds MULTIPLE_CHOISE', async () => {
      const server: SinonFakeServer = sinon.fakeServer.create();

      server.autoRespond = true;
      server.respondWith('GET', url, [
        MULTIPLE_CHOISE,
        {
          'Content-Type': 'application/json'
        },
        strRes
      ]);

      const ajax: AJAX = new AJAX();

      const r: AJAXResponse<Res> = await ajax.get<Res>(url);

      expect(r.status).toBe(MULTIPLE_CHOISE);
      expect(r.body).toEqual(res);
      server.restore();
    });

    it('responds BAD_REQUEST', async () => {
      const server: SinonFakeServer = sinon.fakeServer.create();

      server.autoRespond = true;
      server.respondWith('GET', url, [
        BAD_REQUEST,
        {
          'Content-Type': 'application/json'
        },
        strRes
      ]);

      const ajax: AJAX = new AJAX();

      const r: AJAXResponse<Res> = await ajax.get<Res>(url);

      expect(r.status).toBe(BAD_REQUEST);
      expect(r.body).toEqual(res);
      server.restore();
    });

    it('responds INTERNAL_SERVER_ERROR', async () => {
      const server: SinonFakeServer = sinon.fakeServer.create();

      server.autoRespond = true;
      server.respondWith('GET', url, [
        INTERNAL_SERVER_ERROR,
        {
          'Content-Type': 'application/json'
        },
        strRes
      ]);

      const ajax: AJAX = new AJAX();

      const r: AJAXResponse<Res> = await ajax.get<Res>(url);

      expect(r.status).toBe(INTERNAL_SERVER_ERROR);
      expect(r.body).toEqual(res);
      server.restore();
    });
  });

  describe('post', () => {
    it('responds CONTINUE', async () => {
      const server: SinonFakeServer = sinon.fakeServer.create();

      server.autoRespond = true;
      server.respondWith('POST', url, [
        CONTINUE,
        {
          'Content-Type': 'application/json'
        },
        strRes
      ]);

      const ajax: AJAX = new AJAX();

      const r: AJAXResponse<Res> = await ajax.post<Res>(url);

      expect(r.status).toBe(CONTINUE);
      expect(r.body).toEqual(res);
      server.restore();
    });

    it('responds OK', async () => {
      const server: SinonFakeServer = sinon.fakeServer.create();

      server.autoRespond = true;
      server.respondWith('POST', url, [
        OK,
        {
          'Content-Type': 'application/json'
        },
        strRes
      ]);

      const ajax: AJAX = new AJAX();

      const r: AJAXResponse<Res> = await ajax.post<Res>(url);

      expect(r.status).toBe(OK);
      expect(r.body).toEqual(res);
      server.restore();
    });

    it('responds MULTIPLE_CHOISE', async () => {
      const server: SinonFakeServer = sinon.fakeServer.create();

      server.autoRespond = true;
      server.respondWith('POST', url, [
        MULTIPLE_CHOISE,
        {
          'Content-Type': 'application/json'
        },
        strRes
      ]);

      const ajax: AJAX = new AJAX();

      const r: AJAXResponse<Res> = await ajax.post<Res>(url);

      expect(r.status).toBe(MULTIPLE_CHOISE);
      expect(r.body).toEqual(res);
      server.restore();
    });

    it('responds BAD_REQUEST', async () => {
      const server: SinonFakeServer = sinon.fakeServer.create();

      server.autoRespond = true;
      server.respondWith('POST', url, [
        BAD_REQUEST,
        {
          'Content-Type': 'application/json'
        },
        strRes
      ]);

      const ajax: AJAX = new AJAX();

      const r: AJAXResponse<Res> = await ajax.post<Res>(url);

      expect(r.status).toBe(BAD_REQUEST);
      expect(r.body).toEqual(res);
      server.restore();
    });

    it('responds INTERNAL_SERVER_ERROR', async () => {
      const server: SinonFakeServer = sinon.fakeServer.create();

      server.autoRespond = true;
      server.respondWith('POST', url, [
        INTERNAL_SERVER_ERROR,
        {
          'Content-Type': 'application/json'
        },
        strRes
      ]);

      const ajax: AJAX = new AJAX();

      const r: AJAXResponse<Res> = await ajax.post<Res>(url);

      expect(r.status).toBe(INTERNAL_SERVER_ERROR);
      expect(r.body).toEqual(res);
      server.restore();
    });
  });

  describe('put', () => {
    it('responds CONTINUE', async () => {
      const server: SinonFakeServer = sinon.fakeServer.create();

      server.autoRespond = true;
      server.respondWith('PUT', url, [
        CONTINUE,
        {
          'Content-Type': 'application/json'
        },
        strRes
      ]);

      const ajax: AJAX = new AJAX();

      const r: AJAXResponse<Res> = await ajax.put<Res>(url);

      expect(r.status).toBe(CONTINUE);
      expect(r.body).toEqual(res);
      server.restore();
    });

    it('responds OK', async () => {
      const server: SinonFakeServer = sinon.fakeServer.create();

      server.autoRespond = true;
      server.respondWith('PUT', url, [
        OK,
        {
          'Content-Type': 'application/json'
        },
        strRes
      ]);

      const ajax: AJAX = new AJAX();

      const r: AJAXResponse<Res> = await ajax.put<Res>(url);

      expect(r.status).toBe(OK);
      expect(r.body).toEqual(res);
      server.restore();
    });

    it('responds MULTIPLE_CHOISE', async () => {
      const server: SinonFakeServer = sinon.fakeServer.create();

      server.autoRespond = true;
      server.respondWith('PUT', url, [
        MULTIPLE_CHOISE,
        {
          'Content-Type': 'application/json'
        },
        strRes
      ]);

      const ajax: AJAX = new AJAX();

      const r: AJAXResponse<Res> = await ajax.put<Res>(url);

      expect(r.status).toBe(MULTIPLE_CHOISE);
      expect(r.body).toEqual(res);
      server.restore();
    });

    it('responds BAD_REQUEST', async () => {
      const server: SinonFakeServer = sinon.fakeServer.create();

      server.autoRespond = true;
      server.respondWith('PUT', url, [
        BAD_REQUEST,
        {
          'Content-Type': 'application/json'
        },
        strRes
      ]);

      const ajax: AJAX = new AJAX();

      const r: AJAXResponse<Res> = await ajax.put<Res>(url);

      expect(r.status).toBe(BAD_REQUEST);
      expect(r.body).toEqual(res);
      server.restore();
    });

    it('responds INTERNAL_SERVER_ERROR', async () => {
      const server: SinonFakeServer = sinon.fakeServer.create();

      server.autoRespond = true;
      server.respondWith('PUT', url, [
        INTERNAL_SERVER_ERROR,
        {
          'Content-Type': 'application/json'
        },
        strRes
      ]);

      const ajax: AJAX = new AJAX();

      const r: AJAXResponse<Res> = await ajax.put<Res>(url);

      expect(r.status).toBe(INTERNAL_SERVER_ERROR);
      expect(r.body).toEqual(res);
      server.restore();
    });
  });

  describe('delete', () => {
    it('responds CONTINUE', async () => {
      const server: SinonFakeServer = sinon.fakeServer.create();

      server.autoRespond = true;
      server.respondWith('DELETE', url, [
        CONTINUE,
        {
          'Content-Type': 'application/json'
        },
        strRes
      ]);

      const ajax: AJAX = new AJAX();

      const r: AJAXResponse<Res> = await ajax.delete<Res>(url);

      expect(r.status).toBe(CONTINUE);
      expect(r.body).toEqual(res);
      server.restore();
    });

    it('responds OK', async () => {
      const server: SinonFakeServer = sinon.fakeServer.create();

      server.autoRespond = true;
      server.respondWith('DELETE', url, [
        OK,
        {
          'Content-Type': 'application/json'
        },
        strRes
      ]);

      const ajax: AJAX = new AJAX();

      const r: AJAXResponse<Res> = await ajax.delete<Res>(url);

      expect(r.status).toBe(OK);
      expect(r.body).toEqual(res);
      server.restore();
    });

    it('responds MULTIPLE_CHOISE', async () => {
      const server: SinonFakeServer = sinon.fakeServer.create();

      server.autoRespond = true;
      server.respondWith('DELETE', url, [
        MULTIPLE_CHOISE,
        {
          'Content-Type': 'application/json'
        },
        strRes
      ]);

      const ajax: AJAX = new AJAX();

      const r: AJAXResponse<Res> = await ajax.delete<Res>(url);

      expect(r.status).toBe(MULTIPLE_CHOISE);
      expect(r.body).toEqual(res);
      server.restore();
    });

    it('responds BAD_REQUEST', async () => {
      const server: SinonFakeServer = sinon.fakeServer.create();

      server.autoRespond = true;
      server.respondWith('DELETE', url, [
        BAD_REQUEST,
        {
          'Content-Type': 'application/json'
        },
        strRes
      ]);

      const ajax: AJAX = new AJAX();

      const r: AJAXResponse<Res> = await ajax.delete<Res>(url);

      expect(r.status).toBe(BAD_REQUEST);
      expect(r.body).toEqual(res);
      server.restore();
    });

    it('responds INTERNAL_SERVER_ERROR', async () => {
      const server: SinonFakeServer = sinon.fakeServer.create();

      server.autoRespond = true;
      server.respondWith('DELETE', url, [
        INTERNAL_SERVER_ERROR,
        {
          'Content-Type': 'application/json'
        },
        strRes
      ]);

      const ajax: AJAX = new AJAX();

      const r: AJAXResponse<Res> = await ajax.delete<Res>(url);

      expect(r.status).toBe(INTERNAL_SERVER_ERROR);
      expect(r.body).toEqual(res);
      server.restore();
    });
  });
});
