import { getOptions } from 'loader-utils';
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

  return new Promise(resolve =>
    resolve({
      source,
      sourceJson,
      addsMap,
    })
  );
}

export function readStory(classLoader, inputSource) {
  return readAsObject(classLoader, inputSource, true);
}
