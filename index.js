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
const cp1 = require('child_process');

/**
 * Print full output of recorded asciicast to a terminal.
 * @param {string} f filename
 * @returns {string} full output (including all escape sequences)
 */
function catSync(f) {
  return cp1.execSync(`asciinema cat ${f}`, {encoding: 'utf8'});
}
function recCmd(f, o) {
  var o = o||{};
  // if input file given, execute on node.js
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
  return cmd;
}
const cp3 = require('child_process');
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
 * @param {function?} fn callback function (err, asciicast file)
 * @returns {string} asciicast file
 */
function rec(f, o, fn=null) {
  var f = f||path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'asciinema-')), '0.cast');
  var p = new Promise((fres, frej) => {
    cp3.exec(recCmd(f, o), {encoding: 'utf8'}, (err) => {
      if(err) return frej(err);
      fres(f);
    });
  });
  return p? p.then(a => fn(null, a), fn) : p;
}
const cp4 = require('child_process');
const fs4 = require('fs');
const os4 = require('os');
const path4 = require('path');

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
  var f = f||path4.join(fs4.mkdtempSync(path4.join(os4.tmpdir(), 'asciinema-')), '0.cast');
  cp4.execSync(recCmd(f, o), {encoding: 'utf8'});
  return f;
}
/**
 * Updates time in asciicast data.
 * @param {string} d asciicast data
 * @param {object} o options
 * @param {string?} o.input input text
 * @param {number?} o.inputRate input rate (0.1s)
 * @param {number?} o.inputDelay input delay (1s)
 * @param {number?} o.outputRate output rate (0.1s)
 * @param {number?} o.outputDelay output delay (0.1s)
 * @param {number?} o.delay initial delay (0s)
 * @returns {string} updated asciicast data
 */
function retimeData(d, o) {
  var o = o||{};
  var {input} = o, i = 0;
  var output = '', t = o.delay||0;
  var rate = [o.outputRate||0.1, o.inputRate||0.1];
  var delay = [o.outputDelay||0.1, o.inputDelay||1];
  var oldState = 0, state = 0;
  for(var l of d.split(/\r?\n/g)) {
    // skip first, last lines
    if(l.startsWith('{') || l.trim()==='') { output += l+'\n'; continue; }
    // line = [time, type, text]
    var [,, x] = JSON.parse(l);
    var x1 = x.replace(/\r*\n/g, '\n');
    // if input given, track it
    if(input) {
      var i1 = input.substring(i, i+x1.length);
      i += x1===i1? x1.length : 0;
      state = x1===i1? 1 : 0;
    }
    // update time based on state
    if(state!==oldState) t += delay[state];
    output += JSON.stringify([t, 'o', x])+'\n';
    t += rate[state];
    oldState = state;
    // if no input given, assume node.js
    if(!input) {
      if(x.endsWith('\u001b[3G')) state = 1;
      else if(x==='\r\r\n') state = 0;
    }
  }
  return output;
}
const fs6 = require('fs');

/**
 * Updates time in asciicast file.
 * @param {string} f filename
 * @param {object} o options
 * @param {string?} o.input input text
 * @param {number?} o.inputRate input rate (0.1s)
 * @param {number?} o.inputDelay input delay (1s)
 * @param {number?} o.outputRate output rate (0.1s)
 * @param {number?} o.outputDelay output delay (0.1s)
 * @param {number?} o.delay initial delay (0s)
 * @returns {Promise}
 */
async function retime(f, o) {
  var d = await fs6.promises.readFile(f, 'utf8');
  d = retimeData(d, o);
  await fs6.promises.writeFile(f, d);
}
const fs7 = require('fs');

/**
 * Updates time in asciicast file.
 * @param {string} f filename
 * @param {object} o options
 * @param {string?} o.input input text
 * @param {number?} o.inputRate input rate (0.1s)
 * @param {number?} o.inputDelay input delay (1s)
 * @param {number?} o.outputRate output rate (0.1s)
 * @param {number?} o.outputDelay output delay (0.1s)
 * @param {number?} o.delay initial delay (0s)
 */
function retimeSync(f, o) {
  var d = fs7.readFileSync(f, 'utf8');
  d = retimeData(d, o);
  fs7.writeFileSync(f, d);
}
const cp8 = require('child_process');

/**
 * Upload recorded asciicast to asciinema.org site.
 * @param {string} f filename
 * @param {function?} fn callback (err, asciicast URL)
 * @returns {Promise<string>} asciicast URL
 */
function upload(f, fn=null) {
  var p = new Promise((fres, frej) => {
    cp8.exec(`asciinema upload ${f}`, {encoding: 'utf8'}, (err, stdout) => {
      if(err) return frej(err);
      fres(stdout.replace(/.*?(https?:\S+).*/s, '$1'));      
    });
  });
  return fn? p.then(a => fn(null, a), fn) : p;
}
const cp9 = require('child_process');

/**
 * Upload recorded asciicast to asciinema.org site.
 * @param {string} f filename
 * @returns {string} asciicast URL
 */
function uploadSync(f) {
  var stdout = cp9.execSync(`asciinema upload ${f}`, {encoding: 'utf8'});
  return stdout.replace(/.*?(https?:\S+).*/s, '$1');
}
exports.cat = cat;
exports.catSync = catSync;
exports.rec = rec;
exports.recSync = recSync;
exports.retime = retime;
exports.retimeData = retimeData;
exports.retimeSync = retimeSync;
exports.upload = upload;
exports.uploadSync = uploadSync;
