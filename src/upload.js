const cp = require('child_process');

/**
 * Upload recorded asciicast to asciinema.org site.
 * @param {string} f filename
 * @param {function?} fn callback (err, asciicast URL)
 * @returns {Promise<string>} asciicast URL
 */
function upload(f, fn=null) {
  var p = new Promise((fres, frej) => {
    cp.exec(`asciinema upload ${f}`, {encoding: 'utf8'}, (err, stdout) => {
      if(err) return frej(err);
      fres(stdout.replace(/.*?(https?:\S+).*/s, '$1'));      
    });
  });
  return fn? p.then(a => fn(null, a), fn) : p;
}
module.exports = upload;
