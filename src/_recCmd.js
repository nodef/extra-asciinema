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
module.exports = recCmd;
