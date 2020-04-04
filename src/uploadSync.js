const cp = require('child_process');

/**
 * Upload recorded asciicast to asciinema.org site.
 * @param {string} f filename
 * @returns {string} asciicast URL
 */
function uploadSync(f) {
  var stdout = cp.execSync(`asciinema upload ${f}`, {encoding: 'utf8'});
  return stdout.replace(/.*?(https?:\S+).*/s, '$1');
}
module.exports = uploadSync;
