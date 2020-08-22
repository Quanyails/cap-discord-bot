export const assertNever = (n: never): never => {
  throw new Error(`Unexpected value for never: ${n}`);
};
