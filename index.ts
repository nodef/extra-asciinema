import {dirname, basename, join} from "@std/path";




//#region HELPERS
/** Text decoder for decoding command output. */
const decoder = new TextDecoder();


/** Escape special characters in a path string. */
function escapePath(p: string): string {
  return p.replace(/[`$&{}[;|]/g, "");
}


/** Execute a command with the given arguments. */
async function exec(command: string, args: string[]): Promise<string> {
  const cmd = new Deno.Command(command, {args, stdout: "piped", stderr: "piped"});
  const {code, stdout, stderr} = await cmd.output();
  if (code !== 0) throw new Error(decoder.decode(stderr));
  return decoder.decode(stdout);
}


/** Execute a command with the given arguments (synchronously). */
function execSync(command: string, args: string[]): string {
  const cmd = new Deno.Command(command, {args, stdout: "piped", stderr: "piped"});
  const {code, stdout, stderr} = cmd.outputSync();
  if (code !== 0) throw new Error(decoder.decode(stderr));
  return decoder.decode(stdout);
}
//#endregion




//#region REC
/** Options for the `rec` function. */
export interface RecOptions {
  /** Input JavaScript file to run and record. */
  input?: string;
  /** Append to the output file? [false] */
  append?: boolean;
  /** Save the recording in raw format? [false] */
  raw?: boolean;
  /** Overwrite the output file if it already exists? [true] */
  overwrite?: boolean;
  /** Command to record [cat ${input} | node -i]. */
  command?: string;
  /** Environment variables to set for the command. */
  env?: string;
  /** Title for the recording. */
  title?: string;
  /** Maximum idle time before automatically stopping the recording (in seconds). */
  idleTimeLimit?: number;
  /** Suppress output messages? [false] */
  quiet?: boolean;
  /** Read input from stdin? [false] */
  stdin?: boolean;
  /** Automatically confirm prompts? [false] */
  yes?: boolean;
}


/** Generate command-line arguments for the `rec` function. */
function recCmd(file: string | null, o: RecOptions | null = null): string[] {
  o = o || {};
  if (o.input) {
    const path = escapePath(o.input);
    const dir  = dirname(path);
    const file = basename(path);
    o.command  = `cd "${dir}" && cat "${file}" | node -i`;
  }
  o.overwrite = true;
  o.yes = true;
  const args = ["rec"];
  if (file) args.push(file);
  if (o.stdin)  args.push("--stdin");
  if (o.append) args.push("--append");
  if (o.raw)    args.push("--raw");
  if (o.overwrite) args.push("--overwrite");
  if (o.command)   args.push("--command", o.command);
  if (o.env)   args.push("-env", o.env);
  if (o.title) args.push("--title", o.title);
  if (o.idleTimeLimit) args.push("--idle-time-limit", "" + o.idleTimeLimit);
  if (o.yes)   args.push("--yes");
  if (o.quiet) args.push("--quiet");
  return args;
}


/**
 * Record terminal session.
 * @param file output file path for the recording
 * @param options options for recording
 * @returns path to the output file
 */
export async function rec(file: string | null = null, options: RecOptions | null = null): Promise<string> {
  file = file || join(await Deno.makeTempDir({prefix: "asciinema-" }), "0.cast");
  await exec("asciinema", recCmd(file, options));
  return file;
}


/**
 * Record terminal session (synchronously).
 * @param file output file path for the recording
 * @param options options for recording
 * @returns path to the output file
 */
export function recSync(file: string | null = null, options: RecOptions | null = null): string {
  file = file || join(Deno.makeTempDirSync({prefix: "asciinema-" }), "0.cast");
  execSync("asciinema", recCmd(file, options));
  return file;
}
//#endregion




//#region CAT
/**
 * Print full output of recorded asciicast to a terminal.
 * @param file path to the recording file to print
 * @returns full output of the recording
 */
export async function cat(file: string): Promise<string> {
  return await exec("asciinema", ["cat", file]);
}


/**
 * Print full output of recorded asciicast to a terminal (synchronously).
 * @param file path to the recording file to print
 * @returns full output of the recording
 */
export function catSync(file: string): string {
  return execSync("asciinema", ["cat", file]);
}
//#endregion




//#region RETIME
/** Options for the `retime` function. */
export interface RetimeOptions {
  /** Path to a file to read input from. */
  input?: string;
  /** Rate at which to sample input data (in seconds). */
  inputRate?: number;
  /** Input delay before starting to sample input data (in seconds). */
  inputDelay?: number;
  /** Rate at which to sample output data (in seconds). */
  outputRate?: number;
  /** Output delay before starting to sample output data (in seconds). */
  outputDelay?: number;
  /** Initial delay before starting to sample data (in seconds). */
  delay?: number;
}


/** Retime recorded asciicast data. */
export function retimeData(data: string, o: RetimeOptions | null = null): string {
  o = o || {};
  const {input} = o;
  let   output  = "";
  let i = 0;
  let t = o.delay || 0;
  const rate   = [o.outputRate  || 0.1, o.inputRate  || 0.1];
  const delay  = [o.outputDelay || 0.1, o.inputDelay || 1];
  let oldState = 0, state = 0;
  for (const l of data.split(/\r?\n/g)) {
    // Skip first, last lines
    if (l.startsWith("{") || l.trim() === "") { output += l + "\n"; continue; }
    // line = [time, type, text]
    const [,, x] = JSON.parse(l);
    const x1 = x.replace(/\r*\n/g, "\n");
    // If input given, track it
    if (input) {
      const i1 = input.substring(i, i + x1.length);
      i += x1 === i1 ? x1.length : 0;
      state = x1 === i1 ? 1 : 0;
    }
    // Update time based on state
    if (state !== oldState) t += delay[state];
    output += JSON.stringify([t, "o", x]) + "\n";
    t += rate[state];
    oldState = state;
    // If no input given, assume node.js
    if (!input) {
      if (x.endsWith("\u001b[3G")) state = 1;
      else if (x === "\r\r\n") state = 0;
    }
  }
  return output;
}


/**
 * Update time in asciicast file.
 * @param file path to the recording file to update
 * @param options options for retiming
 */
export async function retime(file: string, options: RetimeOptions | null = null): Promise<void> {
  let data = await Deno.readTextFile(file);
  data = retimeData(data, options);
  await Deno.writeTextFile(file, data);
}


/**
 * Update time in asciicast file (synchronously).
 * @param file path to the recording file to update
 * @param options options for retiming
 */
export function retimeSync(file: string, options: RetimeOptions | null = null): void {
  let data = Deno.readTextFileSync(file);
  data = retimeData(data, options);
  Deno.writeTextFileSync(file, data);
}
//#endregion




//#region UPLOAD
/**
 * Upload recorded asciicast to asciinema.org site.
 * @param file path to the recording file to upload
 * @returns URL of the uploaded recording
 */
export async function upload(file: string): Promise<string> {
  const stdout = await exec("asciinema", ["upload", file]);
  return stdout.replace(/.*?(https?:\S+).*/s, "$1");
}


/**
 * Upload recorded asciicast to asciinema.org site (synchronously).
 * @param file path to the recording file to upload
 * @returns URL of the uploaded recording
 */
export function uploadSync(file: string): string {
  const stdout = execSync("asciinema", ["upload", file]);
  return stdout.replace(/.*?(https?:\S+).*/s, "$1");
}
//#endregion
