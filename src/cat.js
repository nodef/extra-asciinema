const cp = require('child_process');

/**
 * Print full output of recorded asciicast to a terminal.
 * @param {string} f filename
 * @param {function?} fn callback (err, full output)
 * @returns {Promise<string>} full output (including all escape sequences)
 */
function cat(f, fn=null) {
  var p = new Promise((fres, frej) => {
    cp.exec(`asciinema cat ${f}`, {encoding: 'utf8'}, (err, stdout) => {
      if(err) return frej(err);
      fres(stdout);
    });
  });
  return fn? p.then(a => fn(null, a), fn) : p;
}
module.exports = cat;
