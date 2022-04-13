import * as cp from "child_process";

/**
 * Print full output of recorded asciicast to a terminal.
 * @param f filename
 * @returns full output (including all escape sequences)
 */
function catSync(f: string): string {
  return cp.execFileSync("asciinema", ["cat", f], {encoding: "utf8"});
}
export default catSync;
