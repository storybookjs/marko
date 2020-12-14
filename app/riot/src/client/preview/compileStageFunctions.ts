import compiler from 'riot-compiler';

export const alreadyCompiledMarker = "var riot = require('riot')";

export function asCompiledCode(text: string) {
  return compiler
    .compile(text, {})
    .replace('var riot = require("riot")', '')
    .replace('riot.tag2(', 'tag2(');
}

export function compileNow(tag2: unknown, text: string) {
  // eslint-disable-next-line no-eval
  return tag2 && eval(asCompiledCode(text));
}

export function getRidOfRiotNoise(compiled: string) {
  return compiled.replace(/riot\.tag2/g, 'tag2').replace(alreadyCompiledMarker, '');
}

export function setConstructor(compiledSourceCode: string, constructor: any) {
  return compiledSourceCode.replace(/function\(opts\)\s*{\s*}(?=\);$)/, constructor.toString());
}
