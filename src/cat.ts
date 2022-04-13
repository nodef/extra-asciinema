import * as cp from "child_process";
import type {callbackFn} from "./_types";

/**
 * Print full output of recorded asciicast to a terminal.
 * @param f filename
 * @param fn callback (err, full output)
 * @returns full output (including all escape sequences)
 */
function cat(f: string, fn: callbackFn=null): Promise<any> {
  var p = new Promise((fres, frej) => {
    cp.execFile("asciinema", ["cat", f], {encoding: "utf8"}, (err, stdout) => {
      if(err) return frej(err);
      fres(stdout);
    });
  });
  return fn? p.then(a => fn(null, a), fn) : p;
}
export default cat;
