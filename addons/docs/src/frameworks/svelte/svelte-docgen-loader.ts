/* eslint-disable no-param-reassign */
// @ts-ignore
import svelteDoc from 'sveltedoc-parser';

import * as path from 'path';

import * as fs from 'fs';
import { string } from 'prop-types';

const SVELTE_DOCGEN = {};
/**
 * webpack loader for sveltedoc-parser
 * @param source raw svelte component
 */
export default async function svelteDocgen(source: string) {
  const file = path.basename(this._module.resource);
  const options = {
    fileContent: source,
    version: 3,
  };

  console.log('File: ', file);
  let docgen = '';

  try {
    const componentDoc = await svelteDoc.parse(options);
    docgen = `
    export const __docgen = ${JSON.stringify(componentDoc)};
  `;
  } catch (error) {
    console.error(error);
  }

  const output = source.replace('</script>', `${docgen}</script>`);

  return output;
}

function insert(str: string, index: number, value: string) {
  return str.substr(0, index) + value + str.substr(index);
}
