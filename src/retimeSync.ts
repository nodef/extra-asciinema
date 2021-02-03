import retimeData from "./retimeData";
import * as fs from "fs";
import type {RetimeOptions} from "./_types";

/**
 * Updates time in asciicast file.
 * @param f filename
 * @param o options
 * @param o.input input text
 * @param o.inputRate input rate (0.1s)
 * @param o.inputDelay input delay (1s)
 * @param o.outputRate output rate (0.1s)
 * @param o.outputDelay output delay (0.1s)
 * @param o.delay initial delay (0s)
 */
function retimeSync(f: string, o: RetimeOptions=null): void {
  var d = fs.readFileSync(f, "utf8");
  d = retimeData(d, o);
  fs.writeFileSync(f, d);
}
export default retimeSync;
