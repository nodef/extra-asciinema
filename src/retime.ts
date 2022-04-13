import retimeData from "./retimeData";
import * as fs from "fs";
import type {RetimeOptions} from "./_types";

/**
 * Update time in asciicast file.
 * @param f filename
 * @param o options
 * @returns promise
 */
async function retime(f: string, o: RetimeOptions=null): Promise<any> {
  var d = await fs.promises.readFile(f, "utf8");
  d = retimeData(d, o);
  await fs.promises.writeFile(f, d);
}
export default retime;
