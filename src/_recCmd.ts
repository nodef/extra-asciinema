import * as path from "path";

function escapePath(p) {
  return p.replace(/[`$&{}[;|]/g, "");
}

function recCmd(f: string, o: any=null): string[] {
  var o = o||{};
  // if input file given, execute on node.js
  if(o.input) {
    var pth = escapePath(o.input);
    var dir = path.dirname(pth);
    var fil = path.basename(pth);
    o.command = `cd "${dir}" && cat "${fil}" | node -i`;
  }
  o.overwrite = true;
  o.yes = true;
  var args = ["rec"];
  if(f) args.push(f);
  if(o.stdin) args.push("--stdin");
  if(o.append) args.push("--append");
  if(o.raw) args.push("--raw");
  if(o.overwrite) args.push("--overwrite");
  if(o.command) args.push("--command", o.command);
  if(o.env) args.push("-env", o.env);
  if(o.title) args.push("--title", o.title);
  if(o.idleTimeLimit) args.push("--idle-time-limit", ""+o.idleTimeLimit);
  if(o.yes) args.push("--yes");
  if(o.quiet) args.push("--quiet");
  return args;
}
export default recCmd;
