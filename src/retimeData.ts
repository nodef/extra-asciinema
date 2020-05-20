import type {RetimeOptions} from './_types';

/**
 * Updates time in asciicast data.
 * @param d asciicast data
 * @param o options
 * @returns updated asciicast data
 */
function retimeData(d: string, o: RetimeOptions=null): string {
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
export default retimeData;
