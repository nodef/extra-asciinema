const retimeData = require('./retimeData');
const fs = require('fs');

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
  var d = fs.readFileSync(f, 'utf8');
  d = retimeData(d, o);
  fs.writeFileSync(f, d);
}
module.exports = retimeSync;
