import svelteDoc from 'sveltedoc-parser';

import * as path from 'path';

/**
 * webpack loader for sveltedoc-parser
 * @param source raw svelte component
 */
export default async function svelteDocgen(source: string) {
  // eslint-disable-next-line no-underscore-dangle
  const { resource } = this._module;

  // get filename for source content
  const file = path.basename(resource);
  // set SvelteDoc options
  const options = {
    filename: resource,
    version: 3,
  };

  let docgen = '';

  try {
    const componentDoc = await svelteDoc.parse(options);

    // populate filename in docgen
    componentDoc.name = path.basename(file);

    const componentName = path.parse(resource).name;

    docgen = `
    ${componentName}.__docgen = ${JSON.stringify(componentDoc)};
  `;
  } catch (error) {
    console.error(error);
  }
  // inject __docgen prop in svelte component
  const output = source + docgen;

  return output;
}
