import sinon, { SinonFakeServer } from 'sinon';
import { AJAX } from '../AJAX';
import { AJAXResponse } from '../AJAXResponse';

const res: string = '2ea736db-8aa0-496f-950b-dec53b2eb268';
const strRes: string = JSON.stringify({
  mo: 'response string',
  nu: false,
  pq: -13
});
const blobRes: Blob = new Blob([res], {
  type: 'text/plain'
});

const bufferRes: ArrayBuffer = new ArrayBuffer(1);
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
        strRes
      ]);

      const ajax: AJAX<'text'> = new AJAX<'text'>('text');

      const r: AJAXResponse<'text'> = await ajax.get(url);

      expect(r.status).toBe(CONTINUE);
      expect(r.body).toBe(strRes);
      server.restore();
    });

    it('text: responds OK', async () => {
      expect.assertions(2);
      const server: SinonFakeServer = sinon.fakeServer.create();

      server.autoRespond = true;
      server.respondWith('GET', url, [
        OK,
        {
          'Content-Type': 'text/html'
        },
        strRes
      ]);

      const ajax: AJAX<'text'> = new AJAX<'text'>('text');

      const r: AJAXResponse<'text'> = await ajax.get(url);

      expect(r.status).toBe(OK);
      expect(r.body).toBe(strRes);
      server.restore();
    });

    it('json: responds OK', async () => {
      expect.assertions(2);
      const server: SinonFakeServer = sinon.fakeServer.create();

      server.autoRespond = true;
      server.respondWith('GET', url, [
        OK,
        {
          'Content-Type': 'text/html'
        },
        strRes
      ]);

      const ajax: AJAX<'json'> = new AJAX<'json'>('json');

      const r: AJAXResponse<'json'> = await ajax.get(url);

      expect(r.status).toBe(OK);
      expect(r.body).toStrictEqual(JSON.parse(strRes));
      server.restore();
    });

    it('blob: responds OK', async () => {
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

      const ajax: AJAX<'blob'> = new AJAX<'blob'>('blob');

      const r: AJAXResponse<'blob'> = await ajax.get(url);

      expect(r.status).toBe(OK);
      expect(r.body.size).toBe(blobRes.size);
      server.restore();
    });

    it('arraybuffer: responds OK', async () => {
      expect.assertions(2);
      const server: SinonFakeServer = sinon.fakeServer.create();

      server.autoRespond = true;
      server.respondWith('GET', url, [
        OK,
        {
          'Content-Type': 'text/html'
        },
        bufferRes
      ]);

      const ajax: AJAX<'arraybuffer'> = new AJAX<'arraybuffer'>('arraybuffer');

      const r: AJAXResponse<'arraybuffer'> = await ajax.get(url);

      expect(r.status).toBe(OK);
      expect(r.body).toBe(bufferRes);
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
        strRes
      ]);

      const ajax: AJAX<'text'> = new AJAX<'text'>('text');

      const r: AJAXResponse<'text'> = await ajax.get(url);

      expect(r.status).toBe(MULTIPLE_CHOICE);
      expect(r.body).toBe(strRes);
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
        strRes
      ]);

      const ajax: AJAX<'text'> = new AJAX<'text'>('text');

      const r: AJAXResponse<'text'> = await ajax.get(url);

      expect(r.status).toBe(BAD_REQUEST);
      expect(r.body).toBe(strRes);
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
        strRes
      ]);

      const ajax: AJAX<'text'> = new AJAX<'text'>('text');

      const r: AJAXResponse<'text'> = await ajax.get(url);

      expect(r.status).toBe(INTERNAL_SERVER_ERROR);
      expect(r.body).toBe(strRes);
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
        strRes
      ]);

      const ajax: AJAX<'text'> = new AJAX<'text'>('text');

      const r: AJAXResponse<'text'> = await ajax.post(url);

      expect(r.status).toBe(CONTINUE);
      expect(r.body).toBe(strRes);
      server.restore();
    });

    it('text: responds OK', async () => {
      expect.assertions(2);
      const server: SinonFakeServer = sinon.fakeServer.create();

      server.autoRespond = true;
      server.respondWith('POST', url, [
        OK,
        {
          'Content-Type': 'text/html'
        },
        strRes
      ]);

      const ajax: AJAX<'text'> = new AJAX<'text'>('text');

      const r: AJAXResponse<'text'> = await ajax.post(url);

      expect(r.status).toBe(OK);
      expect(r.body).toBe(strRes);
      server.restore();
    });

    it('json: responds OK', async () => {
      expect.assertions(2);
      const server: SinonFakeServer = sinon.fakeServer.create();

      server.autoRespond = true;
      server.respondWith('POST', url, [
        OK,
        {
          'Content-Type': 'text/html'
        },
        strRes
      ]);

      const ajax: AJAX<'json'> = new AJAX<'json'>('json');

      const r: AJAXResponse<'json'> = await ajax.post(url);

      expect(r.status).toBe(OK);
      expect(r.body).toStrictEqual(JSON.parse(strRes));
      server.restore();
    });

    it('blob: responds OK', async () => {
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

      const ajax: AJAX<'blob'> = new AJAX<'blob'>('blob');

      const r: AJAXResponse<'blob'> = await ajax.post(url);

      expect(r.status).toBe(OK);
      expect(r.body.size).toBe(blobRes.size);
      server.restore();
    });

    it('arraybuffer: responds OK', async () => {
      expect.assertions(2);
      const server: SinonFakeServer = sinon.fakeServer.create();

      server.autoRespond = true;
      server.respondWith('POST', url, [
        OK,
        {
          'Content-Type': 'text/html'
        },
        bufferRes
      ]);

      const ajax: AJAX<'arraybuffer'> = new AJAX<'arraybuffer'>('arraybuffer');

      const r: AJAXResponse<'arraybuffer'> = await ajax.post(url);

      expect(r.status).toBe(OK);
      expect(r.body).toBe(bufferRes);
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
        strRes
      ]);

      const ajax: AJAX<'text'> = new AJAX<'text'>('text');

      const r: AJAXResponse<'text'> = await ajax.post(url);

      expect(r.status).toBe(MULTIPLE_CHOICE);
      expect(r.body).toBe(strRes);
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
        strRes
      ]);

      const ajax: AJAX<'text'> = new AJAX<'text'>('text');

      const r: AJAXResponse<'text'> = await ajax.post(url);

      expect(r.status).toBe(BAD_REQUEST);
      expect(r.body).toBe(strRes);
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
        strRes
      ]);

      const ajax: AJAX<'text'> = new AJAX<'text'>('text');

      const r: AJAXResponse<'text'> = await ajax.post(url);

      expect(r.status).toBe(INTERNAL_SERVER_ERROR);
      expect(r.body).toBe(strRes);
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
        strRes
      ]);

      const ajax: AJAX<'text'> = new AJAX<'text'>('text');

      const r: AJAXResponse<'text'> = await ajax.put(url);

      expect(r.status).toBe(CONTINUE);
      expect(r.body).toBe(strRes);
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
        strRes
      ]);

      const ajax: AJAX<'text'> = new AJAX<'text'>('text');

      const r: AJAXResponse<'text'> = await ajax.put(url);

      expect(r.status).toBe(OK);
      expect(r.body).toBe(strRes);
      server.restore();
    });

    it('json: responds OK', async () => {
      expect.assertions(2);
      const server: SinonFakeServer = sinon.fakeServer.create();

      server.autoRespond = true;
      server.respondWith('PUT', url, [
        OK,
        {
          'Content-Type': 'text/html'
        },
        strRes
      ]);

      const ajax: AJAX<'json'> = new AJAX<'json'>('json');

      const r: AJAXResponse<'text'> = await ajax.put(url);

      expect(r.status).toBe(OK);
      expect(r.body).toStrictEqual(JSON.parse(strRes));
      server.restore();
    });

    it('blob: responds OK', async () => {
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

      const ajax: AJAX<'blob'> = new AJAX<'blob'>('blob');

      const r: AJAXResponse<'blob'> = await ajax.put(url);

      expect(r.status).toBe(OK);
      expect(r.body.size).toBe(blobRes.size);
      server.restore();
    });

    it('arraybuffer: responds OK', async () => {
      expect.assertions(2);
      const server: SinonFakeServer = sinon.fakeServer.create();

      server.autoRespond = true;
      server.respondWith('PUT', url, [
        OK,
        {
          'Content-Type': 'text/html'
        },
        bufferRes
      ]);

      const ajax: AJAX<'arraybuffer'> = new AJAX<'arraybuffer'>('arraybuffer');

      const r: AJAXResponse<'arraybuffer'> = await ajax.put(url);

      expect(r.status).toBe(OK);
      expect(r.body).toBe(bufferRes);
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
        strRes
      ]);

      const ajax: AJAX<'text'> = new AJAX<'text'>('text');

      const r: AJAXResponse<'text'> = await ajax.put(url);

      expect(r.status).toBe(MULTIPLE_CHOICE);
      expect(r.body).toBe(strRes);
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
        strRes
      ]);

      const ajax: AJAX<'text'> = new AJAX<'text'>('text');

      const r: AJAXResponse<'text'> = await ajax.put(url);

      expect(r.status).toBe(BAD_REQUEST);
      expect(r.body).toBe(strRes);
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
        strRes
      ]);

      const ajax: AJAX<'text'> = new AJAX<'text'>('text');

      const r: AJAXResponse<'text'> = await ajax.put(url);

      expect(r.status).toBe(INTERNAL_SERVER_ERROR);
      expect(r.body).toBe(strRes);
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
        strRes
      ]);

      const ajax: AJAX<'text'> = new AJAX<'text'>('text');

      const r: AJAXResponse<'text'> = await ajax.delete(url);

      expect(r.status).toBe(CONTINUE);
      expect(r.body).toBe(strRes);
      server.restore();
    });

    it('text: responds OK', async () => {
      expect.assertions(2);
      const server: SinonFakeServer = sinon.fakeServer.create();

      server.autoRespond = true;
      server.respondWith('DELETE', url, [
        OK,
        {
          'Content-Type': 'text/html'
        },
        strRes
      ]);

      const ajax: AJAX<'text'> = new AJAX<'text'>('text');

      const r: AJAXResponse<'text'> = await ajax.delete(url);

      expect(r.status).toBe(OK);
      expect(r.body).toBe(strRes);
      server.restore();
    });

    it('json: responds OK', async () => {
      expect.assertions(2);
      const server: SinonFakeServer = sinon.fakeServer.create();

      server.autoRespond = true;
      server.respondWith('DELETE', url, [
        OK,
        {
          'Content-Type': 'text/html'
        },
        strRes
      ]);

      const ajax: AJAX<'json'> = new AJAX<'json'>('json');

      const r: AJAXResponse<'json'> = await ajax.delete(url);

      expect(r.status).toBe(OK);
      expect(r.body).toStrictEqual(JSON.parse(strRes));
      server.restore();
    });

    it('blob: responds OK', async () => {
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

      const ajax: AJAX<'blob'> = new AJAX<'blob'>('blob');

      const r: AJAXResponse<'blob'> = await ajax.delete(url);

      expect(r.status).toBe(OK);
      expect(r.body.size).toBe(blobRes.size);
      server.restore();
    });

    it('arraybuffer: responds OK', async () => {
      expect.assertions(2);
      const server: SinonFakeServer = sinon.fakeServer.create();

      server.autoRespond = true;
      server.respondWith('DELETE', url, [
        OK,
        {
          'Content-Type': 'text/html'
        },
        bufferRes
      ]);

      const ajax: AJAX<'arraybuffer'> = new AJAX<'arraybuffer'>('arraybuffer');

      const r: AJAXResponse<'arraybuffer'> = await ajax.delete(url);

      expect(r.status).toBe(OK);
      expect(r.body).toBe(bufferRes);
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
        strRes
      ]);

      const ajax: AJAX<'text'> = new AJAX<'text'>('text');

      const r: AJAXResponse<'text'> = await ajax.delete(url);

      expect(r.status).toBe(MULTIPLE_CHOICE);
      expect(r.body).toBe(strRes);
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
        strRes
      ]);

      const ajax: AJAX<'text'> = new AJAX<'text'>('text');

      const r: AJAXResponse<'text'> = await ajax.delete(url);

      expect(r.status).toBe(BAD_REQUEST);
      expect(r.body).toBe(strRes);
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
        strRes
      ]);

      const ajax: AJAX<'text'> = new AJAX<'text'>('text');

      const r: AJAXResponse<'text'> = await ajax.delete(url);

      expect(r.status).toBe(INTERNAL_SERVER_ERROR);
      expect(r.body).toBe(strRes);
      server.restore();
    });
  });

  describe('head', () => {
    it('responds CONTINUE', async () => {
      expect.assertions(2);
      const server: SinonFakeServer = sinon.fakeServer.create();

      server.autoRespond = true;
      server.respondWith('head', url, [
        CONTINUE,
        {
          'Content-Type': 'text/html'
        },
        strRes
      ]);

      const ajax: AJAX<'text'> = new AJAX<'text'>('text');

      const r: AJAXResponse<'text'> = await ajax.head(url);

      expect(r.status).toBe(CONTINUE);
      expect(r.body).toBe(strRes);
      server.restore();
    });

    it('text: responds OK', async () => {
      expect.assertions(2);
      const server: SinonFakeServer = sinon.fakeServer.create();

      server.autoRespond = true;
      server.respondWith('head', url, [
        OK,
        {
          'Content-Type': 'text/html'
        },
        strRes
      ]);

      const ajax: AJAX<'text'> = new AJAX<'text'>('text');

      const r: AJAXResponse<'text'> = await ajax.head(url);

      expect(r.status).toBe(OK);
      expect(r.body).toBe(strRes);
      server.restore();
    });

    it('json: responds OK', async () => {
      expect.assertions(2);
      const server: SinonFakeServer = sinon.fakeServer.create();

      server.autoRespond = true;
      server.respondWith('head', url, [
        OK,
        {
          'Content-Type': 'text/html'
        },
        strRes
      ]);

      const ajax: AJAX<'json'> = new AJAX<'json'>('json');

      const r: AJAXResponse<'json'> = await ajax.head(url);

      expect(r.status).toBe(OK);
      expect(r.body).toStrictEqual(JSON.parse(strRes));
      server.restore();
    });

    it('blob: responds OK', async () => {
      expect.assertions(2);
      const server: SinonFakeServer = sinon.fakeServer.create();

      server.autoRespond = true;
      server.respondWith('head', url, [
        OK,
        {
          'Content-Type': 'text/html'
        },
        res
      ]);

      const ajax: AJAX<'blob'> = new AJAX<'blob'>('blob');

      const r: AJAXResponse<'blob'> = await ajax.head(url);

      expect(r.status).toBe(OK);
      expect(r.body.size).toBe(blobRes.size);
      server.restore();
    });

    it('arraybuffer: responds OK', async () => {
      expect.assertions(2);
      const server: SinonFakeServer = sinon.fakeServer.create();

      server.autoRespond = true;
      server.respondWith('head', url, [
        OK,
        {
          'Content-Type': 'text/html'
        },
        bufferRes
      ]);

      const ajax: AJAX<'arraybuffer'> = new AJAX<'arraybuffer'>('arraybuffer');

      const r: AJAXResponse<'arraybuffer'> = await ajax.head(url);

      expect(r.status).toBe(OK);
      expect(r.body).toBe(bufferRes);
      server.restore();
    });

    it('responds MULTIPLE_CHOICE', async () => {
      expect.assertions(2);
      const server: SinonFakeServer = sinon.fakeServer.create();

      server.autoRespond = true;
      server.respondWith('head', url, [
        MULTIPLE_CHOICE,
        {
          'Content-Type': 'text/html'
        },
        strRes
      ]);

      const ajax: AJAX<'text'> = new AJAX<'text'>('text');

      const r: AJAXResponse<'text'> = await ajax.head(url);

      expect(r.status).toBe(MULTIPLE_CHOICE);
      expect(r.body).toBe(strRes);
      server.restore();
    });

    it('responds BAD_REQUEST', async () => {
      expect.assertions(2);
      const server: SinonFakeServer = sinon.fakeServer.create();

      server.autoRespond = true;
      server.respondWith('head', url, [
        BAD_REQUEST,
        {
          'Content-Type': 'text/html'
        },
        strRes
      ]);

      const ajax: AJAX<'text'> = new AJAX<'text'>('text');

      const r: AJAXResponse<'text'> = await ajax.head(url);

      expect(r.status).toBe(BAD_REQUEST);
      expect(r.body).toBe(strRes);
      server.restore();
    });

    it('responds INTERNAL_SERVER_ERROR', async () => {
      expect.assertions(2);
      const server: SinonFakeServer = sinon.fakeServer.create();

      server.autoRespond = true;
      server.respondWith('head', url, [
        INTERNAL_SERVER_ERROR,
        {
          'Content-Type': 'text/html'
        },
        strRes
      ]);

      const ajax: AJAX<'text'> = new AJAX<'text'>('text');

      const r: AJAXResponse<'text'> = await ajax.head(url);

      expect(r.status).toBe(INTERNAL_SERVER_ERROR);
      expect(r.body).toBe(strRes);
      server.restore();
    });
  });
});
