import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { test } from 'node:test';
import pkg from '../package.json' with { type: 'json' };

const bin = new URL('../bin.js', import.meta.url).pathname;

function notify(args, input = '') {
  return spawnSync(process.execPath, [bin, ...args], {
    input,
    encoding: 'utf8'
  });
}

test('--help prints usage', () => {
  const { status, stdout } = notify(['--help']);
  assert.equal(status, 0);
  assert.match(stdout, /Usage: notify/);
  assert.match(stdout, /--title \(alias -t\)/);
});

test('--version prints the package version', () => {
  const { status, stdout } = notify(['-v']);
  assert.equal(status, 0);
  assert.equal(stdout.trim(), pkg.version);
});

test('unknown options fail with a hint', () => {
  const { status, stderr } = notify(['--nope']);
  assert.equal(status, 1);
  assert.match(stderr, /notify --help/);
});

test('exits quietly without a message', () => {
  const { status, stdout, stderr } = notify(['-t', 'Title', '-s']);
  assert.equal(status, 0);
  assert.equal(stdout, '');
  assert.equal(stderr, '');
});
