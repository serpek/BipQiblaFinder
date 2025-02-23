// type ConsoleMethod =
//   | 'log'
//   | 'warn'
//   | 'error'
//   | 'info'
//   | 'debug'
//   | 'table'
//   | 'trace'

// const originalConsole: Record<ConsoleMethod, (...args: any[]) => void> = {
//   log: console.log.bind(console),
//   warn: console.warn.bind(console),
//   error: console.error.bind(console),
//   info: console.info.bind(console),
//   debug: console.debug.bind(console),
//   table: console.table.bind(console),
//   trace: console.trace.bind(console)
// }
//
// function overrideConsoleMethod(methodName: ConsoleMethod): void {
//   console[methodName] = (...args: unknown[]): void => {
//     Reflect.apply(originalConsole[methodName], console, args)
//   }
// }
//
// const methodsToOverride: ConsoleMethod[] = [
//   'log',
//   'warn',
//   'error',
//   'info',
//   'debug',
//   'table',
//   'trace'
// ]

//methodsToOverride.forEach(overrideConsoleMethod)
