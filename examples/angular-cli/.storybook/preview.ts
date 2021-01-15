import { addParameters } from '@storybook/angular';
import { setCompodocJson } from '@storybook/addon-docs/angular';
import { prepareForInline } from '@storybook/addon-docs/angular/inline';
import addCssWarning from '../src/cssWarning';

// @ts-ignore
// eslint-disable-next-line import/extensions, import/no-unresolved
import docJson from '../documentation.json';
// remove ButtonComponent to test #12009
const filtered = !docJson?.components
  ? docJson
  : {
      ...docJson,
      components: docJson.components.filter((c) => c.name !== 'ButtonComponent'),
    };
setCompodocJson(filtered);

addCssWarning();

addParameters({
  docs: {
    inlineStories: true,
    prepareForInline,
  },
});
