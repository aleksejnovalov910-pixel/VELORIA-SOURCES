export const logger = {
  info(message: string, ...args: unknown[]) {
    console.log(`[VELORIA] ${message}`, ...args);
  },
  warn(message: string, ...args: unknown[]) {
    console.warn(`[VELORIA] ${message}`, ...args);
  },
  error(message: string, ...args: unknown[]) {
    console.error(`[VELORIA] ${message}`, ...args);
  }
};
