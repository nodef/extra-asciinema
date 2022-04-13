import * as cp from "child_process";

/**
 * Upload recorded asciicast to asciinema.org site.
 * @param f filename
 * @returns asciicast URL
 */
function uploadSync(f: string): string {
  var stdout = cp.execFileSync("asciinema", ["upload", f], {encoding: "utf8"});
  return stdout.replace(/.*?(https?:\S+).*/s, "$1");
}
export default uploadSync;
