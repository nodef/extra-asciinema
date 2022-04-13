import retimeData from "./retimeData";
import * as fs from "fs";
import type {RetimeOptions} from "./_types";

/**
 * Update time in asciicast file.
 * @param f filename
 * @param o options
 */
function retimeSync(f: string, o: RetimeOptions=null): void {
  var d = fs.readFileSync(f, "utf8");
  d = retimeData(d, o);
  fs.writeFileSync(f, d);
}
export default retimeSync;
