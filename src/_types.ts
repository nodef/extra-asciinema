export type callbackFn = (err: any, ans?: any) => void;

export interface RecOptions {
  /** input javascript file. */
  input?: string,
  /** append to file? (false) */
  append?: boolean,
  /** save in raw format? (false) */
  raw?: boolean,
  /** overwrite existing file? (true) */
  overwrite?: boolean,
  /** command to record. (cat ${input} | node -i) */
  command?: string,
  /** environment variables. */
  env?: string,
  /** file title. */
  title?: string,
  /** maximum idle tile. */
  idleTimeLimit?: number
};

export interface RetimeOptions {
  /** input text. */
  input?: string,
  /** input rate. (0.1s) */
  inputRate?: number,
  /** input delay. (1s) */
  inputDelay?: number,
  /** output rate. (0.1s) */
  outputRate?: number,
  /** output delay. (0.1s) */
  outputDelay?: number,
  /** initial delay. (0s) */
  delay?: number
};
