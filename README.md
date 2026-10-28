# `node-notifier` CLI

Command line interface for [`node-notifier`](https://github.com/mikaelbr/node-notifier). Requires Node.js 22.22.2+, 24.15.0+ or 26+ (the same as `node-notifier`).

## Run without installing

```sh
npx node-notifier-cli -t 'Hello' -m 'My message'
pnpm dlx node-notifier-cli -t 'Hello' -m 'My message'
```

## Install

```sh
npm i -g node-notifier-cli
# or
pnpm add -g node-notifier-cli
```

This installs both `notify` and `node-notifier-cli` as commands.

## Usage

```
notify --help
```

```
Usage: notify [options]

Options
  --help (alias -h)
  --version (alias -v)
  --title (alias -t)
  --subtitle (not available on Windows)
  --message (alias -m)
  --icon (alias -i)
  --sound (alias -s; optional sound name; use "none" to disable the default sound)
  --open (alias -o)
  --host
  --port (alias -p)
  --failsafe (alias -x; ms to wait for stdin before notifying anyway)
  --timeout (alias -c; seconds before the notification is dismissed)
  --appID (alias -a)

Examples
  $ notify -t "Hello" -m "My Message" -s --open http://github.com
  $ notify -t "Agent Coulson" --icon https://raw.githubusercontent.com/mikaelbr/node-notifier/master/example/coulson.jpg
  $ notify -m "My Message" -s Glass
  $ echo "My Message" | notify -t "Hello"
```

If you pipe text to `notify`, that text becomes the message.

## Development

```sh
corepack enable
pnpm install
pnpm test     # biome check + node --test
pnpm format   # biome check --write
```

### Running the CLI locally

Run your working copy directly:

```sh
node bin.js -t 'Hello' -m 'From my checkout'
echo 'Piped message' | node bin.js -t 'Hello'
```

To try it as the installed `notify` / `node-notifier-cli` commands, link it globally. The link points at your checkout, so edits to `bin.js` take effect straight away. pnpm 12 has no global link, so use npm for this:

```sh
npm link
notify -m 'Hello from the linked CLI'
npm unlink -g node-notifier-cli   # remove the link when done
```

To check what actually gets published, pack it and run the tarball the way `npx` would:

```sh
pnpm pack
npx ./node-notifier-cli-*.tgz -m 'Hello from the tarball'
```
