Programmatic access to the [asciinema] terminal recorder CLI, for **auto-generating** terminal recordings.

▌
📦 [JSR](https://jsr.io/@nodef/extra-asciinema),
📦 [NPM](https://www.npmjs.com/package/@nodef/extra-asciinema),
📰 [Docs](https://jsr.io/@nodef/extra-asciinema/doc).

This package is a **single flat module** that wraps the [`asciinema` CLI][install asciinema first] with typed, promise-based functions. **You need to [install asciinema first]**. Following the `@std/fs` naming convention, **asynchronous functions have a bare name** and **synchronous functions carry a `Sync` suffix**.

The functions are:

- **Recording** a session to an asciicast file: [`rec()`] and [`recSync()`].
- **Printing** a recording's full output: [`cat()`] and [`catSync()`].
- **Re-timing** a recording (to speed up or slow down playback): [`retimeData()`], [`retime()`], and [`retimeSync()`].
- **Uploading** a recording to [asciinema.org]: [`upload()`] and [`uploadSync()`].

[asciinema]: https://asciinema.org
[asciinema.org]: https://asciinema.org
[install asciinema first]: https://docs.asciinema.org/getting-started/
[`rec()`]: #rec--recsync
[`recSync()`]: #rec--recsync
[`cat()`]: #cat--catsync
[`catSync()`]: #cat--catsync
[`retimeData()`]: #retimedata
[`retime()`]: #retime--retimesync
[`retimeSync()`]: #retime--retimesync
[`upload()`]: #upload--uploadsync
[`uploadSync()`]: #upload--uploadsync

<br>

```ts
import * as xasciinema from "jsr:@nodef/extra-asciinema";


// 1. Record an interactive Node.js session.
const file = xasciinema.recSync("saved.cast", {input: "example.js"});
// runs example.js in `node -i`, saves "saved.cast"


// 2. Speed up the recording.
await xasciinema.retime(file, {inputDelay: 2, outputRate: 0.05});
// "saved.cast" is updated in place


// 3. Upload to asciinema.org.
const url = await xasciinema.upload(file);
console.log(url);
// → https://asciinema.org/a/xxxxx
```

Run with the permissions you need, for example
`deno run --allow-run=asciinema --allow-read --allow-write example.ts`.

<br>
<br>


## Index

| Property | Description |
|  ----  |  ----  |
| [rec] | Record a terminal session to an asciicast file. |
| [recSync] | Record a terminal session to an asciicast file. |
| [cat] | Print the full output of a recording. |
| [catSync] | Print the full output of a recording. |
| [retimeData] | Update timing in asciicast data (string). |
| [retime] | Update timing in an asciicast file. |
| [retimeSync] | Update timing in an asciicast file. |
| [upload] | Upload a recording to asciinema.org. |
| [uploadSync] | Upload a recording to asciinema.org. |

<br>
<br>


## Reference

### rec / recSync

```ts
function rec(file?: string, options?: RecOptions, fn?: Callback): Promise<string>;
function recSync(file?: string, options?: RecOptions): string;
```

Records a terminal session with `asciinema rec` and returns the path of the
resulting `.cast` file. If `file` is omitted, a fresh temporary directory is
created and `0.cast` inside it is used.

`RecOptions`:

- `input` — JavaScript file to execute. When set, `command` is overridden to
  ``cd "<dir>" && cat "<file>" | node -i``.
- `command` — command to record.
- `append` — append to an existing file.
- `raw` — save in raw format.
- `overwrite` — overwrite the destination (always on).
- `env` — environment variables to record.
- `title` — recording title.
- `idleTimeLimit` — cap on idle time between events.

### cat / catSync

```ts
function cat(file: string, fn?: Callback): Promise<string>;
function catSync(file: string): string;
```

Prints the full output of a recorded asciicast to a terminal. Returns the
output string, including all escape sequences.

### retimeData

```ts
function retimeData(data: string, options?: RetimeOptions): string;
```

Rewrites the timestamps in asciicast v2 data (JSONL) so that typing and
output happen at a controlled pace. The result is returned as a string; the
input is not mutated.

`RetimeOptions`:

- `input` — expected keyboard input (string). Enables tracking of input vs.
  output; when omitted, [Node.js REPL] heuristics are used instead.
- `inputRate` — time per input character [`0.1`].
- `inputDelay` — delay before switching into input [`1`].
- `outputRate` — time per output character [`0.1`].
- `outputDelay` — delay before switching into output [`0.1`].
- `delay` — initial delay [`0`].

[Node.js REPL]: https://nodejs.org/api/repl.html

### retime / retimeSync

```ts
function retime(file: string, options?: RetimeOptions): Promise<void>;
function retimeSync(file: string, options?: RetimeOptions): void;
```

Reads an asciicast file, runs it through [retimeData], and writes the result
back to the same file.

### upload / uploadSync

```ts
function upload(file: string, fn?: Callback): Promise<string>;
function uploadSync(file: string): string;
```

Uploads a recording to [asciinema.org] with `asciinema upload` and returns
the resulting URL.

<br>
<br>


## Story

**Terminal recording** captures the *bytes* written to a *pseudo-terminal*
(PTY) — both the *input* the user types and the *output* the program prints —
along with their *relative timestamps*. Playback is simply *replaying* those
bytes in *order*. Unlike a screen capture, a recording is *textual*, so it can
be *searched*, *copied from*, and *re-timed* after the fact.

The **[asciicast v2]** file format is a *newline-delimited JSON* stream. The
first line is a **header** containing the terminal's `width`, `height`, and an
`env` object (usually `SHELL` and `TERM`). Every subsequent line is an
**event** `[time, type, data]`, where `time` is the *offset in seconds* from
the start of the recording, `type` is `"o"` (output) or `"i"` (input), and
`data` is the *text*. The `.cast` extension is convention only — the
underlying file is plain JSONL and can be edited by hand or by a script.

The **asciinema** CLI provides four operations that map onto the four groups
above:

- `asciinema rec <file>` — start a recording. It launches `$SHELL` (or a
  command, via `--command`) inside a PTY and writes the header + events as
  they happen. `Ctrl-D` or `exit` finishes it.
- `asciinema cat <file>` — dump the raw output bytes back to the terminal.
- `asciinema upload <file>` — upload to [asciinema.org] and print a URL.

There is *no built-in* re-timing command, so the `retime*` functions here
implement one. Asciicast v2 *makes this easy*: the `data` payloads are just
JSON strings, so we rewrite each `time` field independently and let the
player schedule playback accordingly. The state machine tracks whether we
are currently emitting *input* or *output* (based on whether the next
`data` matches the expected `input` string, or — in Node.js REPL recordings —
based on the REPL's prompt cursor sequence `\u001b[3G` and its `\r\r\n` line
terminator) and applies a separate *rate* and *delay* to each state.

[asciicast v2]: https://docs.asciinema.org/manual/asciicast/v2/

<br>
<br>


## See also

- [asciinema - Record and share your terminal sessions, the simple way](https://asciinema.org)
- [asciicast v2 file format](https://docs.asciinema.org/manual/asciicast/v2/)
- [asciinema CLI reference](https://docs.asciinema.org/manual/cli/)
- [Deno `Deno.Command` API](https://docs.deno.com/api/deno/~/Deno.Command)
- [`@std/path`](https://jsr.io/@std/path)
- [`@std/fs`](https://jsr.io/@std/fs)
- [TTY and PTY overview](https://en.wikipedia.org/wiki/Pseudoterminal)

<br>
<br>

[![](https://raw.githubusercontent.com/qb40/designs/gh-pages/0/image/11.png)](https://wolfram77.github.io)<br>
[![ORG](https://img.shields.io/badge/org-nodef-green?logo=Org)](https://nodef.github.io)
![](https://ga-beacon.deno.dev/G-RC63DPBH3P:SH3Eq-NoQ9mwgYeHWxu7cw/github.com/nodef/extra-asciinema)


[rec]: #rec--recsync
[recSync]: #rec--recsync
[cat]: #cat--catsync
[catSync]: #cat--catsync
[retimeData]: #retimedata
[retime]: #retime--retimesync
[retimeSync]: #retime--retimesync
[upload]: #upload--uploadsync
[uploadSync]: #upload--uploadsync
