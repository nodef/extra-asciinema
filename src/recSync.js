const recCmd = require('./_recCmd');
const cp = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

/**
 * Record terminal session.
 * @param {string?} f output filename
 * @param {object} o options
 * @param {string?} o.input input javascript file
 * @param {boolean?} o.append append to file (false)
 * @param {boolean?} o.raw save in raw format (false)
 * @param {boolean?} o.overwrite overwrite existing file (true)
 * @param {string?} o.command command to record (cat ${input} | node -i)
 * @param {string?} o.env environment variables
 * @param {string?} o.title file title 
 * @param {number?} o.idleTimeLimit maximum idle tile
 * @returns {string} asciicast file
 */
function recSync(f, o) {
  var f = f||path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'asciinema-')), '0.cast');
  cp.execSync(recCmd(f, o), {encoding: 'utf8'});
  return f;
}
module.exports = recSync;
