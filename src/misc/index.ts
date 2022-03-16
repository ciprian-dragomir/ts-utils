export const noop: () => void = () => {};

export const logValue = <T>(value: T, message?: string, logFn = console.log): T => {
  if (logFn) {
    message ? logFn(message, value) : logFn(value);
  }
  return value;
};
