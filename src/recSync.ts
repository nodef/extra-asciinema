import recCmd from './_recCmd';
import * as cp from 'child_process';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import type {RecOptions} from './_types';

/**
 * Records terminal session.
 * @param f output filename
 * @param o options
 * @param o.input input javascript file
 * @param o.append append to file (false)
 * @param o.raw save in raw format (false)
 * @param o.overwrite overwrite existing file (true)
 * @param o.command command to record (cat ${input} | node -i)
 * @param o.env environment variables
 * @param o.title file title
 * @param o.idleTimeLimit maximum idle tile
 * @returns asciicast file
 */
function recSync(f: string, o: RecOptions=null): string {
  var f = f||path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'asciinema-')), '0.cast');
  cp.execFileSync('asciinema', recCmd(f, o), {encoding: 'utf8'});
  return f;
}
export default recSync;
