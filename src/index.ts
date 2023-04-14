import * as path from "path";
import * as cp   from "child_process";
import * as fs   from "fs";
import * as os   from "os";




// TYPES
// =====

/** Callback function. */
export type Callback = (err: any, ans?: any) => void;


/** Record options. */
export interface RecOptions {
  /** Input javascript file. */
  input?: string,
  /** Append to file? (false) */
  append?: boolean,
  /** Save in raw format? (false) */
  raw?: boolean,
  /** Overwrite existing file? (true) */
  overwrite?: boolean,
  /** Command to record. (cat ${input} | node -i) */
  command?: string,
  /** Environment variables. */
  env?: string,
  /** File title. */
  title?: string,
  /** Maximum idle tile. */
  idleTimeLimit?: number
};


/** Retime options. */
export interface RetimeOptions {
  /** Input text. */
  input?: string,
  /** Input rate. (0.1s) */
  inputRate?: number,
  /** Input delay. (1s) */
  inputDelay?: number,
  /** Output rate. (0.1s) */
  outputRate?: number,
  /** Output delay. (0.1s) */
  outputDelay?: number,
  /** Initial delay. (0s) */
  delay?: number
};




// METHODS
// =======

function escapePath(p: string): string {
  return p.replace(/[`$&{}[;|]/g, "");
}

function recCmd(f: string, o: any=null): string[] {
  var o = o||{};
  // if input file given, execute on node.js
  if (o.input) {
    var pth = escapePath(o.input);
    var dir = path.dirname(pth);
    var fil = path.basename(pth);
    o.command = `cd "${dir}" && cat "${fil}" | node -i`;
  }
  o.overwrite = true;
  o.yes = true;
  var args = ["rec"];
  if (f) args.push(f);
  if (o.stdin) args.push("--stdin");
  if (o.append) args.push("--append");
  if (o.raw) args.push("--raw");
  if (o.overwrite) args.push("--overwrite");
  if (o.command) args.push("--command", o.command);
  if (o.env) args.push("-env", o.env);
  if (o.title) args.push("--title", o.title);
  if (o.idleTimeLimit) args.push("--idle-time-limit", ""+o.idleTimeLimit);
  if (o.yes) args.push("--yes");
  if (o.quiet) args.push("--quiet");
  return args;
}




// REC
// ---

/**
 * Record terminal session.
 * @param f output filename
 * @param o options
 * @param fn callback function (err, asciicast file)
 * @returns asciicast file (promise)
 */
export function rec(f: string=null, o: RecOptions=null, fn: Callback=null): Promise<any> {
  var f = f||path.join(fs.mkdtempSync(path.join(os.tmpdir(), "asciinema-")), "0.cast");
  var p = new Promise((fres, frej) => {
    cp.execFile("asciinema", recCmd(f, o), {encoding: "utf8"}, (err) => {
      if (err) return frej(err);
      fres(f);
    });
  });
  return fn? p.then(a => fn(null, a), fn) : p;
}


/**
 * Record terminal session.
 * @param f output filename
 * @param o options
 * @returns asciicast file
 */
export function recSync(f: string, o: RecOptions=null): string {
  var f = f||path.join(fs.mkdtempSync(path.join(os.tmpdir(), "asciinema-")), "0.cast");
  cp.execFileSync("asciinema", recCmd(f, o), {encoding: "utf8"});
  return f;
}




// CAT
// ---

/**
 * Print full output of recorded asciicast to a terminal.
 * @param f filename
 * @param fn callback (err, full output)
 * @returns full output (including all escape sequences)
 */
export function cat(f: string, fn: Callback=null): Promise<any> {
  var p = new Promise((fres, frej) => {
    cp.execFile("asciinema", ["cat", f], {encoding: "utf8"}, (err, stdout) => {
      if (err) return frej(err);
      fres(stdout);
    });
  });
  return fn? p.then(a => fn(null, a), fn) : p;
}


/**
 * Print full output of recorded asciicast to a terminal.
 * @param f filename
 * @returns full output (including all escape sequences)
 */
export function catSync(f: string): string {
  return cp.execFileSync("asciinema", ["cat", f], {encoding: "utf8"});
}




// RETIME
// ------

/**
 * Update time in asciicast data.
 * @param d asciicast data
 * @param o options
 * @returns updated asciicast data
 */
export function retimeData(d: string, o: RetimeOptions=null): string {
  var o = o||{};
  var {input} = o, i = 0;
  var output = "", t = o.delay||0;
  var rate = [o.outputRate||0.1, o.inputRate||0.1];
  var delay = [o.outputDelay||0.1, o.inputDelay||1];
  var oldState = 0, state = 0;
  for (var l of d.split(/\r?\n/g)) {
    // skip first, last lines
    if (l.startsWith("{") || l.trim()==="") { output += l+"\n"; continue; }
    // line = [time, type, text]
    var [,, x] = JSON.parse(l);
    var x1 = x.replace(/\r*\n/g, "\n");
    // if input given, track it
    if (input) {
      var i1 = input.substring(i, i+x1.length);
      i += x1===i1? x1.length : 0;
      state = x1===i1? 1 : 0;
    }
    // update time based on state
    if (state!==oldState) t += delay[state];
    output += JSON.stringify([t, "o", x])+"\n";
    t += rate[state];
    oldState = state;
    // if no input given, assume node.js
    if (!input) {
      if (x.endsWith("\u001b[3G")) state = 1;
      else if (x==="\r\r\n") state = 0;
    }
  }
  return output;
}


/**
 * Update time in asciicast file.
 * @param f filename
 * @param o options
 * @returns promise
 */
export async function retime(f: string, o: RetimeOptions=null): Promise<any> {
  var d = await fs.promises.readFile(f, "utf8");
  d = retimeData(d, o);
  await fs.promises.writeFile(f, d);
}


/**
 * Update time in asciicast file.
 * @param f filename
 * @param o options
 */
export function retimeSync(f: string, o: RetimeOptions=null): void {
  var d = fs.readFileSync(f, "utf8");
  d = retimeData(d, o);
  fs.writeFileSync(f, d);
}




// UPLOAD
// ------

/**
 * Upload recorded asciicast to asciinema.org site.
 * @param f filename
 * @param fn callback (err, asciicast URL)
 * @returns asciicast URL (promise)
 */
export function upload(f: string, fn: Callback=null): Promise<any> {
  var p = new Promise((fres, frej) => {
    cp.execFile("asciinema", ["upload", f], {encoding: "utf8"}, (err, stdout) => {
      if (err) return frej(err);
      fres(stdout.replace(/.*?(https?:\S+).*/s, "$1"));
    });
  });
  return fn? p.then(a => fn(null, a), fn) : p;
}


/**
 * Upload recorded asciicast to asciinema.org site.
 * @param f filename
 * @returns asciicast URL
 */
export function uploadSync(f: string): string {
  var stdout = cp.execFileSync("asciinema", ["upload", f], {encoding: "utf8"});
  return stdout.replace(/.*?(https?:\S+).*/s, "$1");
}
