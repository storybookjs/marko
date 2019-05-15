const mdxToJsx = require('@mdx-js/mdx/mdx-hast-to-jsx');
const parser = require('@babel/parser');
const generate = require('@babel/generator').default;
const camelCase = require('lodash.camelcase');

// Generate the MDX as is, but append named exports for every
// story in the contents

const STORY_REGEX = /^<Story /;
const PREVIEW_REGEX = /^<Preview[ >]/;
const RESERVED = /^(?:do|if|in|for|let|new|try|var|case|else|enum|eval|false|null|this|true|void|with|await|break|catch|class|const|super|throw|while|yield|delete|export|import|public|return|static|switch|typeof|default|extends|finally|package|private|continue|debugger|function|arguments|interface|protected|implements|instanceof)$/;

function getAttr(elt, what) {
  const attr = elt.attributes.find(n => n.name.name === what);
  return attr && attr.value;
}

function getStoryFn(name, counter) {
  if (name) {
    const storyFn = camelCase(name.replace(/[^a-z0-9-]/g, '-'));
    if (storyFn.length > 1 && !RESERVED.exec(storyFn)) {
      return storyFn;
    }
  }
  return `story${counter}`;
}

function genStoryExport(ast, input, counter) {
  let storyName = getAttr(ast.openingElement, 'name');
  let storyId = getAttr(ast.openingElement, 'id');
  storyName = storyName && storyName.value;
  storyId = storyId && storyId.value;

  // We don't generate exports for story references or the smart "current story"
  if (storyId || !storyName) {
    return null;
  }

  // console.log('genStoryExport', JSON.stringify(ast, null, 2));

  const statements = [];
  const storyFn = getStoryFn(storyName, counter);

  // FIXME: handle fragments
  let body = ast.children.find(n => n.type !== 'JSXText');
  if (body.type === 'JSXExpressionContainer') {
    body = body.expression;
  }

  const { code } = generate(body, {});
  statements.push(
    `export const ${storyFn} = () => (
      ${code}
    );`
  );

  if (storyName !== storyFn) {
    statements.push(`${storyFn}.title = '${storyName}';`);
  }

  let parameters = getAttr(ast.openingElement, 'parameters');
  parameters = parameters && parameters.expression;
  const source = `\`${code.replace(/`/g, '\\`')}\``;
  if (parameters) {
    const { code: params } = generate(parameters, {});
    // FIXME: hack in the story's source as a parameter
    statements.push(`${storyFn}.parameters = { mdxSource: ${source}, ...${params} };`);
  } else {
    statements.push(`${storyFn}.parameters = { mdxSource: ${source} };`);
  }

  // console.log(statements);

  return [statements.join('\n')];
}

function genPreviewExports(ast, input, counter) {
  // console.log('genPreviewExports', JSON.stringify(ast, null, 2));

  let localCounter = counter;
  const previewExports = [];
  for (let i = 0; i < ast.children.length; i += 1) {
    const child = ast.children[i];
    if (child.type === 'JSXElement' && child.openingElement.name.name === 'Story') {
      const storyExport = genStoryExport(child, input, localCounter);
      if (storyExport) {
        previewExports.push(storyExport);
        localCounter += 1;
      }
    }
  }
  return previewExports;
}

function getStories(node, counter) {
  const { value, type } = node;
  // Single story
  if (type === 'jsx') {
    try {
      if (STORY_REGEX.exec(value)) {
        // Single story
        const ast = parser.parseExpression(value, { plugins: ['jsx'] });
        const storyExport = genStoryExport(ast, value, counter);
        return storyExport && [storyExport];
      }
      if (PREVIEW_REGEX.exec(value)) {
        // Preview, possibly containing multiple stories
        const ast = parser.parseExpression(value, { plugins: ['jsx'] });
        return genPreviewExports(ast, value, counter);
      }
    } catch (err) {
      console.log(err);
      console.log(value);
    }
  }
  return null;
}

// insert `mdxKind` into the context so that we can know what "kind" we're rendering into
// when we render <Story name="xxx">...</Story>, since this MDX can be attached to any `selectedKind`!
const wrapperJs = `
let mdxKind = null;
let meta = null;
if (typeof componentMeta !== 'undefined' && componentMeta) {
  mdxKind = componentMeta.title || componentMeta.displayName;
  meta = componentMeta;
}
const WrappedMDXContent = ({ context }) => <DocsContainer context={{...context, mdxKind}} content={MDXContent} />;
if (meta) {
  meta.parameters = meta.parameters || {};
  meta.parameters.docs = WrappedMDXContent;
}
export default WrappedMDXContent;
`.trim();

function extractStories(node, options) {
  // we're overriding default export
  const defaultJsx = mdxToJsx.toJSX(node, {}, { ...options, skipExport: true });
  const storyExports = [];
  let counter = 0;
  node.children.forEach(n => {
    const stories = getStories(n, counter);
    if (stories) {
      stories.forEach(story => {
        storyExports.push(story);
        counter += 1;
      });
    }
  });

  const fullJsx = [
    'import { DocsContainer } from "@storybook/addon-docs/blocks"',
    defaultJsx,
    wrapperJs,
    ...storyExports,
  ].join('\n\n');

  return fullJsx;
}

function createCompiler(mdxOptions) {
  return function compiler(options = {}) {
    this.Compiler = tree => extractStories(tree, options, mdxOptions);
  };
}

module.exports = createCompiler;
