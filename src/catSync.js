const cp = require('child_process');

/**
 * Print full output of recorded asciicast to a terminal.
 * @param {string} f filename
 * @returns {string} full output (including all escape sequences)
 */
function catSync(f) {
  return cp.execSync(`asciinema cat ${f}`, {encoding: 'utf8'});
}
module.exports = catSync;
