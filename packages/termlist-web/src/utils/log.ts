/* eslint-disable no-console */
export const log = (...msgs: unknown[]): void => {
  console.log(...msgs)
}

export const logError = (...msgs: unknown[]): void => {
  console.error(...msgs)
}
