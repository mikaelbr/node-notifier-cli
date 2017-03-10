# `node-notifier` CLI

Separate package for [`node-notifier`](https://github.com/mikaelbr/node-notifier) CLI.

## Install

```
npm i [-g] node-notifier-cli
```

## usage

```
notify -h
```

```
# notify
## Options

    * --help (alias -h)

    * --title (alias -t)
    * --subtitle (alias -st; not available on Windows OS)
    * --message (alias -m)
    * --icon (alias -i)
    * --sound (alias -s; use none to disable default sound notification)
    * --open (alias -o)
    * --port (alias -p)
    * --host

## Example

   $ notify -t "Hello" -m "My Message" -s --open http://github.com
   $ notify -t "Agent Coulson" --icon https://raw.githubusercontent.com/mikaelbr/node-notifier/master/example/coulson.jpg
   $ notify -m "My Message" -s Glass
   $ echo "My Message" | notify -t "Hello"
```
