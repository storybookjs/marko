// @ts-ignore
import svelteDoc from 'sveltedoc-parser';

/**
 * webpack loader for sveltedoc-parser
 * @param source raw svelte component
 */
export function svelteDocgen(source: any) {
  const options = {
    fileContent: source,
  };
  svelteDoc
    .parse(options)
    .then((componentDoc: any) => {
      console.log(componentDoc);
    })
    .catch((e: Error) => {
      console.error(e);
    });
  return source;
}
