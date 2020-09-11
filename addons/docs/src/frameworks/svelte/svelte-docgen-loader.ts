import svelteDoc from 'sveltedoc-parser';

import * as path from 'path';

/**
 * webpack loader for sveltedoc-parser
 * @param source raw svelte component
 */
export default async function svelteDocgen(source: string) {
  // get filename for source content
  // eslint-disable-next-line no-underscore-dangle
  const file = path.basename(this._module.resource);

  // set SvelteDoc options
  const options = {
    fileContent: source,
    version: 3,
  };

  let docgen = '';

  try {
    const componentDoc = await svelteDoc.parse(options);

    // populate filename in docgen
    componentDoc.name = path.basename(file);

    docgen = `
    export const __docgen = ${JSON.stringify(componentDoc)};
  `;
  } catch (error) {
    console.error(error);
  }
  // inject __docgen prop in svelte component
  const output = source.replace('</script>', `${docgen}</script>`);

  return output;
}
