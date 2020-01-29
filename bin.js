#!/usr/bin/env node

var Notification = require('node-notifier').Notification;
var minimist = require('minimist');
var usage = require('cli-usage');

var aliases = {
  help: 'h',
  title: 't',
  subtitle: 'st',
  message: 'm',
  icon: 'i',
  sound: 's',
  open: 'o',
  port: 'p',
  failsafe: 'x',
  appID: 'a'
};

var argv = minimist(process.argv.slice(2), {
  alias: aliases,
  string: [
    'icon',
    'message',
    'open',
    'subtitle',
    'title',
    'host',
    'port',
    'failsafe',
    'appID'
  ]
});

readme(aliases, ['host']);

var validOpts = Object.keys(aliases).concat('host');
var passedOptions = getOptionsIfExists(validOpts, argv);
var stdinMessage = '';

if (process.stdin.isTTY) {
  doNotification(passedOptions);
} else {
  process.stdin.resume();
  process.stdin.setEncoding('utf8');
  process.stdin.on('data', function(data) {
    if (data) {
      stdinMessage += data;
    } else {
      doNotification(passedOptions);
      this.end();
    }
  });
  process.stdin.on('end', function() {
    if (stdinMessage) {
      passedOptions.message = stdinMessage;
    }
    doNotification(passedOptions);
  });

  if (typeof passedOptions.failsafe !== 'undefined') {
    setTimeout(function() {
      doNotification(passedOptions);
    }, passedOptions.failsafe);
    delete passedOptions.failsafe; // Do not pass failsafe to notifier
  }
}

function doNotification(options) {
  var notifier = new Notification(options);
  if (!options.message) {
    // Do not show an empty message
    process.exit(0);
  }
  notifier.notify(options, function(err, msg) {
    if (err) {
      console.error(err.message);
      process.exit(1);
    }

    if (msg) console.log(msg);
    process.exit(0);
  });
}

function getOptionsIfExists(optionTypes, argv) {
  var options = {};
  optionTypes.forEach(function(key) {
    if (key && argv[key]) {
      options[key] =
        key === 'sound' && argv[key] === 'none' ? false : argv[key];
    }
  });
  return options;
}

function readme(input, extra) {
  var str = '# notify\n \n## Options\n' + params(input, extra) + '\n\n';
  str += '## Example\n```shell\n';
  str += '$ notify -t "Hello" -m "My Message" -s --open http://github.com\n';
  str +=
    '$ notify -t "Agent Coulson" --icon https://raw.githubusercontent.com/mikaelbr/node-notifier/master/example/coulson.jpg \n';
  str += '$ notify -m "My Message" -s Glass\n';
  str += '$ echo "My Message" | notify -t "Hello"```\n\n';
  usage(str);
}

function params(input, extra) {
  var withAlias = Object.keys(input).reduce(function(acc, key) {
    return acc + ' * --' + key + ' (alias -' + input[key] + ')\n';
  }, '');

  if (!extra) return withAlias;

  return (
    withAlias +
    extra.reduce(function(acc, key) {
      return acc + ' * --' + key + '\n';
    }, '')
  );
}
