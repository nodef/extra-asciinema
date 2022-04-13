import recCmd from "./_recCmd";
import * as cp from "child_process";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import type {RecOptions} from "./_types";

/**
 * Record terminal session.
 * @param f output filename
 * @param o options
 * @returns asciicast file
 */
function recSync(f: string, o: RecOptions=null): string {
  var f = f||path.join(fs.mkdtempSync(path.join(os.tmpdir(), "asciinema-")), "0.cast");
  cp.execFileSync("asciinema", recCmd(f, o), {encoding: "utf8"});
  return f;
}
export default recSync;
