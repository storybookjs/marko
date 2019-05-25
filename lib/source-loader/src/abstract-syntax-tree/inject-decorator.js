import defaultOptions from './default-options';
import getParser from './parsers';

import {
  generateSourceWithDecorators,
  generateSourceWithoutDecorators,
  generateStorySource,
  generateStoriesLocationsMap,
  generateDependencies,
} from './generate-helpers';

function extendOptions(source, comments, filepath, options) {
  return {
    ...defaultOptions,
    ...options,
    source,
    comments,
    filepath,
  };
}

function inject(source, filepath, options = {}, log = message => {}) {
  const { injectDecorator = true } = options;
  const obviouslyNotCode = ['md', 'txt', 'json'].includes(options.parser);
  let parser = null;
  try {
    parser = getParser(options.parser);
  } catch (e) {
    log(new Error(`(not fatal, only impacting storysource) Could not load a parser (${e})`));
  }

  if (obviouslyNotCode || !parser) {
    return {
      source,
      storySource: {},
      addsMap: {},
      changed: false,
      dependencies: [],
    };
  }
  const ast = parser.parse(source);

  const { changed, source: newSource, comments } =
    injectDecorator === true
      ? generateSourceWithDecorators(source, ast, options.injectParameters)
      : generateSourceWithoutDecorators(source, ast);

  const storySource = generateStorySource(extendOptions(source, comments, filepath, options));
  const newAst = parser.parse(storySource);
  const { dependencies, storiesOfIdentifiers } = generateDependencies(newAst);
  const { addsMap, idsToFrameworks } = generateStoriesLocationsMap(newAst, storiesOfIdentifiers);

  if (!changed && Object.keys(addsMap || {}).length === 0) {
    return {
      source: newSource,
      storySource,
      addsMap: {},
      changed,
      dependencies,
      idsToFrameworks: idsToFrameworks || {},
    };
  }

  return {
    source: newSource,
    storySource,
    addsMap,
    changed,
    dependencies,
    idsToFrameworks: idsToFrameworks || {},
  };
}

export default inject;
