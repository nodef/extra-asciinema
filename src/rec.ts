import recCmd from "./_recCmd";
import * as cp from "child_process";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import type {RecOptions, Callback} from "./_types";

/**
 * Record terminal session.
 * @param f output filename
 * @param o options
 * @param fn callback function (err, asciicast file)
 * @returns asciicast file (promise)
 */
function rec(f: string=null, o: RecOptions=null, fn: Callback=null): Promise<any> {
  var f = f||path.join(fs.mkdtempSync(path.join(os.tmpdir(), "asciinema-")), "0.cast");
  var p = new Promise((fres, frej) => {
    cp.execFile("asciinema", recCmd(f, o), {encoding: "utf8"}, (err) => {
      if(err) return frej(err);
      fres(f);
    });
  });
  return fn? p.then(a => fn(null, a), fn) : p;
}
export default rec;
