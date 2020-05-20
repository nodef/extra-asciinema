import * as cp from 'child_process';
import type {callbackFn} from './_types';

/**
 * Upload recorded asciicast to asciinema.org site.
 * @param f filename
 * @param fn callback (err, asciicast URL)
 * @returns asciicast URL (promise)
 */
function upload(f: string, fn: callbackFn=null): Promise<any> {
  var p = new Promise((fres, frej) => {
    cp.exec(`asciinema upload ${f}`, {encoding: 'utf8'}, (err, stdout) => {
      if(err) return frej(err);
      fres(stdout.replace(/.*?(https?:\S+).*/s, '$1'));      
    });
  });
  return fn? p.then(a => fn(null, a), fn) : p;
}
module.exports = upload;
