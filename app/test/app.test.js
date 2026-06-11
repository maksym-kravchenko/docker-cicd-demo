const { test } = require('node:test');
const assert = require('node:assert');
const app = require('../src/app');

function withServer(fn) {
  return new Promise((resolve, reject) => {
    const server = app.listen(0, async () => {
      const base = `http://127.0.0.1:${server.address().port}`;
      try {
        await fn(base);
        resolve();
      } catch (e) {
        reject(e);
      } finally {
        server.close();
      }
    });
  });
}

test('GET / returns service info', () =>
  withServer(async (base) => {
    const res = await fetch(base + '/');
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.service, 'docker-cicd-demo');
  }));

test('GET /health returns ok', () =>
  withServer(async (base) => {
    const res = await fetch(base + '/health');
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.status, 'ok');
  }));
