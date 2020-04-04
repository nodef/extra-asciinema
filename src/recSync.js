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
 * @returns {string} asciicast file
 */
function recSync(f, o) {
  var f = f||path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'asciinema-')), '0.cast');
  cp.execSync(recCmd(f, o), {encoding: 'utf8'});
  return f;
}
module.exports = recSync;
/*
  if(o.input) o.command = `cat "${o.input}" | node -i`;
  o.overwrite = true;
  o.yes = true;
  var cmd = 'asciinema rec';
  if(f) cmd += ` "${f}"`;
  if(o.stdin) cmd += ' --stdin';
  if(o.append) cmd += ' --append';
  if(o.raw) cmd += ' --raw';
  if(o.overwrite) cmd += ' --overwrite';
  if(o.command) cmd += ` -c "${o.command}"`;
  if(o.env) cmd += ` -e "${o.env}"`;
  if(o.title) cmd += ` -t "${o.title}"`;
  if(o.idleTimeLimit) cmd += ` -e "${o.idleTimeLimit}"`;
  if(o.yes) cmd += ` -e "${o.yes}"`;
  if(o.quiet) cmd += ` -e "${o.quiet}"`;

*/
