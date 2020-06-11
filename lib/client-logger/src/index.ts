import { LOGLEVEL, console } from 'global';

type LogLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'silent';

const levels: Record<LogLevel, number> = {
  trace: 1,
  debug: 2,
  info: 3,
  warn: 4,
  error: 5,
  silent: 10,
};

const currentLogLevelString: LogLevel = LOGLEVEL as LogLevel;
const currentLogLevelNumber: number = levels[currentLogLevelString] || 3;

export const logger = {
  trace: (message: any, ...rest: any[]): void =>
    currentLogLevelNumber <= 1 && console.trace(message, ...rest),
  debug: (message: any, ...rest: any[]): void =>
    currentLogLevelNumber <= 2 && console.debug(message, ...rest),
  info: (message: any, ...rest: any[]): void =>
    currentLogLevelNumber <= 3 && console.info(message, ...rest),
  warn: (message: any, ...rest: any[]): void =>
    currentLogLevelNumber <= 4 && console.warn(message, ...rest),
  error: (message: any, ...rest: any[]): void =>
    currentLogLevelNumber <= 5 && console.error(message, ...rest),
  log: (message: any, ...rest: any[]): void =>
    currentLogLevelNumber <= 9 && console.log(message, ...rest),
} as const;

export const pretty = (type: keyof typeof logger) => (...args: string[]) => {
  const argArray = [];

  if (args.length) {
    const startTagRe = /<span\s+style=(['"])([^'"]*)\1\s*>/gi;
    const endTagRe = /<\/span>/gi;

    let reResultArray;
    argArray.push(args[0].replace(startTagRe, '%c').replace(endTagRe, '%c'));
    // eslint-disable-next-line no-cond-assign
    while ((reResultArray = startTagRe.exec(args[0]))) {
      argArray.push(reResultArray[2]);
      argArray.push('');
    }

    // pass through subsequent args since chrome dev tools does not (yet) support console.log styling of the following form: console.log('%cBlue!', 'color: blue;', '%cRed!', 'color: red;');
    // eslint-disable-next-line no-plusplus
    for (let j = 1; j < args.length; j++) {
      argArray.push(args[j]);
    }
  }

  // eslint-disable-next-line prefer-spread
  logger[type].apply(logger, argArray);
};

pretty.trace = pretty('trace');
pretty.debug = pretty('debug');
pretty.info = pretty('info');
pretty.warn = pretty('warn');
pretty.error = pretty('error');
