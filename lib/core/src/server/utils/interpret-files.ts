import fs from 'fs';
import { extensions } from 'interpret';

export const boost = new Set(['.js', '.jsx', '.ts', '.tsx', '.cjs', '.mjs']);

function sortExtensions() {
  return [
    ...Array.from(boost),
    ...Object.keys(extensions)
      .filter((ext) => !boost.has(ext))
      .sort((a, b) => a.length - b.length),
  ];
}

const possibleExtensions = sortExtensions();

export function getInterpretedFile(pathToFile: string) {
  return possibleExtensions
    .map((ext) => (pathToFile.endsWith(ext) ? pathToFile : `${pathToFile}${ext}`))
    .find((candidate) => fs.existsSync(candidate));
}

export function getInterpretedFileWithExt(pathToFile: string) {
  return possibleExtensions
    .map((ext) => ({ path: pathToFile.endsWith(ext) ? pathToFile : `${pathToFile}${ext}`, ext }))
    .find((candidate) => fs.existsSync(candidate.path));
}
