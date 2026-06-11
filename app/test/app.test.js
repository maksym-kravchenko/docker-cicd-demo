import { test } from 'node:test';
import assert from 'node:assert';

import { GET as healthGet } from '../src/app/health/route.js';
import { PIPELINE_STEPS } from '../src/lib/pipeline.js';

test('GET /health returns ok', async () => {
  const res = healthGet();
  assert.strictEqual(res.status, 200);
  const body = await res.json();
  assert.strictEqual(body.status, 'ok');
});

test('pipeline steps are well-formed', () => {
  assert.ok(PIPELINE_STEPS.length >= 4, 'expected at least 4 stages');

  const ids = PIPELINE_STEPS.map((s) => s.id);
  assert.strictEqual(new Set(ids).size, ids.length, 'step ids must be unique');

  for (const step of PIPELINE_STEPS) {
    assert.ok(step.actor, `${step.id}: missing actor`);
    assert.ok(step.title, `${step.id}: missing title`);
    assert.ok(step.detail, `${step.id}: missing detail`);
    assert.ok(Array.isArray(step.log) && step.log.length > 0, `${step.id}: missing log lines`);
  }
});

test('pipeline starts with a push and ends with a deploy', () => {
  assert.strictEqual(PIPELINE_STEPS[0].id, 'push');
  assert.strictEqual(PIPELINE_STEPS.at(-1).id, 'deploy');
});
