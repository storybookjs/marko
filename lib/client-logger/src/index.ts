const { console } = global;

/* tslint:disable: no-console */

export const logger = {
  debug: (message: any, ...rest: any[]): void => console.debug(message, ...rest),
  log: (message: any, ...rest: any[]): void => console.log(message, ...rest),
  info: (message: any, ...rest: any[]): void => console.info(message, ...rest),
  warn: (message: any, ...rest: any[]): void => console.warn(message, ...rest),
  error: (message: any, ...rest: any[]): void => console.error(message, ...rest),
};

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
  console[type].apply(console, argArray);
};

pretty.debug = pretty('debug');
pretty.log = pretty('log');
pretty.info = pretty('info');
pretty.warn = pretty('warn');
pretty.error = pretty('error');
