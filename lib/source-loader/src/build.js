import { SourceMapConsumer, SourceNode } from 'source-map';

import { readStory } from './dependencies-lookup/readAsObject';

export async function transform(inputSource, inputSourceMap) {
  const callback = this.async();

  try {
    const sourceObject = await readStory(this, inputSource);
    // if source-loader had trouble parsing the story exports, return the original story
    // example is
    // const myStory = () => xxx
    // export { myStory }
    if (!sourceObject.source || sourceObject.source.length === 0) {
      callback(null, inputSource, inputSourceMap);
      return;
    }

    const { source, sourceJson, addsMap } = sourceObject;

    // Use the SourceNode to produce the code. Given that the source mapping here is trivial it's easier to just
    // always build a sourcemap rather than to have two different code paths.
    let sourceNode;
    if (inputSourceMap) {
      // The inputSourceMap here should be a SourceMapGenerator, or just a plain source map JSON object.
      sourceNode = await SourceMapConsumer.with(
        JSON.stringify(inputSourceMap),
        null,
        (consumer) => {
          return SourceNode.fromStringWithSourceMap(source, consumer);
        }
      );
    } else {
      // Build an identity sourcemap. Note that "source" is already potentially differing from "inputSource"
      // due to other loaders, so while we need to use "source" for the source node contents to generate the correct
      // code, we still want to use "inputSource" as the source content.
      sourceNode = new SourceNode();
      sourceNode.add(
        source
          .split(/\n/)
          .map((line, index) => new SourceNode(index + 1, 0, this.resourcePath, `${line}\n`))
      );

      sourceNode.setSourceContent(this.resourcePath, inputSource);
    }

    // Prepend the preamble
    const preamble = `
      /* eslint-disable */
      // @ts-nocheck
      // @ts-ignore
      var __STORY__ = ${sourceJson};
      // @ts-ignore
      var __LOCATIONS_MAP__ = ${JSON.stringify(addsMap)};`;
    sourceNode.prepend(`${preamble}\n`);

    // Generate the code and the source map for the next loader
    const { code, map } = sourceNode.toStringWithSourceMap();
    callback(null, code, map);
  } catch (e) {
    callback(e);
  }
}
