#!/usr/bin/env node

import { text } from 'node:stream/consumers';
import { setTimeout } from 'node:timers/promises';
import { parseArgs, promisify, styleText } from 'node:util';
import { Notification } from 'node-notifier';
import pkg from './package.json' with { type: 'json' };

const options = {
  help: { type: 'boolean', short: 'h' },
  version: { type: 'boolean', short: 'v' },
  title: { type: 'string', short: 't' },
  subtitle: { type: 'string' },
  message: { type: 'string', short: 'm' },
  icon: { type: 'string', short: 'i' },
  sound: { type: 'string', short: 's' },
  open: { type: 'string', short: 'o' },
  host: { type: 'string' },
  port: { type: 'string', short: 'p' },
  failsafe: { type: 'string', short: 'x' },
  timeout: { type: 'string', short: 'c' },
  appID: { type: 'string', short: 'a' }
};

const descriptions = {
  subtitle: 'not available on Windows',
  sound: 'optional sound name; use "none" to disable the default sound',
  failsafe: 'ms to wait for stdin before notifying anyway',
  timeout: 'seconds before the notification is dismissed'
};

let values;
try {
  ({ values } = parseArgs({
    args: withBareSound(process.argv.slice(2)),
    options
  }));
} catch (error) {
  console.error(`${error.message}\nRun "notify --help" for usage.`);
  process.exit(1);
}

if (values.help) {
  console.log(usage());
  process.exit(0);
}

if (values.version) {
  console.log(pkg.version);
  process.exit(0);
}

const { help, version, failsafe, ...notification } = values;

if (notification.sound === 'none') notification.sound = false;
else if (notification.sound === 'true') notification.sound = true;

if (notification.timeout !== undefined) {
  const seconds = Number.parseInt(notification.timeout, 10);
  notification.timeout = Number.isNaN(seconds) ? false : seconds;
}

if (!process.stdin.isTTY) {
  const message = await readStdin(Number(failsafe) || undefined);
  if (message) notification.message = message;
}

// Do not show an empty message
if (!notification.message) process.exit(0);

const notifier = new Notification(notification);
try {
  const response = await promisify(notifier.notify.bind(notifier))(
    notification
  );
  if (response) console.log(response);
  process.exit(0);
} catch (error) {
  console.error(error.message);
  process.exit(1);
}

/**
 * `--sound` is both a flag and an option with a value (`-s Glass`), which
 * parseArgs cannot express, so give a bare flag an explicit value.
 */
function withBareSound(args) {
  return args.flatMap((arg, i) => {
    const next = args[i + 1];
    const isBare = next === undefined || next.startsWith('-');
    return (arg === '-s' || arg === '--sound') && isBare ? [arg, 'true'] : arg;
  });
}

/** Reads piped stdin, giving up after `failsafe` ms if it never ends. */
async function readStdin(failsafe) {
  process.stdin.setEncoding('utf8');
  const input = text(process.stdin);
  const result = await (failsafe === undefined
    ? input
    : Promise.race([input, setTimeout(failsafe, '', { ref: false })]));
  return result.replace(/\r?\n$/, '');
}

function usage() {
  const flags = Object.entries(options).map(([name, { short }]) => {
    const notes = [short && `alias -${short}`, descriptions[name]];
    const extra = notes.filter(Boolean).join('; ');
    return `  --${name}${extra ? ` (${extra})` : ''}`;
  });

  return [
    styleText('bold', 'Usage: notify [options]'),
    '',
    styleText('bold', 'Options'),
    ...flags,
    '',
    styleText('bold', 'Examples'),
    '  $ notify -t "Hello" -m "My Message" -s --open http://github.com',
    '  $ notify -t "Agent Coulson" --icon https://raw.githubusercontent.com/mikaelbr/node-notifier/master/example/coulson.jpg',
    '  $ notify -m "My Message" -s Glass',
    '  $ echo "My Message" | notify -t "Hello"'
  ].join('\n');
}
