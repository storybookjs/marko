const mdxToJsx = require('@mdx-js/mdx/mdx-hast-to-jsx');
const parser = require('@babel/parser');
const generate = require('@babel/generator').default;
const camelCase = require('lodash.camelcase');

// Generate the MDX as is, but append named exports for every
// story in the contents

const STORY_REGEX = /^<Story /;
const RESERVED = /^(?:do|if|in|for|let|new|try|var|case|else|enum|eval|false|null|this|true|void|with|await|break|catch|class|const|super|throw|while|yield|delete|export|import|public|return|static|switch|typeof|default|extends|finally|package|private|continue|debugger|function|arguments|interface|protected|implements|instanceof)$/;

function getAttr(elt, what) {
  const attr = elt.attributes.find(n => n.name.name === what);
  return attr && attr.value.value;
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

function getStory(node, counter) {
  if (node.type !== 'jsx' || !STORY_REGEX.exec(node.value)) {
    return null;
  }

  const ast = parser.parseExpression(node.value, { plugins: ['jsx'] });
  const storyName = getAttr(ast.openingElement, 'name');

  // console.log(JSON.stringify(ast, null, 2));

  const statements = [];
  const storyFn = getStoryFn(storyName, counter);

  // FIXME: handle fragments
  const body = ast.children.find(n => n.type === 'JSXElement');
  const { code } = generate(body, {});
  statements.push(
    `export const ${storyFn} = () => (
      ${code}
    );`
  );

  if (storyName !== storyFn) {
    statements.push(`${storyFn}.title = '${storyName}';`);
  }

  // console.log(statements);

  return statements.join('\n');
}

function extractStories(node, options) {
  const outputJsx = mdxToJsx.toJSX(node, {}, options);
  const stories = [];
  let counter = 0;
  node.children.forEach(n => {
    const story = getStory(n, counter);
    if (story) {
      stories.push(story);
      counter += 1;
    }
  });
  return [
    'import { DocsContext as DC } from "@storybook/components"',
    outputJsx,
    `componentMeta.docs = ({ context }) => <DC.Provider value={context}><MDXContent /></DC.Provider>`,
    ...stories,
  ].join('\n\n');
}

function createCompiler(mdxOptions) {
  return function compiler(options = {}) {
    this.Compiler = tree => extractStories(tree, options, mdxOptions);
  };
}

module.exports = createCompiler;
