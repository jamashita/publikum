import sinon, { SinonFakeServer } from 'sinon';
import { AJAX } from '../AJAX';
import { AJAXResponse } from '../AJAXResponse';

const res: string = JSON.stringify({
  mo: 'response string',
  nu: false,
  pq: -13
});
const url: string = '/morceau/de/poitrine';
const CONTINUE: number = 100;
const OK: number = 200;
const MULTIPLE_CHOICE: number = 300;
const BAD_REQUEST: number = 400;
const INTERNAL_SERVER_ERROR: number = 500;

describe('AJAX', () => {
  describe('get', () => {
    it('responds CONTINUE', async () => {
      expect.assertions(2);
      const server: SinonFakeServer = sinon.fakeServer.create();

      server.autoRespond = true;
      server.respondWith('GET', url, [
        CONTINUE,
        {
          'Content-Type': 'text/html'
        },
        res
      ]);

      const ajax: AJAX<'text'> = new AJAX<'text'>('text');

      const r: AJAXResponse<'text'> = await ajax.get(url);

      expect(r.status).toBe(CONTINUE);
      expect(r.body).toBe(res);
      server.restore();
    });

    it('responds OK', async () => {
      expect.assertions(2);
      const server: SinonFakeServer = sinon.fakeServer.create();

      server.autoRespond = true;
      server.respondWith('GET', url, [
        OK,
        {
          'Content-Type': 'text/html'
        },
        res
      ]);

      const ajax: AJAX<'text'> = new AJAX<'text'>('text');

      const r: AJAXResponse<'text'> = await ajax.get(url);

      expect(r.status).toBe(OK);
      expect(r.body).toBe(res);
      server.restore();
    });

    it('responds MULTIPLE_CHOICE', async () => {
      expect.assertions(2);
      const server: SinonFakeServer = sinon.fakeServer.create();

      server.autoRespond = true;
      server.respondWith('GET', url, [
        MULTIPLE_CHOICE,
        {
          'Content-Type': 'text/html'
        },
        res
      ]);

      const ajax: AJAX<'text'> = new AJAX<'text'>('text');

      const r: AJAXResponse<'text'> = await ajax.get(url);

      expect(r.status).toBe(MULTIPLE_CHOICE);
      expect(r.body).toBe(res);
      server.restore();
    });

    it('responds BAD_REQUEST', async () => {
      expect.assertions(2);
      const server: SinonFakeServer = sinon.fakeServer.create();

      server.autoRespond = true;
      server.respondWith('GET', url, [
        BAD_REQUEST,
        {
          'Content-Type': 'text/html'
        },
        res
      ]);

      const ajax: AJAX<'text'> = new AJAX<'text'>('text');

      const r: AJAXResponse<'text'> = await ajax.get(url);

      expect(r.status).toBe(BAD_REQUEST);
      expect(r.body).toBe(res);
      server.restore();
    });

    it('responds INTERNAL_SERVER_ERROR', async () => {
      expect.assertions(2);
      const server: SinonFakeServer = sinon.fakeServer.create();

      server.autoRespond = true;
      server.respondWith('GET', url, [
        INTERNAL_SERVER_ERROR,
        {
          'Content-Type': 'text/html'
        },
        res
      ]);

      const ajax: AJAX<'text'> = new AJAX<'text'>('text');

      const r: AJAXResponse<'text'> = await ajax.get(url);

      expect(r.status).toBe(INTERNAL_SERVER_ERROR);
      expect(r.body).toBe(res);
      server.restore();
    });
  });

  describe('post', () => {
    it('responds CONTINUE', async () => {
      expect.assertions(2);
      const server: SinonFakeServer = sinon.fakeServer.create();

      server.autoRespond = true;
      server.respondWith('POST', url, [
        CONTINUE,
        {
          'Content-Type': 'text/html'
        },
        res
      ]);

      const ajax: AJAX<'text'> = new AJAX<'text'>('text');

      const r: AJAXResponse<'text'> = await ajax.post(url);

      expect(r.status).toBe(CONTINUE);
      expect(r.body).toBe(res);
      server.restore();
    });

    it('responds OK', async () => {
      expect.assertions(2);
      const server: SinonFakeServer = sinon.fakeServer.create();

      server.autoRespond = true;
      server.respondWith('POST', url, [
        OK,
        {
          'Content-Type': 'text/html'
        },
        res
      ]);

      const ajax: AJAX<'text'> = new AJAX<'text'>('text');

      const r: AJAXResponse<'text'> = await ajax.post(url);

      expect(r.status).toBe(OK);
      expect(r.body).toBe(res);
      server.restore();
    });

    it('responds MULTIPLE_CHOICE', async () => {
      expect.assertions(2);
      const server: SinonFakeServer = sinon.fakeServer.create();

      server.autoRespond = true;
      server.respondWith('POST', url, [
        MULTIPLE_CHOICE,
        {
          'Content-Type': 'text/html'
        },
        res
      ]);

      const ajax: AJAX<'text'> = new AJAX<'text'>('text');

      const r: AJAXResponse<'text'> = await ajax.post(url);

      expect(r.status).toBe(MULTIPLE_CHOICE);
      expect(r.body).toBe(res);
      server.restore();
    });

    it('responds BAD_REQUEST', async () => {
      expect.assertions(2);
      const server: SinonFakeServer = sinon.fakeServer.create();

      server.autoRespond = true;
      server.respondWith('POST', url, [
        BAD_REQUEST,
        {
          'Content-Type': 'text/html'
        },
        res
      ]);

      const ajax: AJAX<'text'> = new AJAX<'text'>('text');

      const r: AJAXResponse<'text'> = await ajax.post(url);

      expect(r.status).toBe(BAD_REQUEST);
      expect(r.body).toBe(res);
      server.restore();
    });

    it('responds INTERNAL_SERVER_ERROR', async () => {
      expect.assertions(2);
      const server: SinonFakeServer = sinon.fakeServer.create();

      server.autoRespond = true;
      server.respondWith('POST', url, [
        INTERNAL_SERVER_ERROR,
        {
          'Content-Type': 'text/html'
        },
        res
      ]);

      const ajax: AJAX<'text'> = new AJAX<'text'>('text');

      const r: AJAXResponse<'text'> = await ajax.post(url);

      expect(r.status).toBe(INTERNAL_SERVER_ERROR);
      expect(r.body).toBe(res);
      server.restore();
    });
  });

  describe('put', () => {
    it('responds CONTINUE', async () => {
      expect.assertions(2);
      const server: SinonFakeServer = sinon.fakeServer.create();

      server.autoRespond = true;
      server.respondWith('PUT', url, [
        CONTINUE,
        {
          'Content-Type': 'text/html'
        },
        res
      ]);

      const ajax: AJAX<'text'> = new AJAX<'text'>('text');

      const r: AJAXResponse<'text'> = await ajax.put(url);

      expect(r.status).toBe(CONTINUE);
      expect(r.body).toBe(res);
      server.restore();
    });

    it('responds OK', async () => {
      expect.assertions(2);
      const server: SinonFakeServer = sinon.fakeServer.create();

      server.autoRespond = true;
      server.respondWith('PUT', url, [
        OK,
        {
          'Content-Type': 'text/html'
        },
        res
      ]);

      const ajax: AJAX<'text'> = new AJAX<'text'>('text');

      const r: AJAXResponse<'text'> = await ajax.put(url);

      expect(r.status).toBe(OK);
      expect(r.body).toBe(res);
      server.restore();
    });

    it('responds MULTIPLE_CHOICE', async () => {
      expect.assertions(2);
      const server: SinonFakeServer = sinon.fakeServer.create();

      server.autoRespond = true;
      server.respondWith('PUT', url, [
        MULTIPLE_CHOICE,
        {
          'Content-Type': 'text/html'
        },
        res
      ]);

      const ajax: AJAX<'text'> = new AJAX<'text'>('text');

      const r: AJAXResponse<'text'> = await ajax.put(url);

      expect(r.status).toBe(MULTIPLE_CHOICE);
      expect(r.body).toBe(res);
      server.restore();
    });

    it('responds BAD_REQUEST', async () => {
      expect.assertions(2);
      const server: SinonFakeServer = sinon.fakeServer.create();

      server.autoRespond = true;
      server.respondWith('PUT', url, [
        BAD_REQUEST,
        {
          'Content-Type': 'text/html'
        },
        res
      ]);

      const ajax: AJAX<'text'> = new AJAX<'text'>('text');

      const r: AJAXResponse<'text'> = await ajax.put(url);

      expect(r.status).toBe(BAD_REQUEST);
      expect(r.body).toBe(res);
      server.restore();
    });

    it('responds INTERNAL_SERVER_ERROR', async () => {
      expect.assertions(2);
      const server: SinonFakeServer = sinon.fakeServer.create();

      server.autoRespond = true;
      server.respondWith('PUT', url, [
        INTERNAL_SERVER_ERROR,
        {
          'Content-Type': 'text/html'
        },
        res
      ]);

      const ajax: AJAX<'text'> = new AJAX<'text'>('text');

      const r: AJAXResponse<'text'> = await ajax.put(url);

      expect(r.status).toBe(INTERNAL_SERVER_ERROR);
      expect(r.body).toBe(res);
      server.restore();
    });
  });

  describe('delete', () => {
    it('responds CONTINUE', async () => {
      expect.assertions(2);
      const server: SinonFakeServer = sinon.fakeServer.create();

      server.autoRespond = true;
      server.respondWith('DELETE', url, [
        CONTINUE,
        {
          'Content-Type': 'text/html'
        },
        res
      ]);

      const ajax: AJAX<'text'> = new AJAX<'text'>('text');

      const r: AJAXResponse<'text'> = await ajax.delete(url);

      expect(r.status).toBe(CONTINUE);
      expect(r.body).toBe(res);
      server.restore();
    });

    it('responds OK', async () => {
      expect.assertions(2);
      const server: SinonFakeServer = sinon.fakeServer.create();

      server.autoRespond = true;
      server.respondWith('DELETE', url, [
        OK,
        {
          'Content-Type': 'text/html'
        },
        res
      ]);

      const ajax: AJAX<'text'> = new AJAX<'text'>('text');

      const r: AJAXResponse<'text'> = await ajax.delete(url);

      expect(r.status).toBe(OK);
      expect(r.body).toBe(res);
      server.restore();
    });

    it('responds MULTIPLE_CHOICE', async () => {
      expect.assertions(2);
      const server: SinonFakeServer = sinon.fakeServer.create();

      server.autoRespond = true;
      server.respondWith('DELETE', url, [
        MULTIPLE_CHOICE,
        {
          'Content-Type': 'text/html'
        },
        res
      ]);

      const ajax: AJAX<'text'> = new AJAX<'text'>('text');

      const r: AJAXResponse<'text'> = await ajax.delete(url);

      expect(r.status).toBe(MULTIPLE_CHOICE);
      expect(r.body).toBe(res);
      server.restore();
    });

    it('responds BAD_REQUEST', async () => {
      expect.assertions(2);
      const server: SinonFakeServer = sinon.fakeServer.create();

      server.autoRespond = true;
      server.respondWith('DELETE', url, [
        BAD_REQUEST,
        {
          'Content-Type': 'text/html'
        },
        res
      ]);

      const ajax: AJAX<'text'> = new AJAX<'text'>('text');

      const r: AJAXResponse<'text'> = await ajax.delete(url);

      expect(r.status).toBe(BAD_REQUEST);
      expect(r.body).toBe(res);
      server.restore();
    });

    it('responds INTERNAL_SERVER_ERROR', async () => {
      expect.assertions(2);
      const server: SinonFakeServer = sinon.fakeServer.create();

      server.autoRespond = true;
      server.respondWith('DELETE', url, [
        INTERNAL_SERVER_ERROR,
        {
          'Content-Type': 'text/html'
        },
        res
      ]);

      const ajax: AJAX<'text'> = new AJAX<'text'>('text');

      const r: AJAXResponse<'text'> = await ajax.delete(url);

      expect(r.status).toBe(INTERNAL_SERVER_ERROR);
      expect(r.body).toBe(res);
      server.restore();
    });
  });
});
