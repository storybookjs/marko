import { storiesOf, configure } from '@storybook/react';

let previousExports = {};
if (module && module.hot && module.hot.dispose) {
  ({ previousExports = {} } = module.hot.data || {});

  module.hot.dispose(data => {
    // eslint-disable-next-line no-param-reassign
    data.previousExports = previousExports;
  });
}

function importAll(context) {
  const storyStore = window.__STORYBOOK_CLIENT_API__._storyStore; // eslint-disable-line no-undef, no-underscore-dangle

  context.keys().forEach(filename => {
    const fileExports = context(filename);

    // A old-style story file
    if (!fileExports.componentMeta) {
      return;
    }

    const { componentMeta, default: mdxDefault, ...examples } = fileExports;

    let componentOptions = componentMeta;
    if (componentMeta.prototype && componentMeta.prototype.isReactComponent) {
      componentOptions = { componentMeta };
    }
    const kindName = componentOptions.title || componentOptions.componentMeta.displayName;

    if (previousExports[filename]) {
      if (previousExports[filename] === fileExports) {
        return;
      }

      // Otherwise clear this kind
      storyStore.removeStoryKind(kindName);
      storyStore.incrementRevision();
    }

    // We pass true here to avoid the warning about HMR. It's cool clientApi, we got this
    const kind = storiesOf(kindName, true);

    (componentOptions.decorators || []).forEach(decorator => {
      kind.addDecorator(decorator);
    });
    if (componentOptions.parameters) {
      kind.addParameters(componentOptions.parameters);
    }

    Object.keys(examples).forEach(key => {
      const example = examples[key];
      const { title = example.title || key, parameters } = example;
      kind.add(title, example, parameters);
    });

    previousExports[filename] = fileExports;
  });
}

function loadStories() {
  let req;
  req = require.context('../src', true, /\.stories\.js$/);
  importAll(req);

  req = require.context('../src', true, /\.stories\.mdx$/);
  importAll(req);
}

configure(loadStories, module);
