import { getOptions } from 'loader-utils';
import path from 'path';
import injectDecorator from '../abstract-syntax-tree/inject-decorator';

function readAsObject(classLoader, inputSource, mainFile) {
  const options = getOptions(classLoader) || {};
  const result = injectDecorator(
    inputSource,
    classLoader.resourcePath,
    {
      ...options,
      parser: options.parser || classLoader.extension,
    },
    classLoader.emitWarning.bind(classLoader)
  );

  const sourceJson = JSON.stringify(result.storySource || inputSource)
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');

  const addsMap = result.addsMap || {};
  const source = mainFile ? result.source : inputSource;
  const resource = classLoader.resourcePath || classLoader.resource;

  const workspaceFileNames = [];

  return Promise.all(
    workspaceFileNames.map(
      d =>
        new Promise(resolve =>
          classLoader.loadModule(d, (err1, compiledSource, sourceMap, theModule) => {
            if (err1) {
              classLoader.emitError(err1);
            }
            classLoader.fs.readFile(theModule.resource, (err2, dependencyInputData) => {
              if (err2) {
                classLoader.emitError(err2);
              }
              resolve({
                d,
                err: err1 || err2,
                inputSource: dependencyInputData.toString(),
                compiledSource,
                sourceMap,
                theModule,
              });
            });
          })
        )
    )
  )
    .then(data =>
      Promise.all(
        data.map(({ inputSource: dependencyInputSource, theModule }) =>
          readAsObject(
            {
              ...classLoader,
              resourcePath: theModule.resourcePath,
              resource: theModule.resource,
              extension: (theModule.resource || '').split('.').slice(-1)[0],
            },
            dependencyInputSource
          )
        )
      ).then(moduleObjects =>
        Object.assign(
          {},
          ...moduleObjects.map(asObject => ({
            [asObject.resource]: asObject,
          }))
        )
      )
    )
    .then(() => ({
      resource,
      source,
      sourceJson,
      addsMap,
    }));
}

export function readStory(classLoader, inputSource) {
  return readAsObject(classLoader, inputSource, true);
}
