export type callbackFn = (err: any, ans?: any) => void;

export interface RecOptions {
  /** Input javascript file. */
  input?: string,
  /** Append to file? (false) */
  append?: boolean,
  /** Save in raw format? (false) */
  raw?: boolean,
  /** Overwrite existing file? (true) */
  overwrite?: boolean,
  /** Command to record. (cat ${input} | node -i) */
  command?: string,
  /** Environment variables. */
  env?: string,
  /** File title. */
  title?: string,
  /** Maximum idle tile. */
  idleTimeLimit?: number
};

export interface RetimeOptions {
  /** Input text. */
  input?: string,
  /** Input rate. (0.1s) */
  inputRate?: number,
  /** Input delay. (1s) */
  inputDelay?: number,
  /** Output rate. (0.1s) */
  outputRate?: number,
  /** Output delay. (0.1s) */
  outputDelay?: number,
  /** Initial delay. (0s) */
  delay?: number
};
