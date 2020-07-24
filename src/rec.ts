import recCmd from './_recCmd';
import * as cp from 'child_process';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import type {RecOptions, callbackFn} from './_types';

/**
 * Record terminal session.
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
 * @param fn callback function (err, asciicast file)
 * @returns asciicast file (promise)
 */
function rec(f: string=null, o: RecOptions=null, fn: callbackFn=null): Promise<any> {
  var f = f||path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'asciinema-')), '0.cast');
  var p = new Promise((fres, frej) => {
    cp.execFile('asciinema', recCmd(f, o), {encoding: 'utf8'}, (err) => {
      if(err) return frej(err);
      fres(f);
    });
  });
  return p? p.then(a => fn(null, a), fn) : p;
}
export default rec;
